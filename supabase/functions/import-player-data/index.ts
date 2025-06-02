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

    // Try to discover what endpoints are actually available
    const baseApiUrl = 'https://free-api-live-football-data.p.rapidapi.com'
    
    // Common football API endpoint patterns to try
    const potentialEndpoints = [
      '/api/fixtures/today',
      '/api/fixtures',
      '/fixtures',
      '/matches',
      '/teams',
      '/players',
      '/leagues',
      '/competitions',
      '/api/teams',
      '/api/players',
      '/api/leagues',
      '/football/fixtures',
      '/football/teams',
      '/football/players',
      '/football/leagues',
      '/v1/fixtures',
      '/v1/teams',
      '/v1/players',
      '/v2/fixtures',
      '/v2/teams',
      '/v2/players',
      '/'
    ]

    console.log('Attempting to discover available API endpoints...')
    
    const workingEndpoints = []
    
    for (const endpoint of potentialEndpoints) {
      try {
        console.log(`Testing endpoint: ${baseApiUrl}${endpoint}`)
        const response = await fetch(`${baseApiUrl}${endpoint}`, {
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
          }
        })
        
        console.log(`Endpoint ${endpoint} returned status: ${response.status}`)
        
        if (response.status === 200) {
          const data = await response.json()
          workingEndpoints.push({
            endpoint,
            status: response.status,
            dataKeys: Object.keys(data || {}),
            sampleData: JSON.stringify(data).substring(0, 200)
          })
          console.log(`✅ Working endpoint found: ${endpoint}`)
          console.log(`Data structure: ${Object.keys(data || {})}`)
        } else if (response.status !== 404) {
          // Non-404 errors might give us clues
          const errorText = await response.text()
          console.log(`Endpoint ${endpoint} error (${response.status}): ${errorText}`)
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed with error: ${error.message}`)
      }
    }

    if (workingEndpoints.length > 0) {
      console.log(`Found ${workingEndpoints.length} working endpoints:`, workingEndpoints)
      
      // Try to find player data from working endpoints
      for (const workingEndpoint of workingEndpoints) {
        try {
          const response = await fetch(`${baseApiUrl}${workingEndpoint.endpoint}`, {
            headers: {
              'x-rapidapi-key': rapidApiKey,
              'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            console.log(`Detailed data from ${workingEndpoint.endpoint}:`, JSON.stringify(data, null, 2))
            
            // Try to extract any player-like data
            if (data && typeof data === 'object') {
              const possiblePlayerData = extractPlayerData(data)
              if (possiblePlayerData.length > 0) {
                console.log(`Found potential player data in ${workingEndpoint.endpoint}`)
                // Process the player data
                await insertPlayerData(supabase, possiblePlayerData)
                return new Response(
                  JSON.stringify({ 
                    message: `Successfully imported ${possiblePlayerData.length} players from ${workingEndpoint.endpoint}`,
                    workingEndpoints
                  }),
                  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
              }
            }
          }
        } catch (error) {
          console.log(`Error processing ${workingEndpoint.endpoint}:`, error.message)
        }
      }
      
      return new Response(
        JSON.stringify({ 
          message: 'No player data found in working endpoints, but discovered API structure',
          workingEndpoints,
          suggestion: 'Check the working endpoints above to understand the API structure and modify the function accordingly'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      console.log('No working endpoints found - API may not be available or may require different authentication')
      
      // Create sample data as fallback
      await createSamplePlayers(supabase, teamId)
      
      return new Response(
        JSON.stringify({ 
          message: 'No working API endpoints found - created sample data instead',
          testedEndpoints: potentialEndpoints,
          suggestion: 'The API may not be available, may require different authentication, or may use a completely different base URL. Consider checking the RapidAPI documentation for this service.'
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

function extractPlayerData(data: any): any[] {
  const players = []
  
  // Try to find player data in various possible structures
  if (Array.isArray(data)) {
    for (const item of data) {
      if (isPlayerLike(item)) {
        players.push(item)
      }
    }
  } else if (data && typeof data === 'object') {
    // Check common property names that might contain player arrays
    const possiblePlayerArrays = [
      'players', 'squad', 'team', 'roster', 'data', 'results', 
      'response', 'items', 'content', 'payload'
    ]
    
    for (const prop of possiblePlayerArrays) {
      if (data[prop] && Array.isArray(data[prop])) {
        for (const item of data[prop]) {
          if (isPlayerLike(item)) {
            players.push(item)
          }
        }
      }
    }
  }
  
  return players
}

function isPlayerLike(item: any): boolean {
  if (!item || typeof item !== 'object') return false
  
  // Check if the object has player-like properties
  const playerIndicators = [
    'name', 'player_name', 'full_name', 'firstName', 'lastName',
    'position', 'pos', 'primary_position',
    'age', 'birth', 'date_of_birth', 'birthdate',
    'nationality', 'country', 'nation'
  ]
  
  return playerIndicators.some(indicator => 
    Object.keys(item).some(key => 
      key.toLowerCase().includes(indicator.toLowerCase())
    )
  )
}

async function insertPlayerData(supabase: any, players: any[]) {
  let insertedCount = 0
  
  for (const player of players.slice(0, 20)) { // Limit to 20 players
    const playerData = {
      name: player.name || player.player_name || player.full_name || `Player ${Math.random().toString(36).substr(2, 9)}`,
      club: player.team || player.club || player.team_name || 'Unknown Club',
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
  
  return insertedCount
}

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
