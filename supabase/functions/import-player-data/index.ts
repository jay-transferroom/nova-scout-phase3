
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
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
        }
      })

      if (!response.ok) {
        console.log(`API responded with status: ${response.status}, creating sample data instead`)
        await createSamplePlayers(supabase, teamId)
        return new Response(
          JSON.stringify({ message: 'Sample player data created successfully due to API failure' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
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
      console.log('Creating sample data instead...')
      await createSamplePlayers(supabase, teamId)
      return new Response(
        JSON.stringify({ message: 'Sample player data created successfully due to API failure' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    const { error } = await supabase
      .from('players')
      .upsert(player, { 
        onConflict: 'name,club',
        ignoreDuplicates: true 
      })

    if (error) {
      console.error('Error inserting sample player:', error)
    } else {
      console.log('Inserted sample player:', player.name)
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
