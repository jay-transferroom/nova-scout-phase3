
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/player";
import { BarChart3, TrendingUp, Users, Target } from "lucide-react";

interface PlayerDetailedStatsProps {
  player: Player;
}

const PlayerDetailedStats = ({ player }: PlayerDetailedStatsProps) => {
  // Mock detailed performance data - in a real app this would come from the database
  const performanceStats = [
    { category: "Minutes Played", value: "2,340", season: "2023/24" },
    { category: "Appearances", value: "28", season: "2023/24" },
    { category: "Goals", value: "8", season: "2023/24" },
    { category: "Assists", value: "12", season: "2023/24" },
    { category: "Pass Accuracy", value: "84%", season: "2023/24" },
    { category: "Key Passes p90", value: "2.3", season: "2023/24" },
    { category: "Dribbles p90", value: "3.8", season: "2023/24" },
    { category: "Interceptions p90", value: "1.2", season: "2023/24" },
  ];

  const physicalStats = [
    { attribute: "Height", value: "1.82m" },
    { attribute: "Weight", value: "76kg" },
    { attribute: "Preferred Foot", value: player.dominantFoot },
    { attribute: "Top Speed", value: "32.4 km/h" },
    { attribute: "Distance Covered", value: "11.2 km/game" },
  ];

  const marketData = [
    { metric: "Current Value", value: player.xtvScore ? `${(player.xtvScore / 1000000).toFixed(1)}M` : "N/A" },
    { metric: "Peak Value", value: player.xtvScore ? `${((player.xtvScore * 1.2) / 1000000).toFixed(1)}M` : "N/A" },
    { metric: "Contract Length", value: player.contractExpiry ? "2 years" : "N/A" },
    { metric: "Release Clause", value: "None" },
    { metric: "Agent", value: "CAA Sports" },
  ];

  const tacticalData = [
    { role: "Primary Position", details: player.positions[0] || "N/A", effectiveness: "92%" },
    { role: "Secondary Position", details: player.positions[1] || "N/A", effectiveness: "78%" },
    { role: "Playing Style", details: "Versatile Playmaker", effectiveness: "85%" },
    { role: "Squad Role", details: "Regular Starter", effectiveness: "90%" },
  ];

  const getEffectivenessColor = (percentage: string) => {
    const value = parseInt(percentage);
    if (value >= 90) return "bg-green-100 text-green-800";
    if (value >= 80) return "bg-blue-100 text-blue-800";
    if (value >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Summary (2023/24)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Season</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stat.category}</TableCell>
                  <TableCell className="font-bold text-blue-600">{stat.value}</TableCell>
                  <TableCell className="text-muted-foreground">{stat.season}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Physical & Technical Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Physical & Technical Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attribute</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {physicalStats.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stat.attribute}</TableCell>
                  <TableCell className="font-bold">{stat.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tactical Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Tactical Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Effectiveness</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tacticalData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{data.role}</TableCell>
                  <TableCell>{data.details}</TableCell>
                  <TableCell>
                    <Badge className={getEffectivenessColor(data.effectiveness)}>
                      {data.effectiveness}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Market Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Market Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{data.metric}</TableCell>
                  <TableCell className="font-bold text-green-600">{data.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerDetailedStats;
