import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Player } from "@/types/player";

interface PlayerFinancialsTabProps {
  player: Player;
}

export const PlayerFinancialsTab = ({ player }: PlayerFinancialsTabProps) => {
  // Mock xTV data for the chart
  const xtvData = [
    { year: "2013", value: 10.6, team: "Fiorentina" },
    { year: "2014", value: 15, team: "Chelsea" },
    { year: "2015", value: 20, team: "Chelsea" },
    { year: "2016", value: 35, team: "Roma" },
    { year: "2017", value: 140, team: "Liverpool" },
    { year: "2018", value: 150, team: "Liverpool" },
    { year: "2019", value: 120, team: "Liverpool" },
    { year: "2020", value: 110, team: "Liverpool" },
    { year: "2021", value: 85, team: "Liverpool" },
    { year: "2022", value: 70, team: "Liverpool" },
    { year: "2023", value: 60, team: "Liverpool" },
    { year: "2024", value: 85, team: "Liverpool" },
    { year: "2025", value: 90, team: "Liverpool" }
  ];

  const maxValue = Math.max(...xtvData.map(d => d.value));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Financials</h2>
      
      <Tabs defaultValue="xtv" className="w-full">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="xtv" className="px-8">xTV</TabsTrigger>
          <TabsTrigger value="benchmarks" className="px-8 text-muted-foreground">xTV Benchmarks</TabsTrigger>
          <TabsTrigger value="resale" className="px-8 text-muted-foreground">Resale Value</TabsTrigger>
        </TabsList>

        <TabsContent value="xtv" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Chart */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {/* Y-axis label */}
                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">$158M</span>
                  </div>
                  
                  {/* Chart bars */}
                  <div className="flex items-end justify-between h-64 mb-4">
                    {xtvData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div 
                          className="bg-emerald-500 w-8 rounded-t"
                          style={{ 
                            height: `${(data.value / maxValue) * 200}px`,
                            minHeight: '8px'
                          }}
                        />
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg">{data.team === "Liverpool" ? "🔴" : data.team === "Roma" ? "🟡" : data.team === "Chelsea" ? "🔵" : "🟣"}</span>
                          <span className="text-xs text-muted-foreground">{data.year}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <span>$10.6M</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">xTV</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">xTV</span>
                      <span className="font-bold">$87M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">All time high</span>
                      <span className="font-bold">$140M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High last 24 months</span>
                      <span className="font-bold">$96M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Low last 24 months</span>
                      <span className="font-bold">-</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="benchmarks" className="mt-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-muted-foreground">
                xTV Benchmarks data would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resale" className="mt-8">
          <Card>
            <CardContent className="p-8">
              <div className="text-center text-muted-foreground">
                Resale Value data would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};