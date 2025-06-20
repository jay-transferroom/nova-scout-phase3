
import AISearch from '@/components/AISearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Brain, Search, Target, Users, FileText, Bell, MessageSquare } from 'lucide-react';

const AISearchPage = () => {
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl mt-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">AI-Powered Search</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe what you're looking for in natural language and let AI find the most relevant players, reports, and insights.
          </p>
        </div>

        {/* Search Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Player Search</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Recommendations</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="p-4 text-center">
              <FileText className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Player Summaries</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="p-4 text-center">
              <Bell className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Notifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Search */}
        <AISearch />

        {/* WhatsApp Integration Card */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <MessageSquare className="h-5 w-5" />
              WhatsApp Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your phone to receive scouting updates, player alerts, and communicate with the platform through WhatsApp.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time player alerts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Match notifications</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Report completion updates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI-powered chat assistant</span>
              </div>
            </div>
          </CardContent>
        </Card>

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
