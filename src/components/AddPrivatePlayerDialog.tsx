
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, UserPlus } from "lucide-react";
import { usePrivatePlayers } from "@/hooks/usePrivatePlayers";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  club: z.string().optional(),
  age: z.coerce.number().min(14).max(50).optional(),
  positions: z.string().optional(),
  nationality: z.string().optional(),
  dominant_foot: z.enum(["Left", "Right", "Both"]).optional(),
  region: z.string().optional(),
  source_context: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddPrivatePlayerDialogProps {
  trigger?: React.ReactNode;
}

const AddPrivatePlayerDialog = ({ trigger }: AddPrivatePlayerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPrivatePlayer } = usePrivatePlayers();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      club: "",
      age: undefined,
      positions: "",
      nationality: "",
      dominant_foot: undefined,
      region: "",
      source_context: "",
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Convert positions string to array
      const positions = data.positions 
        ? data.positions.split(',').map(p => p.trim()).filter(p => p.length > 0)
        : undefined;

      // Ensure name is included and properly typed
      const playerData: CreatePrivatePlayerData = {
        name: data.name, // This is guaranteed to be a string due to form validation
        club: data.club,
        age: data.age || undefined,
        positions,
        nationality: data.nationality,
        dominant_foot: data.dominant_foot,
        region: data.region,
        source_context: data.source_context,
        notes: data.notes,
      };

      const newPlayer = await createPrivatePlayer(playerData);
      
      toast({
        title: "Player added successfully",
        description: `${data.name} has been added to your private players.`,
      });

      // Reset form and close dialog
      form.reset();
      setOpen(false);
      
      // Navigate to a player profile view (we'll need to handle private players in the profile view)
      toast({
        title: "Player created",
        description: "You can now create reports for this player.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/report-builder', { 
              state: { selectedPrivatePlayer: newPlayer } 
            })}
          >
            Create Report
          </Button>
        ),
      });
    } catch (error) {
      console.error('Error creating private player:', error);
      toast({
        title: "Error",
        description: "Failed to add player. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <UserPlus className="h-4 w-4" />
      Add Private Player
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Private Player</DialogTitle>
          <DialogDescription>
            Add a player who isn't in the main database to track privately.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter player name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="club"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club</FormLabel>
                    <FormControl>
                      <Input placeholder="Current club" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dominant_foot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dominant Foot</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select foot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Left">Left</SelectItem>
                        <SelectItem value="Right">Right</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="positions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Positions</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ST, CAM, LW" {...field} />
                    </FormControl>
                    <FormDescription>
                      Separate multiple positions with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Geographic region" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="source_context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source/Context</FormLabel>
                  <FormControl>
                    <Input placeholder="How did you discover this player?" {...field} />
                  </FormControl>
                  <FormDescription>
                    e.g. "Youth match vs Barcelona", "Recommended by agent"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any initial observations or notes about this player..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Player..." : "Add Player"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPrivatePlayerDialog;
