
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NoteFormProps {
  onAddNote: (content: string) => Promise<void>;
  submitting: boolean;
}

export const NoteForm = ({ onAddNote, submitting }: NoteFormProps) => {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = async () => {
    if (!newNote.trim()) return;
    
    await onAddNote(newNote.trim());
    setNewNote("");
  };

  return (
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
          onClick={handleSubmit} 
          disabled={!newNote.trim() || submitting}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </CardContent>
    </Card>
  );
};
