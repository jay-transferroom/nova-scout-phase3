
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { teamId, season = 2024 } = await req.json()
    console.log(`Starting player data import for team ${teamId}, season ${season}...`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First, get the team name from our teams table
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('name')
      .eq('external_api_id', teamId)
      .single()

    if (teamError || !teamData) {
      console.error('Team not found in database:', teamError)
      return new Response(
        JSON.stringify({ 
          message: `Team with ID ${teamId} not found in database. Please import teams first.`,
          error: teamError 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    const teamName = teamData.name
    console.log(`Found team: ${teamName}`)

    const apiUrl = `https://free-api-live-football-data.p.rapidapi.com/football-get-list-player?teamid=${teamId}`
    console.log(`Fetching players from: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'free-api-live-football-data.p.rapidapi.com'
      }
    })

    console.log(`API response status: ${response.status}`)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API response data:', JSON.stringify(data, null, 2))

    if (data.status !== 'success' || !data.response?.list?.squad) {
      throw new Error('Invalid API response structure')
    }

    const squad = data.response.list.squad
    let totalPlayersFound = 0
    let playersInserted = 0

    // Process all squad categories
    for (const category of squad) {
      if (category.members) {
        for (const player of category.members) {
          // Skip coaches and other non-player roles
          if (player.role?.key === 'coach' || player.excludeFromRanking === true) {
            continue
          }

          totalPlayersFound++

          const positions = player.positionIdsDesc ? player.positionIdsDesc.split(',').map((p: string) => p.trim()) : ['Unknown']
          
          // Map nationality codes to full country names
          const nationalityMap: Record<string, string> = {
            'ENG': 'England', 'ESP': 'Spain', 'FRA': 'France', 'GER': 'Germany',
            'ITA': 'Italy', 'BRA': 'Brazil', 'ARG': 'Argentina', 'POR': 'Portugal',
            'NED': 'Netherlands', 'BEL': 'Belgium', 'CRO': 'Croatia', 'POL': 'Poland',
            'URU': 'Uruguay', 'COL': 'Colombia', 'CZE': 'Czechia', 'WAL': 'Wales',
            'SCO': 'Scotland', 'IRE': 'Ireland', 'NOR': 'Norway', 'SWE': 'Sweden',
            'DEN': 'Denmark', 'AUT': 'Austria', 'SUI': 'Switzerland', 'SER': 'Serbia',
            'TUR': 'Turkey', 'UKR': 'Ukraine', 'RUS': 'Russia', 'MEX': 'Mexico',
            'USA': 'United States', 'CAN': 'Canada', 'JPN': 'Japan', 'KOR': 'South Korea',
            'AUS': 'Australia', 'NZL': 'New Zealand', 'RSA': 'South Africa',
            'NGA': 'Nigeria', 'GHA': 'Ghana', 'CMR': 'Cameroon', 'SEN': 'Senegal',
            'MAR': 'Morocco', 'EGY': 'Egypt', 'ALG': 'Algeria', 'TUN': 'Tunisia',
            'CIV': 'Ivory Coast', 'MLI': 'Mali', 'BFA': 'Burkina Faso', 'GUI': 'Guinea',
            'LIB': 'Liberia', 'SLE': 'Sierra Leone', 'TOG': 'Togo', 'BEN': 'Benin',
            'GAB': 'Gabon', 'CGO': 'Congo', 'ANG': 'Angola', 'ZAM': 'Zambia',
            'ZIM': 'Zimbabwe', 'BOT': 'Botswana', 'NAM': 'Namibia', 'SWZ': 'Eswatini'
          }

          const nationality = nationalityMap[player.ccode] || player.cname || 'Unknown'
          
          // Determine region based on nationality
          const getRegion = (nationality: string): string => {
            const europeanCountries = ['England', 'Spain', 'France', 'Germany', 'Italy', 'Portugal', 'Netherlands', 'Belgium', 'Croatia', 'Poland', 'Czechia', 'Wales', 'Scotland', 'Ireland', 'Norway', 'Sweden', 'Denmark', 'Austria', 'Switzerland', 'Serbia', 'Turkey', 'Ukraine', 'Russia']
            const southAmericanCountries = ['Brazil', 'Argentina', 'Uruguay', 'Colombia']
            const northAmericanCountries = ['United States', 'Canada', 'Mexico']
            const africanCountries = ['Nigeria', 'Ghana', 'Cameroon', 'Senegal', 'Morocco', 'Egypt', 'Algeria', 'Tunisia', 'Ivory Coast', 'Mali', 'Burkina Faso', 'Guinea', 'Liberia', 'Sierra Leone', 'Togo', 'Benin', 'Gabon', 'Congo', 'Angola', 'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Eswatini', 'South Africa']
            const asianCountries = ['Japan', 'South Korea']
            const oceaniaCountries = ['Australia', 'New Zealand']

            if (europeanCountries.includes(nationality)) return 'Europe'
            if (southAmericanCountries.includes(nationality)) return 'South America'
            if (northAmericanCountries.includes(nationality)) return 'North America'
            if (africanCountries.includes(nationality)) return 'Africa'
            if (asianCountries.includes(nationality)) return 'Asia'
            if (oceaniaCountries.includes(nationality)) return 'Oceania'
            return 'Unknown'
          }

          const playerData = {
            name: player.name,
            club: teamName, // Use the resolved team name instead of team ID
            age: player.age || 0,
            date_of_birth: player.dateOfBirth || '1990-01-01',
            positions: positions,
            dominant_foot: 'Right', // Default as API doesn't provide this
            nationality: nationality,
            contract_status: 'Under Contract', // Default assumption
            contract_expiry: null,
            region: getRegion(nationality),
            image_url: null // API doesn't provide player images
          }

          const { error: insertError } = await supabase
            .from('players')
            .insert(playerData)

          if (insertError) {
            console.error(`Error inserting player ${player.name}:`, insertError)
          } else {
            console.log(`Inserted player: ${player.name} from ${teamName}`)
            playersInserted++

            // Insert recent form data if available
            if (player.rating && player.goals !== undefined && player.assists !== undefined) {
              const { data: insertedPlayer } = await supabase
                .from('players')
                .select('id')
                .eq('name', player.name)
                .eq('club', teamName)
                .single()

              if (insertedPlayer) {
                await supabase
                  .from('player_recent_form')
                  .insert({
                    player_id: insertedPlayer.id,
                    matches: 10, // Default assumption
                    goals: player.goals || 0,
                    assists: player.assists || 0,
                    rating: parseFloat(player.rating) || 0.0
                  })
              }
            }
          }
        }
      }
    }

    console.log(`Found ${totalPlayersFound} players in squad`)

    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${playersInserted} players for ${teamName}`,
        totalPlayersFound,
        playersInserted,
        teamId,
        teamName
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error importing player data:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
