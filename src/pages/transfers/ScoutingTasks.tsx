
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
import { MapPin, Calendar, FileText, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useMyScoutingTasks, useUpdateAssignmentStatus } from "@/hooks/useScoutingAssignments";
import { toast } from "@/hooks/use-toast";

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

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'assigned': return 'secondary';
    case 'in_progress': return 'default';
    case 'completed': return 'outline';
    case 'reviewed': return 'default';
    default: return 'secondary';
  }
};

const ScoutingTasks = () => {
  const { data: tasks = [], isLoading, error } = useMyScoutingTasks();
  const updateStatus = useUpdateAssignmentStatus();
  const [filter, setFilter] = useState<string>("all");
  
  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(task => task.priority.toLowerCase() === filter.toLowerCase());

  const handleStartScouting = async (taskId: string) => {
    try {
      await updateStatus.mutateAsync({ assignmentId: taskId, status: 'in_progress' });
      toast({
        title: "Task Started",
        description: "Scouting task marked as in progress.",
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await updateStatus.mutateAsync({ assignmentId: taskId, status: 'completed' });
      toast({
        title: "Task Completed",
        description: "Scouting task marked as completed.",
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

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
        <h1 className="text-3xl font-bold">My Scouting Tasks</h1>
        <p className="text-muted-foreground mt-2">
          Players assigned to you for scouting and reporting
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
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.players?.name}</div>
                      <div className="text-muted-foreground text-sm">{task.players?.club}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.players?.positions[0]}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.deadline ? (
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span>{new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No deadline</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {task.status === 'assigned' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleStartScouting(task.id)}
                          disabled={updateStatus.isPending}
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}
                      
                      <Link to={`/report-builder?playerId=${task.player_id}&assignmentId=${task.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>Scout</span>
                        </Button>
                      </Link>

                      {task.status === 'in_progress' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={updateStatus.isPending}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      )}
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
