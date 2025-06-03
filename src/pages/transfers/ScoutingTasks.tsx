
import { useState } from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useScoutingTasks } from "@/hooks/useScoutingTasks";

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "High":
      return "destructive";
    case "Medium":
      return "default";
    default:
      return "secondary";
  }
};

const ScoutingTasks = () => {
  const { data: tasks = [], isLoading, error } = useScoutingTasks();
  const [filter, setFilter] = useState<string>("all");
  
  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(task => task.priority.toLowerCase() === filter.toLowerCase());

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading scouting tasks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12 text-red-500">
          Error loading scouting tasks. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Scouting Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Players assigned to you based on your location and availability
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Tasks ({tasks.length})
          </Button>
          <Button 
            variant={filter === "high" ? "default" : "outline"}
            onClick={() => setFilter("high")}
          >
            High Priority ({tasks.filter(t => t.priority === "High").length})
          </Button>
          <Button 
            variant={filter === "medium" ? "default" : "outline"}
            onClick={() => setFilter("medium")}
          >
            Medium Priority ({tasks.filter(t => t.priority === "Medium").length})
          </Button>
          <Button 
            variant={filter === "low" ? "default" : "outline"}
            onClick={() => setFilter("low")}
          >
            Low Priority ({tasks.filter(t => t.priority === "Low").length})
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Upcoming Match</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.playerName}</div>
                      <div className="text-muted-foreground text-sm">{task.club}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.position}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span>{task.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.upcomingMatch ? (
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span>{new Date(task.upcomingMatch.date).toLocaleDateString()}</span>
                        </div>
                        <div className="text-muted-foreground mt-1">
                          {task.upcomingMatch.opposition} ({task.upcomingMatch.competition})
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {task.upcomingMatch.venue}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No upcoming matches</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/reports/new?playerId=${task.playerId}&requirementId=${task.requirementId}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>Scout</span>
                        </Button>
                      </Link>
                      <Link to={`/transfers/requirements/${task.requirementId}`}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" />
                          <span>View Requirement</span>
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No scouting tasks found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ScoutingTasks;
