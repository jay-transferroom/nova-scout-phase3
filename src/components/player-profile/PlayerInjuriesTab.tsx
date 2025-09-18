import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/types/player";

interface PlayerInjuriesTabProps {
  player: Player;
}

export const PlayerInjuriesTab = ({ player }: PlayerInjuriesTabProps) => {
  // Mock injury data
  const injuryStats = [
    { year: "2021", daysInjured: 0, gamesPercent: 0 },
    { year: "2022", daysInjured: 0, gamesPercent: 0 },
    { year: "2023", daysInjured: 0, gamesPercent: 0 },
    { year: "2024", daysInjured: 40, gamesPercent: 16.2 },
    { year: "2025", daysInjured: 0, gamesPercent: 0 }
  ];

  const injuryHistory = [
    { year: "2024", injury: "Muscle", from: "19/02/24", to: "04/03/24", days: 14 },
    { year: "2024", injury: "Hamstring", from: "19/01/24", to: "13/02/24", days: 25 },
    { year: "2019", injury: "Ankle", from: "11/11/19", to: "22/11/19", days: 11 },
    { year: "2019", injury: "Ankle", from: "06/10/19", to: "22/10/19", days: 16 },
    { year: "2019", injury: "Concussion", from: "05/05/19", to: "11/05/19", days: 6 },
    { year: "2018", injury: "Thigh", from: "13/10/18", to: "18/10/18", days: 5 },
    { year: "2018", injury: "Shoulder - Soft Tissue", from: "27/05/18", to: "14/06/18", days: 18 },
    { year: "2016", injury: "Ankle - Ligament", from: "01/12/16", to: "15/12/16", days: 14 },
    { year: "2015", injury: "Ankle - Ligament", from: "09/11/15", to: "07/12/15", days: 28 },
    { year: "2015", injury: "Thigh", from: "25/05/15", to: "01/06/15", days: 7 }
  ];

  const maxDays = Math.max(...injuryStats.map(s => s.daysInjured));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Injuries</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Statistics */}
        <div className="space-y-6">
          <div>
            <p className="text-lg mb-2">
              <span className="font-semibold">Salah has missed</span> <span className="text-emerald-600 font-semibold">3%</span> <span className="font-semibold">of league games over 5 years through injury</span>
            </p>
          </div>

          {/* Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-end justify-between h-64 mb-8">
                {injuryStats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="relative w-full max-w-16 flex flex-col items-center">
                      {/* Days injured bar */}
                      <div 
                        className="bg-gray-300 w-8 rounded-t mb-1"
                        style={{ 
                          height: `${maxDays > 0 ? (stat.daysInjured / maxDays) * 100 : 0}px`,
                          minHeight: stat.daysInjured > 0 ? '20px' : '0px'
                        }}
                      />
                      {/* Games missed percentage bar */}
                      <div 
                        className="bg-emerald-500 w-8 rounded-t"
                        style={{ 
                          height: `${stat.gamesPercent * 8}px`,
                          minHeight: stat.gamesPercent > 0 ? '20px' : '0px'
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{stat.year}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span className="text-muted-foreground">Days Injured</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                  <span className="text-muted-foreground">% Games Missed</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">The average for Wingers is 5%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Injury History */}
        <div className="space-y-6">
          <div>
            <p className="text-lg">
              <span className="font-semibold">Salah missed</span> <span className="text-emerald-600 font-semibold">28 days</span> <span className="font-semibold">with an ankle injury sustained in 2015</span>
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-muted-foreground">Year</th>
                    <th className="text-left py-3 font-medium text-muted-foreground">Injury</th>
                    <th className="text-left py-3 font-medium text-muted-foreground">From</th>
                    <th className="text-left py-3 font-medium text-muted-foreground">To</th>
                    <th className="text-right py-3 font-medium text-muted-foreground">Days injured</th>
                  </tr>
                </thead>
                <tbody>
                  {injuryHistory.map((injury, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 text-muted-foreground">{injury.year}</td>
                      <td className="py-3">{injury.injury}</td>
                      <td className="py-3 text-muted-foreground">{injury.from}</td>
                      <td className="py-3 text-muted-foreground">{injury.to}</td>
                      <td className="py-3 text-right font-medium">{injury.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button variant="outline" className="px-8">
              SHOW MORE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};