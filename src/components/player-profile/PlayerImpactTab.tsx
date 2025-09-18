import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Player } from "@/types/player";

interface PlayerImpactTabProps {
  player: Player;
}

export const PlayerImpactTab = ({ player }: PlayerImpactTabProps) => {
  // Mock data for player comparison
  const playerComparison = [
    { rank: 1, player: "Salah (33)", rating: 95.0 },
    { rank: 2, player: "Fassnacht (31)", rating: 75.9 },
    { rank: 3, player: "Virginius (22)", rating: 75.9 },
    { rank: 4, player: "Monteiro (26)", rating: 74.7 },
    { rank: 5, player: "Males (24)", rating: 74.5 },
    { rank: 6, player: "Colley (25)", rating: 72.4 }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Impact</h2>
      
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="summary" className="px-8">Summary</TabsTrigger>
          <TabsTrigger value="benchmark" className="px-8 text-muted-foreground">League Benchmark</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-8">
          <div className="space-y-8">
            {/* Impact Statement */}
            <div>
              <p className="text-lg">
                Salah would be the <span className="text-emerald-600 font-semibold">best Winger in your squad</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Player Comparison Table */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 font-medium text-muted-foreground">#</th>
                          <th className="text-left py-3 font-medium text-muted-foreground">Player (Age)</th>
                          <th className="text-right py-3 font-medium text-muted-foreground">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerComparison.map((player, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 text-muted-foreground">{player.rank}</td>
                            <td className="py-3 font-medium">{player.player}</td>
                            <td className="py-3 text-right font-medium">{player.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>

              {/* Rating Gauge */}
              <div className="flex justify-center items-center">
                <div className="relative">
                  {/* Circular progress */}
                  <svg width="200" height="120" viewBox="0 0 200 120" className="transform rotate-180">
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset="50"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-emerald-600 font-medium">HIGH</span>
                    <span className="text-4xl font-bold">95</span>
                    <span className="text-sm font-medium text-muted-foreground">Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Explanation */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                  TransferRoom Player Rating measures a player's ability from 1-100, based on performance data and relative level of their club and league
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmark" className="mt-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-muted-foreground">
                League Benchmark data would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};