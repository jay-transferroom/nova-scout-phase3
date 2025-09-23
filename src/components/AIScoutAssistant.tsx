import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, Loader2, ExternalLink, Eye, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  type: 'player' | 'report' | 'ai_recommendation';
  title: string;
  subtitle?: string;
  description?: string;
  confidence?: number;
  player_id?: string;
  report_id?: string;
  metadata: any;
}

const AIScoutAssistant = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      console.log('Starting AI search for:', query);
      
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { 
          query: query,
          limit: 8 // Smaller limit for homepage widget
        }
      });

      if (error) {
        console.error('AI Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to perform search. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.results) {
        setResults(data.results);
        console.log('AI search results:', data.results);
      } else {
        setResults([]);
      }

      if (!data?.results || data.results.length === 0) {
        toast({
          title: "No results found",
          description: "Try rephrasing your search or using different keywords.",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'player':
        if (result.player_id) {
          if (result.metadata?.isPrivatePlayer) {
            navigate(`/private-player/${result.player_id}`);
          } else {
            navigate(`/player/${result.player_id}`);
          }
        }
        break;
      case 'report':
        if (result.report_id) {
          navigate(`/report/${result.report_id}`);
        }
        break;
      default:
        console.log('Clicked result:', result);
        break;
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'player':
        return <User className="h-4 w-4" />;
      case 'report':
        return <Eye className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const suggestions = [
    "Show me fast wingers under 23",
    "Find central defenders good at aerial duels",
    "Players similar to Kevin De Bruyne",
    "Prospects from Germany under 20"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI Scout Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search for players, reports, or ask for recommendations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Quick Suggestions */}
        {!results.length && !isLoading && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Search Results</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getResultIcon(result.type)}
                      <span className="font-medium text-sm truncate">{result.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                      {result.confidence && (
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(result.confidence * 100)}%
                        </Badge>
                      )}
                    </div>
                    
                    {result.subtitle && (
                      <div className="text-xs text-muted-foreground mb-1">
                        {result.subtitle}
                      </div>
                    )}
                    
                    {result.description && (
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {result.description}
                      </div>
                    )}
                  </div>
                  
                  <ExternalLink className="h-4 w-4 text-muted-foreground ml-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIScoutAssistant;