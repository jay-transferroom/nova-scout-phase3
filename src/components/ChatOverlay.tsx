import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Send, Loader2, User, Bot, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SearchResult {
  id: string;
  type: 'player' | 'report' | 'ai_recommendation';
  title: string;
  subtitle?: string;
  description?: string;
  confidence?: number;
  player_id?: string;
  report_id?: string;
  metadata: any;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  results?: SearchResult[];
  timestamp: Date;
}

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ isOpen, onClose, initialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, isOpen]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { 
          query: query,
          limit: 10
        }
      });

      if (error) {
        console.error('AI Search error:', error);
        toast({
          title: "Search Error",
          description: "Failed to perform search. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data?.results?.length > 0 
          ? `I found ${data.results.length} results for "${query}":` 
          : `No results found for "${query}". Try rephrasing your search or using different keywords.`,
        results: data?.results || [],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error", 
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      handleSearch(inputValue);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'player':
        if (result.player_id) {
          if (result.metadata?.isPrivatePlayer) {
            navigate(`/private-player/${result.player_id}`);
          } else {
            navigate(`/player/${result.player_id}`);
          }
        }
        break;
      case 'report':
        if (result.report_id) {
          navigate(`/report/${result.report_id}`);
        }
        break;
    }
    onClose();
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'player':
        return <User className="h-4 w-4" />;
      case 'report':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute bottom-4 right-4 w-96 h-[600px] pointer-events-auto">
        <Card className="h-full flex flex-col shadow-xl border-border bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              AI Scout Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4 pt-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm">
                  Ask me about players, reports, or request recommendations!
                </div>
              )}
              
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        {message.type === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                        <span className="font-medium">
                          {message.type === 'user' ? 'You' : 'Assistant'}
                        </span>
                      </div>
                      {message.content}
                    </div>
                  </div>
                  
                  {/* Search Results */}
                  {message.results && message.results.length > 0 && (
                    <div className="space-y-2 ml-4">
                      {message.results.map((result) => (
                        <div
                          key={`${result.type}-${result.id}`}
                          className="flex items-start justify-between p-2 border rounded-lg hover:bg-accent transition-colors cursor-pointer text-xs"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getResultIcon(result.type)}
                              <span className="font-medium truncate">{result.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {result.type}
                              </Badge>
                              {result.confidence && (
                                <Badge variant="secondary" className="text-xs">
                                  {Math.round(result.confidence * 100)}%
                                </Badge>
                              )}
                            </div>
                            
                            {result.subtitle && (
                              <div className="text-xs text-muted-foreground mb-1">
                                {result.subtitle}
                              </div>
                            )}
                            
                            {result.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {result.description}
                              </div>
                            )}
                          </div>
                          
                          <ExternalLink className="h-3 w-3 text-muted-foreground ml-2 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      <span className="font-medium">Assistant</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Searching...
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Ask about players, reports, or request recommendations..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="text-sm"
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatOverlay;