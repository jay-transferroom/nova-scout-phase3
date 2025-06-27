
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NoteFormProps {
  onAddNote: (content: string, tags: string[]) => Promise<void>;
  submitting: boolean;
}

export const NoteForm = ({ onAddNote, submitting }: NoteFormProps) => {
  const [newNote, setNewNote] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async () => {
    if (!newNote.trim()) return;
    
    await onAddNote(newNote.trim(), tags);
    setNewNote("");
    setTags([]);
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
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add tags (e.g. pace, shooting, attitude)"
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
              disabled={!currentTag.trim() || tags.includes(currentTag.trim())}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
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
