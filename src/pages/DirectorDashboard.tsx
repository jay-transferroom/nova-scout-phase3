import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Bookmark, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const DirectorDashboard = () => {
  const { profile } = useAuth();

  const dashboardCards = [
    {
      title: "Squad Overview",
      description: "Current squad composition and analysis",
      icon: Users,
      href: "/squad-view",
      color: "text-blue-600"
    },
    {
      title: "Shortlists",
      description: "Curated player shortlists",
      icon: Bookmark,
      href: "/shortlists",
      color: "text-green-600"
    },
    {
      title: "Reports",
      description: "Latest scouting reports",
      icon: FileText,
      href: "/reports",
      color: "text-purple-600"
    },
    {
      title: "Transfers In",
      description: "Incoming transfer activities",
      icon: TrendingUp,
      href: "/transfers-in",
      color: "text-orange-600"
    }
  ];

  if (profile?.role !== 'director') {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">This dashboard is only available for directors.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Director Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.first_name}. Here's your executive overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <a href={card.href} className="block h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{card.description}</CardDescription>
                </CardContent>
              </a>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">New squad analysis completed</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">3 new players added to shortlist</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">12 reports submitted this week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Squad Size</span>
                <span className="font-medium">25 Players</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Shortlists</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending Transfers</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirectorDashboard;