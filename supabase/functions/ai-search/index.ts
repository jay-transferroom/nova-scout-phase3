
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

    // Get query embedding from OpenAI
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Search players using semantic similarity
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .limit(50);

    if (playersError) {
      console.error('Error fetching players:', playersError);
    }

    // Search reports
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

    // Use OpenAI to analyze and rank results
    const analysisPrompt = `
    You are a football scout assistant. Given this search query: "${query}"
    
    Analyze and rank these players and reports based on relevance to the query.
    Return a JSON array of results with relevanceScore (0-1), focusing on:
    - Player attributes, positions, and characteristics
    - Match context and performance data
    - Age, nationality, and contract status
    
    Players: ${JSON.stringify((players || []).map(p => ({
      id: p.id,
      name: p.name,
      club: p.club,
      positions: p.positions,
      age: p.age,
      nationality: p.nationality,
      contractStatus: p.contract_status
    })))}
    
    Reports: ${JSON.stringify((reports || []).map(r => ({
      id: r.id,
      playerName: r.players?.name,
      club: r.players?.club,
      status: r.status,
      createdAt: r.created_at
    })))}
    
    Return only the top ${limit} most relevant results as a JSON array with this structure:
    [
      {
        "type": "player" | "report",
        "id": "string",
        "title": "string",
        "description": "string", 
        "relevanceScore": number,
        "metadata": {}
      }
    ]
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
            content: 'You are a football scout assistant. Analyze search queries and return relevant player and report matches as valid JSON only.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error('Failed to analyze search results');
    }

    const analysisData = await analysisResponse.json();
    let searchResults: SearchResult[] = [];

    try {
      const content = analysisData.choices[0].message.content;
      // Extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        searchResults = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: simple text matching
        searchResults = [
          ...(players || []).slice(0, 5).map(player => ({
            type: 'player' as const,
            id: player.id,
            title: player.name,
            description: `${player.positions.join(', ')} at ${player.club} • Age ${player.age} • ${player.nationality}`,
            relevanceScore: 0.5,
            metadata: player
          })),
          ...(reports || []).slice(0, 5).map(report => ({
            type: 'report' as const,
            id: report.id,
            title: `Report: ${report.players?.name || 'Unknown Player'}`,
            description: `${report.status} report for ${report.players?.club || 'Unknown Club'}`,
            relevanceScore: 0.4,
            metadata: report
          }))
        ];
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback search results
      searchResults = [];
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
