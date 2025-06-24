
import { NoteItem } from "./NoteItem";

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

interface NotesListProps {
  notes: PlayerNote[];
  loading: boolean;
  currentUserId?: string;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
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
  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading notes...
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notes yet. Be the first to add a note about this player!
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          currentUserId={currentUserId}
          onUpdateNote={onUpdateNote}
          onDeleteNote={onDeleteNote}
          submitting={submitting}
        />
      ))}
    </div>
  );
};
