
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

    // Get query parameters for team filtering
    const url = new URL(req.url)
    const teamId = url.searchParams.get('team_id') || '8650' // Default to the working team ID

    console.log(`Starting player data import for team ${teamId}...`)

    // Use the correct API endpoint format
    const apiUrl = `https://free-api-live-football-data.p.rapidapi.com/football-get-list-player?teamid=${teamId}`
    
    console.log(`Fetching players from: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
      }
    })

    console.log(`API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      
      // Create sample data as fallback
      await createSamplePlayers(supabase, teamId)
      
      return new Response(
        JSON.stringify({ 
          message: `API returned ${response.status} error - created sample data instead`,
          error: errorText,
          teamId: teamId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('API response data:', JSON.stringify(data, null, 2))

    // Extract players from the API response
    let players = []
    if (Array.isArray(data)) {
      players = data
    } else if (data && data.players && Array.isArray(data.players)) {
      players = data.players
    } else if (data && data.data && Array.isArray(data.data)) {
      players = data.data
    } else if (data && data.response && Array.isArray(data.response)) {
      players = data.response
    } else if (data && typeof data === 'object') {
      // Try to find any array property that might contain player data
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) && value.length > 0) {
          console.log(`Found potential player array in property: ${key}`)
          players = value
          break
        }
      }
    }

    console.log(`Found ${players.length} potential players`)

    if (players.length === 0) {
      console.log('No players found in API response, creating sample data')
      await createSamplePlayers(supabase, teamId)
      
      return new Response(
        JSON.stringify({ 
          message: 'No players found in API response - created sample data instead',
          apiResponse: data,
          teamId: teamId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process and insert the player data
    const insertedCount = await insertPlayerData(supabase, players, teamId)
    
    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${insertedCount} players for team ${teamId}`,
        totalPlayersFound: players.length,
        teamId: teamId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

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

async function insertPlayerData(supabase: any, players: any[], teamId: string) {
  let insertedCount = 0
  
  // Get team name for the given team ID (you might want to maintain a mapping)
  const teamName = getTeamName(teamId)
  
  for (const player of players.slice(0, 20)) { // Limit to 20 players
    try {
      const playerData = {
        name: player.name || player.player_name || player.full_name || player.displayName || `Player ${Math.random().toString(36).substr(2, 9)}`,
        club: teamName,
        age: player.age || calculateAgeFromBirth(player.birth?.date || player.date_of_birth || player.birthdate) || Math.floor(Math.random() * 15) + 18,
        date_of_birth: player.birth?.date || player.date_of_birth || player.birthdate || generateRandomBirthDate(),
        positions: player.position ? [player.position] : (player.positions || ['Unknown']),
        dominant_foot: player.foot || player.preferred_foot || (Math.random() > 0.5 ? 'Right' : 'Left'),
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
    } catch (playerError) {
      console.error('Error processing player:', playerError, player)
    }
  }
  
  return insertedCount
}

function getTeamName(teamId: string): string {
  // Basic team ID to name mapping - you can expand this
  const teamMap: Record<string, string> = {
    '8650': 'Manchester United',
    '33': 'Manchester United',
    '8456': 'Chelsea',
    '8455': 'Arsenal',
    '8463': 'Liverpool',
    '8557': 'Manchester City'
  }
  
  return teamMap[teamId] || `Team ${teamId}`
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

function generateRandomBirthDate(): string {
  const currentYear = new Date().getFullYear()
  const randomAge = Math.floor(Math.random() * 15) + 18 // Age between 18-32
  const birthYear = currentYear - randomAge
  const month = Math.floor(Math.random() * 12) + 1
  const day = Math.floor(Math.random() * 28) + 1
  return `${birthYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

async function createSamplePlayers(supabase: any, teamId: string) {
  const teamName = getTeamName(teamId)
  const samplePlayers = [
    {
      name: 'Marcus Johnson',
      club: teamName,
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
      club: teamName,
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
      club: teamName,
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
