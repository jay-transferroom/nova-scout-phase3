
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

    const apiUrl = `https://free-api-live-football-data.p.rapidapi.com/football-get-team-squad?team_id=${teamId}`
    
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'free-api-live-football-data.p.rapidapi.com'
        }
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Fetched player data from RapidAPI:', data)

      if (data && data.response) {
        for (const player of data.response.slice(0, 30)) { // Limit to 30 players
          const playerData = {
            name: player.name || 'Unknown Player',
            club: player.statistics?.[0]?.team?.name || 'Unknown Club',
            age: player.age || 25,
            date_of_birth: player.birth?.date || '1999-01-01',
            positions: [player.position || 'Unknown'],
            dominant_foot: 'Right', // Default as API might not provide this
            nationality: player.nationality || 'Unknown',
            contract_status: 'Under Contract' as const,
            contract_expiry: null,
            region: getRegionFromNationality(player.nationality || 'Unknown'),
            image_url: player.photo || `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/300/300`
          }

          const { error } = await supabase
            .from('players')
            .upsert(playerData, { 
              onConflict: 'name,club',
              ignoreDuplicates: false 
            })

          if (error) {
            console.error('Error inserting player:', error)
          } else {
            console.log('Inserted player:', playerData.name, 'from', playerData.club)
          }
        }
      }

    } catch (apiError) {
      console.error('RapidAPI call failed:', apiError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch player data from API' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Player data import completed successfully' }),
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
