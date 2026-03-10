import { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Send } from "lucide-react";
import { ChatMessage } from "./ChatMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  savedToMemory?: boolean;
  memoryType?: string;
}

interface TrainingChatProps {
  onSaveToMemory: (messageId: string, content: string, type: string) => void;
}

export function TrainingChat({ onSaveToMemory }: TrainingChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm here to help you train your website. Share information about your brand tone, guidelines, products, or any knowledge I should remember. Select the memory type below and your messages will be committed automatically.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [memoryType, setMemoryType] = useState("general");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: input,
      timestamp: new Date(),
      savedToMemory: true,
      memoryType,
    };

    setMessages((prev) => [...prev, userMessage]);
    onSaveToMemory(messageId, input, memoryType);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Got it! I've committed that to ${memoryType} memory. Feel free to share more information you'd like me to remember.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput("");
  };

  const handleSaveMessage = (messageId: string, type: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, savedToMemory: true, memoryType: type }
            : m
        )
      );
      onSaveToMemory(messageId, message.content, type);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              {...message}
              onSaveToMemory={handleSaveMessage}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Select value={memoryType} onValueChange={setMemoryType}>
            <SelectTrigger className="w-[140px] shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="concierge">Concierge</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Type your training message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}