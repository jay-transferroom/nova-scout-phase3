
import AISearch from '@/components/AISearch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Brain, Target, Users, FileText, Bell, MessageSquare, Phone } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const AISearchPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleWhatsAppConnect = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your mobile number to connect WhatsApp.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "WhatsApp Integration",
      description: "Your phone number has been saved. WhatsApp integration will be set up shortly.",
    });
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl mt-16">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Search className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Scout Manager Search</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search for players, generate reports, and manage your scouting tasks efficiently.
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
              <p className="text-sm font-medium">Player Reports</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
            <CardContent className="p-4 text-center">
              <Bell className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Alerts & Updates</p>
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
              WhatsApp Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your mobile phone to receive scouting updates, player alerts, and match notifications via WhatsApp.
            </p>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="phone" className="text-sm font-medium">Mobile Number</Label>
                <div className="flex gap-2 mt-1">
                  <Phone className="h-4 w-4 mt-3 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+44 7123 456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={handleWhatsAppConnect} className="bg-green-600 hover:bg-green-700">
                  Connect
                </Button>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Real-time player alerts and updates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Match notifications and results</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Scouting report completion updates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Quick search and task management</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Search className="h-5 w-5 text-blue-500" />
                Smart Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Search using everyday terms like "fast wingers with good crossing" to find exactly what you need.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5 text-purple-500" />
                Intelligent Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Find relevant players and reports based on context and meaning, not just exact keyword matches.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-5 w-5 text-green-500" />
                Priority Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Results are ranked by relevance and importance, showing the most suitable matches first.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AISearchPage;
