
import AISearch from '@/components/AISearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Search, Target } from 'lucide-react';

const AISearchPage = () => {
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">AI-Powered Search</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe what you're looking for in natural language and let AI find the most relevant players and reports.
          </p>
        </div>

        {/* Main Search */}
        <AISearch />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Natural Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Search using everyday language like "fast wingers with good crossing" instead of complex filters.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="h-5 w-5 text-blue-500" />
                Semantic Understanding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI understands context and meaning, finding relevant results even when exact keywords don't match.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-green-500" />
                Relevance Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Results are ranked by relevance, with the most matching players and reports shown first.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AISearchPage;
