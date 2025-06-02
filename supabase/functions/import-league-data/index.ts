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
    const { league_name: leagueName, force_reimport = false } = await req.json()
    console.log(`Starting complete league data import for: ${leagueName}, force_reimport: ${force_reimport}`)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Define league mappings for better API calls
    const leagueData = {
      'Premier League': { country: 'England', season: '2024' },
      'La Liga': { country: 'Spain', season: '2024' },
      'Serie A': { country: 'Italy', season: '2024' },
      'Bundesliga': { country: 'Germany', season: '2024' },
      'Ligue 1': { country: 'France', season: '2024' }
    }

    if (!leagueData[leagueName]) {
      return new Response(
        JSON.stringify({ 
          error: `League "${leagueName}" not supported. Available: ${Object.keys(leagueData).join(', ')}`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        }
      )
    }

    const league = leagueData[leagueName]
    let totalTeamsImported = 0
    let totalPlayersImported = 0

    // If force_reimport is true, delete existing league data first
    if (force_reimport) {
      console.log(`Force reimport requested - deleting existing ${leagueName} data`)
      
      // Delete players from teams in this league
      const { error: deletePlayersError } = await supabase
        .from('players')
        .delete()
        .in('club', getSampleTeamsForLeague(leagueName).map(team => team.name))
      
      if (deletePlayersError) {
        console.error('Error deleting existing players:', deletePlayersError)
      }
      
      // Delete teams from this league
      const { error: deleteTeamsError } = await supabase
        .from('teams')
        .delete()
        .eq('league', leagueName)
      
      if (deleteTeamsError) {
        console.error('Error deleting existing teams:', deleteTeamsError)
      }
      
      console.log(`Cleared existing ${leagueName} data`)
    }

    // Step 1: Import teams for the league
    console.log(`Step 1: Importing teams for ${leagueName}`)
    
    // Use sample teams (API teams endpoint seems unreliable)
    const sampleTeams = getSampleTeamsForLeague(leagueName)
    
    for (const team of sampleTeams) {
      // Check if team already exists (unless force reimport)
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('external_api_id', team.external_api_id || team.id)
        .single()

      if (!existingTeam || force_reimport) {
        const teamData = {
          name: team.name,
          league: leagueName,
          country: league.country,
          founded: team.founded || null,
          venue: team.venue || team.stadium || null,
          external_api_id: team.external_api_id || team.id,
          logo_url: team.logo || team.image || team.badge || null
        }

        if (existingTeam && force_reimport) {
          // Update existing team
          const { error } = await supabase
            .from('teams')
            .update(teamData)
            .eq('external_api_id', team.external_api_id || team.id)

          if (error) {
            console.error('Error updating team:', error)
          } else {
            console.log('Updated team:', team.name)
            totalTeamsImported++
          }
        } else {
          // Insert new team
          const { error } = await supabase
            .from('teams')
            .insert(teamData)

          if (error) {
            console.error('Error inserting team:', error)
          } else {
            console.log('Imported team:', team.name)
            totalTeamsImported++
          }
        }
      } else {
        console.log('Team already exists:', team.name)
      }
    }

    // Step 2: Import players for each team - only try API, don't fall back to sample data
    console.log(`Step 2: Importing players for all ${leagueName} teams`)
    
    for (const team of sampleTeams) {
      try {
        console.log(`Importing players for ${team.name}...`)
        
        // Only try the API import - don't fall back to sample data
        const { data: playerImportResult, error: playerImportError } = await supabase.functions.invoke('import-player-data', {
          body: { 
            team_id: team.external_api_id || team.id, 
            season: league.season,
            team_name: team.name,
            force_reimport: force_reimport
          }
        })

        if (playerImportError || !playerImportResult || playerImportResult.error) {
          console.log(`API import failed for ${team.name}, skipping fallback to preserve existing data`)
          // Don't create sample players - just skip this team
        } else {
          console.log(`Successfully imported players for ${team.name}:`, playerImportResult)
          totalPlayersImported += playerImportResult.playersInserted || 0
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`Error processing team ${team.name}:`, error)
        // Don't create fallback sample players - just log the error and continue
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully imported ${leagueName} data`,
        league: leagueName,
        teamsImported: totalTeamsImported,
        playersImported: totalPlayersImported,
        totalTeams: sampleTeams.length,
        forceReimport: force_reimport
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error importing league data:', error)
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

function getSampleTeamsForLeague(leagueName: string) {
  const teams = {
    'Premier League': [
      { name: 'Manchester United', external_api_id: '33', venue: 'Old Trafford', founded: 1878 },
      { name: 'Liverpool', external_api_id: '8650', venue: 'Anfield', founded: 1892 },
      { name: 'Arsenal', external_api_id: '8455', venue: 'Emirates Stadium', founded: 1886 },
      { name: 'Chelsea', external_api_id: '8456', venue: 'Stamford Bridge', founded: 1905 },
      { name: 'Manchester City', external_api_id: '8557', venue: 'Etihad Stadium', founded: 1880 },
      { name: 'Tottenham Hotspur', external_api_id: '8586', venue: 'Tottenham Hotspur Stadium', founded: 1882 },
    ],
    'La Liga': [
      { name: 'Real Madrid', external_api_id: '8633', venue: 'Santiago Bernabéu', founded: 1902 },
      { name: 'Barcelona', external_api_id: '8634', venue: 'Camp Nou', founded: 1899 },
      { name: 'Atletico Madrid', external_api_id: '8635', venue: 'Wanda Metropolitano', founded: 1903 },
    ],
    'Serie A': [
      { name: 'Juventus', external_api_id: '8636', venue: 'Allianz Stadium', founded: 1897 },
      { name: 'AC Milan', external_api_id: '8637', venue: 'San Siro', founded: 1899 },
      { name: 'Inter Milan', external_api_id: '8638', venue: 'San Siro', founded: 1908 },
    ],
    'Bundesliga': [
      { name: 'Bayern Munich', external_api_id: '8639', venue: 'Allianz Arena', founded: 1900 },
      { name: 'Borussia Dortmund', external_api_id: '8640', venue: 'Signal Iduna Park', founded: 1909 },
    ],
    'Ligue 1': [
      { name: 'Paris Saint-Germain', external_api_id: '8641', venue: 'Parc des Princes', founded: 1970 },
      { name: 'Olympique Marseille', external_api_id: '8642', venue: 'Stade Vélodrome', founded: 1899 },
    ]
  }

  return (teams[leagueName] || []).map(team => ({
    ...team,
    league: leagueName,
    country: leagueName === 'Premier League' ? 'England' : 
             leagueName === 'La Liga' ? 'Spain' :
             leagueName === 'Serie A' ? 'Italy' :
             leagueName === 'Bundesliga' ? 'Germany' :
             leagueName === 'Ligue 1' ? 'France' : 'Unknown',
    logo_url: null
  }))
}
