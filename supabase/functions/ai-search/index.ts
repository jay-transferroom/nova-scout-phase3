
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

    // Enhanced keyword search with scoring
    const searchResults = performKeywordSearch(query, players || [], reports || [], limit);

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

function performKeywordSearch(query: string, players: any[], reports: any[], limit: number): SearchResult[] {
  const queryLower = query.toLowerCase();
  const searchTerms = queryLower.split(' ').filter(term => term.length > 2);
  const results: SearchResult[] = [];

  // Helper function to calculate relevance score
  function calculateRelevance(text: string, terms: string[]): number {
    const textLower = text.toLowerCase();
    let score = 0;
    
    // Exact phrase match gets highest score
    if (textLower.includes(queryLower)) {
      score += 1.0;
    }
    
    // Individual term matches
    terms.forEach(term => {
      if (textLower.includes(term)) {
        score += 0.3;
      }
    });
    
    return Math.min(score, 1.0);
  }

  // Search players
  players.forEach(player => {
    const searchableText = [
      player.name,
      player.club,
      player.positions?.join(' ') || '',
      player.nationality,
      player.contract_status,
      player.region
    ].join(' ');
    
    const relevance = calculateRelevance(searchableText, searchTerms);
    
    if (relevance > 0) {
      const positions = Array.isArray(player.positions) ? player.positions.join(', ') : 'Unknown';
      results.push({
        type: 'player',
        id: player.id,
        title: player.name,
        description: `${positions} at ${player.club} • Age ${player.age} • ${player.nationality}`,
        relevanceScore: relevance,
        metadata: player
      });
    }
  });

  // Search reports
  reports.forEach(report => {
    const playerName = report.players?.name || 'Unknown Player';
    const playerClub = report.players?.club || 'Unknown Club';
    const playerPositions = report.players?.positions?.join(' ') || '';
    
    const searchableText = [
      playerName,
      playerClub,
      playerPositions,
      report.status,
      'report'
    ].join(' ');
    
    const relevance = calculateRelevance(searchableText, searchTerms);
    
    if (relevance > 0) {
      results.push({
        type: 'report',
        id: report.id,
        title: `Report: ${playerName}`,
        description: `${report.status} report for ${playerClub}`,
        relevanceScore: relevance,
        metadata: report
      });
    }
  });

  // Sort by relevance score and limit results
  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}
