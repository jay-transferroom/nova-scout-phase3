
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { NoteForm } from "./player-notes/NoteForm";
import { NotesList } from "./player-notes/NotesList";

interface PlayerNote {
  id: string;
  player_id: string;
  author_id: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  author: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

interface PlayerNotesProps {
  playerId: string;
  playerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlayerNotes = ({ playerId, playerName, open, onOpenChange }: PlayerNotesProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<PlayerNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async () => {
    if (!playerId) return;
    
    setLoading(true);
    try {
      console.log('PlayerNotes - Fetching notes for player:', playerId);
      
      // First get the notes for this specific player
      const { data: notesData, error: notesError } = await supabase
        .from('player_notes')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });

      if (notesError) {
        console.error('PlayerNotes - Error fetching notes:', notesError);
        throw notesError;
      }

      console.log('PlayerNotes - Raw notes data for player', playerId, ':', notesData);

      if (!notesData || notesData.length === 0) {
        console.log('PlayerNotes - No notes found for player:', playerId);
        setNotes([]);
        return;
      }

      // Get unique author IDs
      const authorIds = [...new Set(notesData.map(note => note.author_id))];
      console.log('PlayerNotes - Author IDs to fetch:', authorIds);
      
      // Fetch author profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .in('id', authorIds);

      if (profilesError) {
        console.error('PlayerNotes - Error fetching profiles:', profilesError);
        // Continue with notes but without author info
      }

      console.log('PlayerNotes - Profiles data:', profilesData);

      // Map notes with author information
      const transformedNotes: PlayerNote[] = notesData.map((note: any) => {
        const author = profilesData?.find(profile => profile.id === note.author_id);
        const noteWithAuthor = {
          id: note.id,
          player_id: note.player_id,
          author_id: note.author_id,
          content: note.content,
          tags: note.tags || [],
          created_at: note.created_at,
          updated_at: note.updated_at,
          author: author ? {
            first_name: author.first_name,
            last_name: author.last_name,
            email: author.email
          } : { email: 'Unknown User' }
        };
        return noteWithAuthor;
      });

      console.log('PlayerNotes - Transformed notes for player', playerId, ':', transformedNotes);
      setNotes(transformedNotes);
    } catch (error) {
      console.error('PlayerNotes - Error in fetchNotes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (content: string, tags: string[] = []) => {
    if (!user) {
      console.log('PlayerNotes - Cannot add note: missing user');
      toast({
        title: "Error",
        description: "You must be logged in to add notes",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      console.log('PlayerNotes - Adding note for player:', playerId, 'by user:', user.id, 'with tags:', tags);
      
      const { error } = await supabase
        .from('player_notes')
        .insert({
          player_id: playerId,
          author_id: user.id,
          content: content,
          tags: tags
        });

      if (error) {
        console.error('PlayerNotes - Error adding note:', error);
        throw error;
      }

      console.log('PlayerNotes - Note added successfully for player:', playerId);
      await fetchNotes();
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    } catch (error) {
      console.error('PlayerNotes - Error in addNote:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateNote = async (noteId: string, content: string, tags: string[] = []) => {
    setSubmitting(true);
    try {
      console.log('PlayerNotes - Updating note:', noteId, 'with tags:', tags);
      
      const { error } = await supabase
        .from('player_notes')
        .update({
          content: content,
          tags: tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId);

      if (error) {
        console.error('PlayerNotes - Error updating note:', error);
        throw error;
      }

      await fetchNotes();
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    } catch (error) {
      console.error('PlayerNotes - Error in updateNote:', error);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    setSubmitting(true);
    try {
      console.log('PlayerNotes - Deleting note:', noteId);
      
      const { error } = await supabase
        .from('player_notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('PlayerNotes - Error deleting note:', error);
        throw error;
      }

      await fetchNotes();
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('PlayerNotes - Error in deleteNote:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (open && playerId) {
      console.log('PlayerNotes - Sheet opened, fetching notes for player:', playerId);
      fetchNotes();
    }
  }, [open, playerId]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Notes for {playerName}
          </SheetTitle>
          <SheetDescription>
            Add and view notes about this player. Notes are visible to all team members.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <NoteForm onAddNote={addNote} submitting={submitting} />
          
          <NotesList
            notes={notes}
            loading={loading}
            currentUserId={user?.id}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            submitting={submitting}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};
