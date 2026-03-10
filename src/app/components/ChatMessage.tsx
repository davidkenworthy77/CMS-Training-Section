import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Bot, User, Save, Check } from "lucide-react";

interface ChatMessageProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  savedToMemory?: boolean;
  memoryType?: string;
  onSaveToMemory: (id: string, type: string) => void;
}

export function ChatMessage({
  id,
  role,
  content,
  timestamp,
  savedToMemory,
  memoryType,
  onSaveToMemory,
}: ChatMessageProps) {
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [selectedType, setSelectedType] = useState("general");

  const handleSave = () => {
    onSaveToMemory(id, selectedType);
    setShowSaveOptions(false);
  };

  return (
    <div
      className={`flex gap-3 ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {role === "assistant" && (
        <div className="size-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Bot className="size-5 text-primary-foreground" />
        </div>
      )}
      <div className="flex flex-col gap-2 max-w-[80%]">
        <div
          className={`rounded-lg p-3 ${
            role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="text-sm">{content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        {role === "user" && !savedToMemory && !showSaveOptions && (
          <Button
            variant="ghost"
            size="sm"
            className="self-end gap-2"
            onClick={() => setShowSaveOptions(true)}
          >
            <Save className="size-3" />
            Save to Memory
          </Button>
        )}

        {role === "user" && showSaveOptions && (
          <div className="flex gap-2 self-end">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="concierge">Concierge</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleSave}>
              Commit
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSaveOptions(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        {role === "user" && savedToMemory && (
          <div className="flex items-center gap-2 self-end">
            <Check className="size-3 text-green-600" />
            <span className="text-xs text-muted-foreground">
              Saved to {memoryType} memory
            </span>
          </div>
        )}
      </div>
      {role === "user" && (
        <div className="size-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <User className="size-5" />
        </div>
      )}
    </div>
  );
}