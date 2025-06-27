
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Activity, CheckCircle } from "lucide-react";
import { usePlayerInjuries, PlayerInjury } from "@/hooks/usePlayerInjuries";

interface PlayerInjuryHistoryProps {
  playerId: string;
}

const PlayerInjuryHistory = ({ playerId }: PlayerInjuryHistoryProps) => {
  const { data: injuries, isLoading, error } = usePlayerInjuries(playerId);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minor': return 'bg-yellow-100 text-yellow-800';
      case 'Moderate': return 'bg-orange-100 text-orange-800';
      case 'Severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Recovering': return <Activity className="h-4 w-4 text-orange-500" />;
      case 'Recovered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-red-100 text-red-800';
      case 'Recovering': return 'bg-orange-100 text-orange-800';
      case 'Recovered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const activeInjuries = injuries?.filter(injury => injury.status === 'Active') || [];
  const recoveringInjuries = injuries?.filter(injury => injury.status === 'Recovering') || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Injury History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Loading injury data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !injuries) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Injury History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-muted-foreground">Unable to load injury data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Injury History
          {(activeInjuries.length > 0 || recoveringInjuries.length > 0) && (
            <Badge variant="outline" className="ml-2">
              {activeInjuries.length + recoveringInjuries.length} Current
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {injuries.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-muted-foreground">No injury history recorded</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Body Part</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Return Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {injuries.map((injury) => (
                <TableRow key={injury.id}>
                  <TableCell className="font-medium">{injury.type}</TableCell>
                  <TableCell>{injury.affectedBodyPart}</TableCell>
                  <TableCell>
                    <Badge className={`${getSeverityColor(injury.severity)} border-0`}>
                      {injury.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(injury.status)}
                      <Badge className={`${getStatusColor(injury.status)} border-0`}>
                        {injury.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(injury.startDate)}</TableCell>
                  <TableCell>
                    {injury.actualReturnDate ? (
                      formatDate(injury.actualReturnDate)
                    ) : injury.expectedReturnDate ? (
                      <span className="text-muted-foreground">
                        Expected: {formatDate(injury.expectedReturnDate)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">TBD</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerInjuryHistory;
