
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchResult {
  type: 'player' | 'report';
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  metadata: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, limit = 10 } = await req.json();
    
    if (!query) {
      throw new Error('Search query is required');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Processing search query:', query);

    // Search players
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .limit(50);

    if (playersError) {
      console.error('Error fetching players:', playersError);
    }

    // Search reports with player data
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select(`
        *,
        players!inner(name, club, positions)
      `)
      .limit(50);

    if (reportsError) {
      console.error('Error fetching reports:', reportsError);
    }

    console.log('Found players:', players?.length || 0);
    console.log('Found reports:', reports?.length || 0);

    // Use OpenAI to analyze and rank results instead of embeddings
    const analysisPrompt = `
    You are a football scout assistant. Analyze this search query: "${query}"
    
    Based on the query, rank and filter these players and reports by relevance.
    Focus on matching:
    - Player positions and playing style
    - Age requirements
    - Nationality or region
    - Club information
    - Performance characteristics
    
    Players available:
    ${JSON.stringify((players || []).slice(0, 20).map(p => ({
      id: p.id,
      name: p.name,
      club: p.club,
      positions: p.positions,
      age: p.age,
      nationality: p.nationality,
      contractStatus: p.contract_status
    })))}
    
    Reports available:
    ${JSON.stringify((reports || []).slice(0, 10).map(r => ({
      id: r.id,
      playerName: r.players?.name,
      club: r.players?.club,
      positions: r.players?.positions,
      status: r.status
    })))}
    
    Return ONLY a JSON array of the most relevant results (max ${limit}) in this exact format:
    [
      {
        "type": "player",
        "id": "player-uuid",
        "title": "Player Name",
        "description": "Position at Club • Age X • Nationality",
        "relevanceScore": 0.95
      }
    ]
    
    If no results are relevant, return an empty array [].
    `;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a football scout assistant. Return only valid JSON arrays with search results.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!analysisResponse.ok) {
      console.error('OpenAI API error:', analysisResponse.status, analysisResponse.statusText);
      const errorText = await analysisResponse.text();
      console.error('OpenAI error response:', errorText);
      throw new Error(`OpenAI API failed: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    let searchResults: SearchResult[] = [];

    try {
      const content = analysisData.choices[0].message.content;
      console.log('OpenAI response:', content);
      
      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedResults = JSON.parse(jsonMatch[0]);
        
        // Enhance results with metadata
        searchResults = parsedResults.map((result: any) => {
          if (result.type === 'player') {
            const player = players?.find(p => p.id === result.id);
            return {
              ...result,
              metadata: player
            };
          } else if (result.type === 'report') {
            const report = reports?.find(r => r.id === result.id);
            return {
              ...result,
              metadata: report
            };
          }
          return result;
        });
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback: simple keyword matching
      const queryLower = query.toLowerCase();
      searchResults = [];
      
      // Add matching players
      if (players) {
        players.forEach(player => {
          const searchText = `${player.name} ${player.club} ${player.positions.join(' ')} ${player.nationality}`.toLowerCase();
          if (searchText.includes(queryLower)) {
            searchResults.push({
              type: 'player',
              id: player.id,
              title: player.name,
              description: `${player.positions.join(', ')} at ${player.club} • Age ${player.age} • ${player.nationality}`,
              relevanceScore: 0.7,
              metadata: player
            });
          }
        });
      }
      
      // Add matching reports
      if (reports) {
        reports.forEach(report => {
          const searchText = `${report.players?.name || ''} ${report.players?.club || ''}`.toLowerCase();
          if (searchText.includes(queryLower)) {
            searchResults.push({
              type: 'report',
              id: report.id,
              title: `Report: ${report.players?.name || 'Unknown Player'}`,
              description: `${report.status} report for ${report.players?.club || 'Unknown Club'}`,
              relevanceScore: 0.6,
              metadata: report
            });
          }
        });
      }
      
      // Limit results
      searchResults = searchResults.slice(0, limit);
    }

    console.log('Search completed, found', searchResults.length, 'results');

    return new Response(
      JSON.stringify({ 
        results: searchResults,
        query,
        totalResults: searchResults.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
