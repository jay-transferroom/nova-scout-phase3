
import { useState, useEffect } from "react";
import { MessageSquare, Plus, Calendar, User, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/reportFormatting";

interface PlayerNote {
  id: string;
  playerId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
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
  const { user, profile } = useAuth();
  const [notes, setNotes] = useState<PlayerNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async () => {
    if (!playerId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('player_notes')
        .select(`
          *,
          author:profiles(first_name, last_name, email)
        `)
        .eq('player_id', playerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedNotes: PlayerNote[] = (data || []).map((note: any) => ({
        id: note.id,
        playerId: note.player_id,
        authorId: note.author_id,
        content: note.content,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
        author: note.author
      }));

      setNotes(transformedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || !user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('player_notes')
        .insert({
          player_id: playerId,
          author_id: user.id,
          content: newNote.trim()
        });

      if (error) throw error;

      setNewNote("");
      await fetchNotes();
      toast({
        title: "Success",
        description: "Note added successfully",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('player_notes')
        .update({
          content: editContent.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId);

      if (error) throw error;

      setEditingNote(null);
      setEditContent("");
      await fetchNotes();
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
    } catch (error) {
      console.error('Error updating note:', error);
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
      const { error } = await supabase
        .from('player_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      await fetchNotes();
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (note: PlayerNote) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditContent("");
  };

  const getAuthorName = (author: PlayerNote['author']) => {
    if (author.first_name && author.last_name) {
      return `${author.first_name} ${author.last_name}`;
    }
    return author.email;
  };

  const getAuthorInitials = (author: PlayerNote['author']) => {
    if (author.first_name && author.last_name) {
      return `${author.first_name[0]}${author.last_name[0]}`.toUpperCase();
    }
    return author.email[0].toUpperCase();
  };

  useEffect(() => {
    if (open) {
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
          {/* Add new note */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Add a Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Share your thoughts about this player..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={addNote} 
                disabled={!newNote.trim() || submitting}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>

          {/* Notes list */}
          <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notes yet. Be the first to add a note about this player!
              </div>
            ) : (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                          {getAuthorInitials(note.author)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {getAuthorName(note.author)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(note.createdAt)}
                            </span>
                            {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                              <Badge variant="outline" className="text-xs">
                                edited
                              </Badge>
                            )}
                          </div>
                          
                          {note.authorId === user?.id && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(note)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNote(note.id)}
                                disabled={submitting}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {editingNote === note.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateNote(note.id)}
                                disabled={!editContent.trim() || submitting}
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {note.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
