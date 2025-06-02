import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get query parameters for team/league filtering
    const url = new URL(req.url)
    const teamId = url.searchParams.get('team_id') || '33' // Default to Manchester United
    const season = url.searchParams.get('season') || '2024'

    console.log(`Starting player data import for team ${teamId}, season ${season}...`)

    // First, let's try to get available leagues and teams to understand the API structure
    const explorationEndpoints = [
      'https://free-api-live-football-data.p.rapidapi.com/football-get-leagues',
      'https://free-api-live-football-data.p.rapidapi.com/football-get-teams',
      `https://free-api-live-football-data.p.rapidapi.com/football-get-teams-by-league?league_id=1`,
      `https://free-api-live-football-data.p.rapidapi.com/football-get-teams-by-league?league_id=39`
    ]

    console.log('Exploring API structure...')
    for (const endpoint of explorationEndpoints) {
      try {
        console.log(`Testing endpoint: ${endpoint}`)
        const response = await fetch(endpoint, {
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
          }
        })
        console.log(`Endpoint ${endpoint} status: ${response.status}`)
        if (response.ok) {
          const data = await response.json()
          console.log(`Endpoint ${endpoint} response preview:`, JSON.stringify(data).substring(0, 200))
        }
      } catch (e) {
        console.log(`Endpoint ${endpoint} failed:`, e.message)
      }
    }

    // Try different player API endpoints with various parameters
    const playerEndpoints = [
      // Original endpoints
      `https://free-api-live-football-data.p.rapidapi.com/football-get-team-squad?team_id=${teamId}`,
      `https://free-api-live-football-data.p.rapidapi.com/football-get-players-by-team?team_id=${teamId}`,
      `https://free-api-live-football-data.p.rapidapi.com/football-teams-players?team_id=${teamId}`,
      
      // Alternative parameter formats
      `https://free-api-live-football-data.p.rapidapi.com/football-get-team-squad?id=${teamId}`,
      `https://free-api-live-football-data.p.rapidapi.com/football-get-players?team=${teamId}`,
      `https://free-api-live-football-data.p.rapidapi.com/football-players?team_id=${teamId}`,
      
      // With season parameter
      `https://free-api-live-football-data.p.rapidapi.com/football-get-team-squad?team_id=${teamId}&season=${season}`,
      `https://free-api-live-football-data.p.rapidapi.com/football-get-players-by-team?team_id=${teamId}&season=${season}`,
      
      // Different team ID formats (some APIs use different IDs)
      `https://free-api-live-football-data.p.rapidapi.com/football-get-team-squad?team_id=11`,
      `https://free-api-live-football-data.p.rapidapi.com/football-get-players-by-team?team_id=11`,
      
      // Try with league-based queries
      `https://free-api-live-football-data.p.rapidapi.com/football-get-players-by-league?league_id=39&season=${season}`,
      `https://free-api-live-football-data.p.rapidapi.com/football-get-players-by-league?league_id=1&season=${season}`
    ]
    
    let data = null
    let successfulEndpoint = null

    for (const apiUrl of playerEndpoints) {
      try {
        console.log(`Trying API endpoint: ${apiUrl}`)
        const response = await fetch(apiUrl, {
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
          }
        })

        console.log(`API Response Status: ${response.status}`)
        console.log(`API Response Headers:`, Object.fromEntries(response.headers.entries()))

        if (response.ok) {
          data = await response.json()
          successfulEndpoint = apiUrl
          console.log('Successfully fetched data from:', apiUrl)
          console.log('Response structure:', Object.keys(data))
          console.log('Response preview:', JSON.stringify(data).substring(0, 500))
          break
        } else {
          const errorText = await response.text()
          console.log(`Endpoint ${apiUrl} failed with status: ${response.status}, error: ${errorText}`)
        }
      } catch (endpointError) {
        console.log(`Endpoint ${apiUrl} failed with error:`, endpointError.message)
        continue
      }
    }

    if (!data || !successfulEndpoint) {
      console.log('All API endpoints failed, creating sample data instead')
      await createSamplePlayers(supabase, teamId)
      return new Response(
        JSON.stringify({ 
          message: 'Sample player data created successfully due to API failure',
          error: 'All API endpoints returned errors or 404',
          testedEndpoints: playerEndpoints,
          suggestion: 'The API structure may have changed. Consider checking the RapidAPI documentation for the correct endpoints.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Processing data from successful endpoint:', successfulEndpoint)

    // Process the data - try different response structures
    let players = []
    if (Array.isArray(data)) {
      players = data
    } else if (data.response && Array.isArray(data.response)) {
      players = data.response
    } else if (data.players && Array.isArray(data.players)) {
      players = data.players
    } else if (data.data && Array.isArray(data.data)) {
      players = data.data
    } else if (data.results && Array.isArray(data.results)) {
      players = data.results
    }

    console.log(`Found ${players.length} players to process`)

    if (players.length > 0) {
      let insertedCount = 0
      for (const player of players.slice(0, 30)) { // Limit to 30 players
        const playerData = {
          name: player.name || player.player_name || player.full_name || 'Unknown Player',
          club: player.team || player.club || player.team_name || player.statistics?.[0]?.team?.name || 'Unknown Club',
          age: player.age || calculateAgeFromBirth(player.birth?.date || player.date_of_birth || player.birthdate) || 25,
          date_of_birth: player.birth?.date || player.date_of_birth || player.birthdate || '1999-01-01',
          positions: [player.position || player.primary_position || player.pos || 'Unknown'],
          dominant_foot: player.foot || player.preferred_foot || 'Right',
          nationality: player.nationality || player.country || player.nation || 'Unknown',
          contract_status: 'Under Contract' as const,
          contract_expiry: null,
          region: getRegionFromNationality(player.nationality || player.country || player.nation || 'Unknown'),
          image_url: player.photo || player.image || player.picture || `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/300/300`
        }

        // Check if player already exists
        const { data: existingPlayer } = await supabase
          .from('players')
          .select('id')
          .eq('name', playerData.name)
          .eq('club', playerData.club)
          .single()

        if (!existingPlayer) {
          const { error } = await supabase
            .from('players')
            .insert(playerData)

          if (error) {
            console.error('Error inserting player:', error)
          } else {
            console.log('Inserted player:', playerData.name, 'from', playerData.club)
            insertedCount++
          }
        } else {
          console.log('Player already exists:', playerData.name, 'from', playerData.club)
        }
      }

      return new Response(
        JSON.stringify({ 
          message: `Successfully imported ${insertedCount} players from API`,
          endpoint: successfulEndpoint,
          totalFound: players.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.log('No players found in API response, creating sample data')
      await createSamplePlayers(supabase, teamId)
      return new Response(
        JSON.stringify({ 
          message: 'No player data found in API response, sample data created instead',
          endpoint: successfulEndpoint,
          rawResponse: data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Error in player import function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function calculateAgeFromBirth(birthDate: string): number | null {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

async function createSamplePlayers(supabase: any, teamId: string) {
  const samplePlayers = [
    {
      name: 'Marcus Johnson',
      club: 'Manchester United',
      age: 24,
      date_of_birth: '2000-03-15',
      positions: ['Forward'],
      dominant_foot: 'Right',
      nationality: 'England',
      contract_status: 'Under Contract',
      contract_expiry: null,
      region: 'Europe',
      image_url: 'https://picsum.photos/id/100/300/300'
    },
    {
      name: 'Diego Rodriguez',
      club: 'Manchester United',
      age: 26,
      date_of_birth: '1998-07-22',
      positions: ['Midfielder'],
      dominant_foot: 'Left',
      nationality: 'Spain',
      contract_status: 'Under Contract',
      contract_expiry: null,
      region: 'Europe',
      image_url: 'https://picsum.photos/id/101/300/300'
    },
    {
      name: 'James Wilson',
      club: 'Manchester United',
      age: 23,
      date_of_birth: '2001-01-10',
      positions: ['Defender'],
      dominant_foot: 'Right',
      nationality: 'England',
      contract_status: 'Under Contract',
      contract_expiry: null,
      region: 'Europe',
      image_url: 'https://picsum.photos/id/102/300/300'
    }
  ]

  for (const player of samplePlayers) {
    // Check if player already exists
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('id')
      .eq('name', player.name)
      .eq('club', player.club)
      .single()

    if (!existingPlayer) {
      const { error } = await supabase
        .from('players')
        .insert(player)

      if (error) {
        console.error('Error inserting sample player:', error)
      } else {
        console.log('Inserted sample player:', player.name)
      }
    } else {
      console.log('Sample player already exists:', player.name)
    }
  }
}

function getRegionFromNationality(nationality: string): string {
  const europeanCountries = ['England', 'France', 'Spain', 'Germany', 'Italy', 'Portugal', 'Netherlands', 'Belgium', 'Poland', 'Ukraine', 'Norway', 'Sweden', 'Denmark', 'Switzerland', 'Austria', 'Czech Republic', 'Croatia', 'Serbia', 'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Turkey', 'Russia', 'Finland', 'Ireland', 'Scotland', 'Wales']
  const southAmericanCountries = ['Brazil', 'Argentina', 'Uruguay', 'Colombia', 'Chile', 'Peru', 'Ecuador', 'Paraguay', 'Bolivia', 'Venezuela', 'Guyana', 'Suriname']
  const northAmericanCountries = ['United States', 'Mexico', 'Canada', 'Costa Rica', 'Panama', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Jamaica', 'Trinidad and Tobago']
  const africanCountries = ['Nigeria', 'Ghana', 'Senegal', 'Morocco', 'Egypt', 'Algeria', 'Tunisia', 'Cameroon', 'Ivory Coast', 'Mali', 'Burkina Faso', 'South Africa', 'Kenya', 'Ethiopia']
  const asianCountries = ['Japan', 'South Korea', 'China', 'Australia', 'Iran', 'Saudi Arabia', 'UAE', 'Qatar', 'Iraq', 'Jordan', 'Lebanon', 'Syria', 'India', 'Thailand', 'Vietnam', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines']

  if (europeanCountries.includes(nationality)) return 'Europe'
  if (southAmericanCountries.includes(nationality)) return 'South America'
  if (northAmericanCountries.includes(nationality)) return 'North America'
  if (africanCountries.includes(nationality)) return 'Africa'
  if (asianCountries.includes(nationality)) return 'Asia'
  
  return 'Europe' // Default fallback
}
