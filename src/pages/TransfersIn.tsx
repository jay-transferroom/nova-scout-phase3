import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, DollarSign, User, FileText } from "lucide-react";

const TransfersIn = () => {
  const { profile } = useAuth();

  // Mock data for transfers - this will be replaced with real data later
  const mockTransfers = [
    {
      id: "1",
      playerName: "Marcus Johnson",
      fromClub: "Liverpool FC",
      position: "Midfielder",
      fee: "£15M",
      status: "In Progress",
      expectedCompletion: "2024-01-15",
      priority: "High"
    },
    {
      id: "2",
      playerName: "Alessandro Santos",
      fromClub: "AC Milan",
      position: "Forward",
      fee: "£22M",
      status: "Negotiating",
      expectedCompletion: "2024-01-20",
      priority: "Medium"
    },
    {
      id: "3",
      playerName: "David Mueller",
      fromClub: "Bayern Munich",
      position: "Defender",
      fee: "£8M",
      status: "Medical",
      expectedCompletion: "2024-01-10",
      priority: "High"
    }
  ];

  if (profile?.role !== 'director') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">This section is only available for directors.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-800';
      case 'medical':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transfers In</h1>
          <p className="text-muted-foreground">Monitor and manage incoming transfer activities</p>
        </div>
        <Button>
          <User className="h-4 w-4 mr-2" />
          Add New Transfer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-sm text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">£45M</div>
            <p className="text-sm text-muted-foreground">Combined transfer fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Expected This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">2</div>
            <p className="text-sm text-muted-foreground">Completions expected</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Transfers</h2>
        
        {mockTransfers.map((transfer) => (
          <Card key={transfer.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{transfer.playerName}</h3>
                    <Badge className={getPriorityColor(transfer.priority)}>
                      {transfer.priority}
                    </Badge>
                    <Badge className={getStatusColor(transfer.status)}>
                      {transfer.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{transfer.position}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>From {transfer.fromClub}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>{transfer.fee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Expected: {new Date(transfer.expectedCompletion).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    Update Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockTransfers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Transfers</h3>
            <p className="text-muted-foreground mb-4">
              There are currently no incoming transfers being tracked.
            </p>
            <Button>
              <User className="h-4 w-4 mr-2" />
              Add New Transfer
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransfersIn;