import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Trash2, Download, ExternalLink } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface SavedChat {
  id: string;
  title: string;
  initial_query: string;
  created_at: string;
  updated_at: string;
  messages: any;
  liked: boolean | null;
  saved: boolean;
}

const SavedChats = () => {
  const [chats, setChats] = useState<SavedChat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedChats();
  }, []);

  const fetchSavedChats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .eq('saved', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching saved chats:', error);
      toast({
        title: "Error",
        description: "Failed to load saved chats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      setChats(chats.filter(chat => chat.id !== chatId));
      toast({
        title: "Success",
        description: "Chat deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  const exportChat = (chat: SavedChat) => {
    const messages = Array.isArray(chat.messages) ? chat.messages : [];
    const chatData = {
      title: chat.title,
      created_at: chat.created_at,
      messages: messages
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${chat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openChat = (chatId: string) => {
    // Open the AI Assistant with this specific chat loaded
    navigate('/', { state: { openChat: chatId } });
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Chats</h1>
          <p className="text-muted-foreground">
            Your saved AI Scout Assistant conversations
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {chats.length} saved
        </Badge>
      </div>

      {chats.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No saved chats yet</h3>
            <p className="text-muted-foreground mb-4">
              Start a conversation with the AI Scout Assistant and save your favorite chats.
            </p>
            <Button onClick={() => navigate('/')}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {chats.map((chat) => (
            <Card key={chat.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {chat.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(chat.updated_at), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {Array.isArray(chat.messages) ? chat.messages.length : 0} messages
                      </div>
                      {chat.liked && (
                        <Badge variant="secondary" className="text-xs">
                          Liked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {chat.initial_query}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => openChat(chat.id)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Continue Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => exportChat(chat)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteChat(chat.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedChats;