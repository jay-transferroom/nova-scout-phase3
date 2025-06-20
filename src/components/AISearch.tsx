
import { useState } from 'react';
import { Search, Sparkles, User, FileText, Loader2, Target, Bell, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface SearchResult {
  type: 'player' | 'report' | 'recommendation' | 'summary' | 'notification';
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  metadata: any;
}

interface AISearchProps {
  placeholder?: string;
  showSuggestions?: boolean;
}

const AISearch = ({ placeholder = "Describe what you're looking for...", showSuggestions = true }: AISearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const suggestions = [
    "Fast wingers with good crossing ability",
    "Tall central defenders under 25",
    "Creative midfielders who can score goals",
    "Promising young strikers",
    "Experienced goalkeepers",
    "Players similar to Kevin De Bruyne",
    "Recommend players for left wing position",
    "Summarize performance of top scorers",
    "Notify me about contract expiring players"
  ];

  const handleSearch = async (searchQuery?: string) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      console.log('Starting AI search for:', queryToSearch);
      
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { 
          query: queryToSearch,
          limit: 10,
          searchType: activeTab !== 'all' ? activeTab : undefined
        }
      });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }

      console.log('Search results:', data);
      setResults(data?.results || []);
      
      if (data?.results?.length === 0) {
        toast({
          title: "No results found",
          description: "Try adjusting your search query or using different keywords.",
        });
      }
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: "Search failed",
        description: "There was an error performing the search. Please try again.",
        variant: "destructive",
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'player') {
      navigate(`/player/${result.id}`);
    } else if (result.type === 'report') {
      navigate(`/reports/${result.id}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-blue-500';
    if (score >= 0.4) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'player': return <User className="h-4 w-4 text-blue-500" />;
      case 'report': return <FileText className="h-4 w-4 text-green-500" />;
      case 'recommendation': return <Target className="h-4 w-4 text-purple-500" />;
      case 'summary': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'notification': return <Bell className="h-4 w-4 text-red-500" />;
      default: return <Search className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredResults = activeTab === 'all' ? results : results.filter(r => r.type === activeTab);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="pl-10 pr-4 h-12 text-base"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={() => handleSearch()} 
            disabled={!query.trim() || isLoading}
            size="lg"
            className="h-12 px-6"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Search Type Tabs */}
      {hasSearched && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="player">Players</TabsTrigger>
            <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
            <TabsTrigger value="summary">Summaries</TabsTrigger>
            <TabsTrigger value="notification">Notifications</TabsTrigger>
            <TabsTrigger value="report">Reports</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Suggestions */}
      {showSuggestions && !hasSearched && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs"
                disabled={isLoading}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Searching with AI...</span>
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isLoading && (
        <div className="space-y-4">
          {filteredResults.length > 0 && (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Search Results</h3>
              <Badge variant="secondary">{filteredResults.length} found</Badge>
            </div>
          )}

          {filteredResults.map((result, index) => (
            <Card 
              key={`${result.type}-${result.id}-${index}`}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleResultClick(result)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(result.type)}
                    <CardTitle className="text-base">{result.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${getRelevanceColor(result.relevanceScore)}`}
                      title={`Relevance: ${Math.round(result.relevanceScore * 100)}%`}
                    />
                    <Badge variant="outline" className="text-xs">
                      {result.type}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{result.description}</p>
              </CardContent>
            </Card>
          ))}

          {filteredResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found for your search.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try using different keywords or be more specific.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearch;
