
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Player } from "@/types/player";
import { BarChart3 } from "lucide-react";

interface PlayerDetailedStatsProps {
  player: Player;
}

const PlayerDetailedStats = ({ player }: PlayerDetailedStatsProps) => {
  // Mock detailed performance data - in a real app this would come from the database
  const allStatsData = [
    // Performance Stats
    { category: "Performance", attribute: "Minutes Played", value: "2,340", type: "2023/24" },
    { category: "Performance", attribute: "Appearances", value: "28", type: "2023/24" },
    { category: "Performance", attribute: "Goals", value: "8", type: "2023/24" },
    { category: "Performance", attribute: "Assists", value: "12", type: "2023/24" },
    { category: "Performance", attribute: "Pass Accuracy", value: "84%", type: "2023/24" },
    { category: "Performance", attribute: "Key Passes p90", value: "2.3", type: "2023/24" },
    { category: "Performance", attribute: "Dribbles p90", value: "3.8", type: "2023/24" },
    { category: "Performance", attribute: "Interceptions p90", value: "1.2", type: "2023/24" },
    
    // Physical & Technical Stats
    { category: "Physical", attribute: "Height", value: "1.82m", type: "Physical" },
    { category: "Physical", attribute: "Weight", value: "76kg", type: "Physical" },
    { category: "Physical", attribute: "Preferred Foot", value: player.dominantFoot, type: "Technical" },
    { category: "Physical", attribute: "Top Speed", value: "32.4 km/h", type: "Physical" },
    { category: "Physical", attribute: "Distance Covered", value: "11.2 km/game", type: "Physical" },
    
    // Tactical Stats
    { category: "Tactical", attribute: "Primary Position", value: player.positions[0] || "N/A", type: "92%" },
    { category: "Tactical", attribute: "Secondary Position", value: player.positions[1] || "N/A", type: "78%" },
    { category: "Tactical", attribute: "Playing Style", value: "Versatile Playmaker", type: "85%" },
    { category: "Tactical", attribute: "Squad Role", value: "Regular Starter", type: "90%" },
    
    // Market Stats
    { category: "Market", attribute: "Current Value", value: player.xtvScore ? `${(player.xtvScore / 1000000).toFixed(1)}M` : "N/A", type: "Market" },
    { category: "Market", attribute: "Peak Value", value: player.xtvScore ? `${((player.xtvScore * 1.2) / 1000000).toFixed(1)}M` : "N/A", type: "Market" },
    { category: "Market", attribute: "Contract Length", value: player.contractExpiry ? "2 years" : "N/A", type: "Contract" },
    { category: "Market", attribute: "Release Clause", value: "None", type: "Contract" },
    { category: "Market", attribute: "Agent", value: "CAA Sports", type: "Contract" },
  ];

  const getEffectivenessColor = (percentage: string) => {
    if (!percentage.includes('%')) return "bg-gray-100 text-gray-600";
    const value = parseInt(percentage);
    if (value >= 90) return "bg-green-100 text-green-800";
    if (value >= 80) return "bg-blue-100 text-blue-800";
    if (value >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Performance": return "bg-blue-50 text-blue-700";
      case "Physical": return "bg-green-50 text-green-700";
      case "Tactical": return "bg-purple-50 text-purple-700";
      case "Market": return "bg-orange-50 text-orange-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Detailed Player Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Category</TableHead>
              <TableHead>Attribute</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[120px]">Type/Effectiveness</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allStatsData.map((stat, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge className={`${getCategoryColor(stat.category)} border-0`}>
                    {stat.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{stat.attribute}</TableCell>
                <TableCell className="font-bold text-blue-600">{stat.value}</TableCell>
                <TableCell>
                  {stat.type.includes('%') ? (
                    <Badge className={`${getEffectivenessColor(stat.type)} border-0`}>
                      {stat.type}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">{stat.type}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlayerDetailedStats;
