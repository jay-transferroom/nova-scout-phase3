
import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/utils/reportFormatting";

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

interface NoteItemProps {
  note: PlayerNote;
  currentUserId?: string;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  submitting: boolean;
}

export const NoteItem = ({ 
  note, 
  currentUserId, 
  onUpdateNote, 
  onDeleteNote, 
  submitting 
}: NoteItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

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

  const startEdit = () => {
    setIsEditing(true);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;
    
    await onUpdateNote(note.id, editContent.trim());
    setIsEditing(false);
    setEditContent("");
  };

  const handleDelete = async () => {
    await onDeleteNote(note.id);
  };

  return (
    <Card>
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
                  {formatDate(new Date(note.created_at))}
                </span>
                {note.updated_at !== note.created_at && (
                  <Badge variant="outline" className="text-xs">
                    edited
                  </Badge>
                )}
              </div>
              
              {note.author_id === currentUserId && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startEdit}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
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
  );
};
