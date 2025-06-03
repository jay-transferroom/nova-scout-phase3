
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ImageIcon, Users } from "lucide-react";

const PlayerPhotoUpdater = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateResults, setUpdateResults] = useState<{
    updated: number;
    errors: number;
    total_processed: number;
  } | null>(null);

  const handleUpdatePhotos = async () => {
    setIsUpdating(true);
    setUpdateResults(null);
    
    try {
      console.log('Starting player photo update...');
      
      const { data, error } = await supabase.functions.invoke('update-player-photos', {
        body: { batch_size: 10 }
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Unknown error occurred');
      }

      setUpdateResults({
        updated: data.updated || 0,
        errors: data.errors || 0,
        total_processed: data.total_processed || 0
      });

      toast.success(`Successfully updated ${data.updated} player photos!`);
      
    } catch (error) {
      console.error('Error updating player photos:', error);
      toast.error('Failed to update player photos. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          AI Player Photos
        </CardTitle>
        <CardDescription>
          Replace player photos with AI-generated images of footballers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleUpdatePhotos} 
          disabled={isUpdating}
          className="w-full"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Photos...
            </>
          ) : (
            <>
              <Users className="mr-2 h-4 w-4" />
              Update Player Photos
            </>
          )}
        </Button>

        {updateResults && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                Processed: {updateResults.total_processed}
              </Badge>
              <Badge variant="default">
                Updated: {updateResults.updated}
              </Badge>
              {updateResults.errors > 0 && (
                <Badge variant="destructive">
                  Errors: {updateResults.errors}
                </Badge>
              )}
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          This will generate AI photos for up to 10 players at a time. You may need to run this multiple times for all players.
        </p>
      </CardContent>
    </Card>
  );
};

export default PlayerPhotoUpdater;
