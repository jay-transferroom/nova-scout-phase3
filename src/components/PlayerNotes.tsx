
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
      
      const { data, error } = await supabase
        .from('player_notes')
        .select(`
          *,
          author:profiles!player_notes_author_id_fkey(first_name, last_name, email)
        `)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('PlayerNotes - Error fetching notes:', error);
        throw error;
      }

      console.log('PlayerNotes - Raw notes data:', data);

      const transformedNotes: PlayerNote[] = (data || []).map((note: any) => ({
        id: note.id,
        player_id: note.player_id,
        author_id: note.author_id,
        content: note.content,
        created_at: note.created_at,
        updated_at: note.updated_at,
        author: note.author || { email: 'Unknown User' }
      }));

      console.log('PlayerNotes - Transformed notes:', transformedNotes);
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

  const addNote = async (content: string) => {
    if (!user) {
      console.log('PlayerNotes - Cannot add note: missing user');
      return;
    }

    setSubmitting(true);
    try {
      console.log('PlayerNotes - Adding note for player:', playerId, 'by user:', user.id);
      
      const { error } = await supabase
        .from('player_notes')
        .insert({
          player_id: playerId,
          author_id: user.id,
          content: content
        });

      if (error) {
        console.error('PlayerNotes - Error adding note:', error);
        throw error;
      }

      console.log('PlayerNotes - Note added successfully');
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

  const updateNote = async (noteId: string, content: string) => {
    setSubmitting(true);
    try {
      console.log('PlayerNotes - Updating note:', noteId);
      
      const { error } = await supabase
        .from('player_notes')
        .update({
          content: content,
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
      console.log('PlayerNotes - Sheet opened, fetching notes for:', playerId);
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
