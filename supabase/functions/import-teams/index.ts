
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

    console.log('Starting teams data import...')

    // Use the team list API endpoint
    const apiUrl = `https://free-api-live-football-data.p.rapidapi.com/football-get-list-all-team`
    
    console.log(`Fetching teams from: ${apiUrl}`)
    
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
      await createSampleTeams(supabase)
      
      return new Response(
        JSON.stringify({ 
          message: `API returned ${response.status} error - created sample data instead`,
          error: errorText
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()
    console.log('API response data:', JSON.stringify(data, null, 2))

    // Extract teams from the API response
    let teams = []
    if (data && data.response && Array.isArray(data.response)) {
      teams = data.response
    } else if (Array.isArray(data)) {
      teams = data
    }

    console.log(`Found ${teams.length} teams`)

    if (teams.length === 0) {
      console.log('No teams found in API response, creating sample data')
      await createSampleTeams(supabase)
      
      return new Response(
        JSON.stringify({ 
          message: 'No teams found in API response - created sample data instead',
          apiResponse: data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process and insert the team data
    const insertedCount = await insertTeamData(supabase, teams)
    
    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${insertedCount} teams`,
        totalTeamsFound: teams.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in teams import function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function insertTeamData(supabase: any, teams: any[]) {
  let insertedCount = 0
  
  for (const team of teams.slice(0, 50)) { // Limit to 50 teams
    try {
      const teamData = {
        name: team.name || team.team_name || `Team ${Math.random().toString(36).substr(2, 9)}`,
        league: team.league || team.competition || 'Unknown League',
        country: team.country || team.nation || 'Unknown',
        founded: team.founded || null,
        venue: team.venue || team.stadium || null,
        external_api_id: team.id?.toString() || `team_${Date.now()}_${Math.random()}`,
        logo_url: team.logo || `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`
      }

      // Check if team already exists
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('external_api_id', teamData.external_api_id)
        .single()

      if (!existingTeam) {
        const { error } = await supabase
          .from('teams')
          .insert(teamData)

        if (error) {
          console.error('Error inserting team:', error)
        } else {
          console.log('Inserted team:', teamData.name)
          insertedCount++
        }
      } else {
        console.log('Team already exists:', teamData.name)
      }
    } catch (teamError) {
      console.error('Error processing team:', teamError, team)
    }
  }
  
  return insertedCount
}

async function createSampleTeams(supabase: any) {
  const sampleTeams = [
    {
      name: 'Manchester United',
      league: 'Premier League',
      country: 'England',
      founded: 1878,
      venue: 'Old Trafford',
      external_api_id: 'sample_team_1',
      logo_url: 'https://picsum.photos/id/200/100/100'
    },
    {
      name: 'Liverpool',
      league: 'Premier League',
      country: 'England',
      founded: 1892,
      venue: 'Anfield',
      external_api_id: 'sample_team_2',
      logo_url: 'https://picsum.photos/id/201/100/100'
    },
    {
      name: 'Real Madrid',
      league: 'La Liga',
      country: 'Spain',
      founded: 1902,
      venue: 'Santiago Bernabéu',
      external_api_id: 'sample_team_3',
      logo_url: 'https://picsum.photos/id/202/100/100'
    }
  ]

  for (const team of sampleTeams) {
    const { data: existingTeam } = await supabase
      .from('teams')
      .select('id')
      .eq('external_api_id', team.external_api_id)
      .single()

    if (!existingTeam) {
      const { error } = await supabase
        .from('teams')
        .insert(team)

      if (error) {
        console.error('Error inserting sample team:', error)
      } else {
        console.log('Inserted sample team:', team.name)
      }
    } else {
      console.log('Sample team already exists:', team.name)
    }
  }
}
