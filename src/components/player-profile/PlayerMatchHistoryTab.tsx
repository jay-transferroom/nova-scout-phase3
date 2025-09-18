import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Player } from "@/types/player";
import { Goal, Zap } from "lucide-react";

interface PlayerMatchHistoryTabProps {
  player: Player;
}

export const PlayerMatchHistoryTab = ({ player }: PlayerMatchHistoryTabProps) => {
  // Mock match performance data
  const matchPerformance = [
    { opponent: "Fulham", rating: 6.8, goals: 0, assists: 0, logo: "⚪" },
    { opponent: "West Ham", rating: 6.8, goals: 0, assists: 1, logo: "🟤" },
    { opponent: "Man City", rating: 6.6, goals: 0, assists: 0, logo: "🔵" },
    { opponent: "Tottenham", rating: 8.2, goals: 1, assists: 0, logo: "⚪" },
    { opponent: "Chelsea", rating: 7.2, goals: 0, assists: 0, logo: "🔵" },
    { opponent: "Arsenal", rating: 6.8, goals: 0, assists: 0, logo: "🔴" },
    { opponent: "Brighton", rating: 6.7, goals: 0, assists: 0, logo: "🔵" },
    { opponent: "Crystal Palace", rating: 8.0, goals: 1, assists: 0, logo: "🔵" },
    { opponent: "Everton", rating: 6.3, goals: 0, assists: 0, logo: "🔵" },
    { opponent: "Bournemouth", rating: 8.1, goals: 1, assists: 0, logo: "🔴" }
  ];

  // Mock match history data
  const matchHistory = [
    { 
      date: "01/05/25", 
      competition: "UEFA Europa League",
      match: "Tottenham - Bodo/Glimt",
      result: "3 - 1",
      minutes: "67'",
      goals: 1,
      assists: 0
    },
    {
      date: "27/04/25",
      competition: "Premier League", 
      match: "Liverpool - Tottenham",
      result: "1 - 5",
      minutes: "49'",
      goals: 0,
      assists: 1
    },
    {
      date: "21/04/25",
      competition: "Premier League",
      match: "Tottenham - Nottm Forest", 
      result: "1 - 2",
      minutes: "-",
      goals: 0,
      assists: 0,
      highlight: true
    },
    {
      date: "17/04/25",
      competition: "UEFA Europa League",
      match: "E. Frankfurt - Tottenham",
      result: "1 - 0", 
      minutes: "46'",
      goals: 0,
      assists: 0
    },
    {
      date: "13/04/25",
      competition: "Premier League",
      match: "Wolves - Tottenham",
      result: "2 - 4",
      minutes: "77'", 
      goals: 0,
      assists: 0
    }
  ];

  const maxRating = Math.max(...matchPerformance.map(m => m.rating));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Match History</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Performance Chart */}
        <div className="space-y-6">
          <div>
            <p className="text-lg">
              <span className="font-semibold">Salah has</span> <span className="text-emerald-600 font-semibold">3 goals and 1 assist</span> <span className="font-semibold">in his last 10 club matches</span>
            </p>
          </div>

          {/* Performance Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-end justify-between h-48 mb-6">
                {matchPerformance.map((match, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    {/* Goals and assists indicators */}
                    <div className="flex flex-col gap-1 h-8">
                      {match.goals > 0 && (
                        <div className="flex justify-center">
                          <Goal className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                      {match.assists > 0 && (
                        <div className="flex justify-center">
                          <Zap className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                    
                    {/* Rating bar */}
                    <div 
                      className="bg-emerald-500 w-6 rounded-t"
                      style={{ 
                        height: `${(match.rating / maxRating) * 120}px`,
                        minHeight: '20px'
                      }}
                    />
                    
                    {/* Team logo and rating */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">{match.logo}</span>
                      <span className="text-xs font-medium">{match.rating}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Goal className="w-4 h-4 text-gray-600" />
                  <span className="text-muted-foreground">Goal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-gray-600" />
                  <span className="text-muted-foreground">Assist</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                  <span className="text-muted-foreground">Rating</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Match List */}
        <div className="space-y-6">
          <div>
            <p className="text-lg">
              <span className="font-semibold">Maddison has played</span> <span className="text-emerald-600 font-semibold">61% of available minutes</span> <span className="font-semibold">in the last 12 months</span>
            </p>
          </div>

          {/* Season selector */}
          <div className="flex justify-start">
            <Select defaultValue="last-3">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-3">Last 3 seasons</SelectItem>
                <SelectItem value="25-26">25-26</SelectItem>
                <SelectItem value="24-25">24-25</SelectItem>
                <SelectItem value="23-24">23-24</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Match tabs */}
          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="competitions" className="text-muted-foreground">Competitions</TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-muted-foreground">Matches</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Min played</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Goals</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">Assists</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchHistory.map((match, index) => (
                        <tr key={index} className={`border-b ${match.highlight ? 'bg-yellow-50' : ''}`}>
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-sm">{match.date} {match.competition}</div>
                              <div className="text-sm text-muted-foreground">{match.match}</div>
                              <div className="text-sm text-muted-foreground">{match.result}</div>
                            </div>
                          </td>
                          <td className="p-4 text-right">{match.minutes}</td>
                          <td className="p-4 text-right">{match.goals}</td>
                          <td className="p-4 text-right">{match.assists}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              <div className="flex justify-center mt-6">
                <Button variant="outline" className="px-8">
                  SHOW MORE
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="competitions" className="mt-6">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center text-muted-foreground">
                    Competition data would be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};