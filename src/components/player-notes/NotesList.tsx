
import { useState } from "react";
import { Edit2, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

interface NotesListProps {
  notes: PlayerNote[];
  loading: boolean;
  currentUserId?: string;
  onUpdateNote: (noteId: string, content: string, tags: string[]) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  submitting: boolean;
}

export const NotesList = ({ 
  notes, 
  loading, 
  currentUserId, 
  onUpdateNote, 
  onDeleteNote, 
  submitting 
}: NotesListProps) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const handleEditStart = (note: PlayerNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
    setEditTags(note.tags || []);
  };

  const handleEditCancel = () => {
    setEditingNoteId(null);
    setEditContent("");
    setEditTags([]);
    setCurrentTag("");
  };

  const handleEditSave = async (noteId: string) => {
    await onUpdateNote(noteId, editContent, editTags);
    setEditingNoteId(null);
    setEditContent("");
    setEditTags([]);
    setCurrentTag("");
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !editTags.includes(trimmedTag)) {
      setEditTags([...editTags, trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const getAuthorName = (author: PlayerNote['author']) => {
    if (author.first_name && author.last_name) {
      return `${author.first_name} ${author.last_name}`;
    }
    if (author.first_name) {
      return author.first_name;
    }
    return author.email;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No notes yet for this player.</p>
        <p className="text-sm text-muted-foreground mt-1">Add the first note above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {notes.map((note) => (
        <Card key={note.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{getAuthorName(note.author)}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(note.created_at).toLocaleDateString()}
                </span>
                {note.updated_at !== note.created_at && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )}
              </div>
              {currentUserId === note.author_id && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStart(note)}
                    disabled={submitting}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={submitting}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Note</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this note? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDeleteNote(note.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {editingNoteId === note.id ? (
              <div className="space-y-3">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add/edit tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddTag}
                      disabled={!currentTag.trim() || editTags.includes(currentTag.trim())}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {editTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {editTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 hover:bg-transparent"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleEditSave(note.id)}
                    disabled={!editContent.trim() || submitting}
                  >
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleEditCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
