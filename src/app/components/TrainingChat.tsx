import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, Trash2, Clock, Pencil, Check, X, Search } from "lucide-react";

interface Memory {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

interface TrainingChatProps {
  onSaveToMemory: (messageId: string, content: string, type: string) => void;
  memories: Memory[];
  onDeleteMemory: (id: string) => void;
  onEditMemory: (id: string, content: string) => void;
}

const typeColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  concierge: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  brand: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
};

export function TrainingChat({ onSaveToMemory, memories, onDeleteMemory, onEditMemory }: TrainingChatProps) {
  const [input, setInput] = useState("");
  const [memoryType, setMemoryType] = useState("general");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    const id = Date.now().toString();
    onSaveToMemory(id, input.trim(), memoryType);
    setInput("");
  };

  const startEdit = (memory: Memory) => {
    setEditingId(memory.id);
    setEditContent(memory.content);
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      onEditMemory(editingId, editContent.trim());
      setEditingId(null);
      setEditContent("");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const filteredMemories = memories.filter((memory) => {
    const matchesType = filterType === "all" || memory.type === filterType;
    const matchesSearch = !searchQuery || memory.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Add Memory Input */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Add Memory</h3>
          <Select value={memoryType} onValueChange={setMemoryType}>
            <SelectTrigger className="w-[140px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="concierge">Concierge</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Textarea
          placeholder="Add knowledge, facts, or instructions for your website to remember..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
          rows={3}
          className="resize-none text-sm"
        />
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleAdd} size="sm" className="gap-2" disabled={!input.trim()}>
            <Plus className="size-3" />
            Add to Memory
          </Button>
        </div>
      </Card>

      {/* Memory Entries List */}
      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Recent Entries
          </h3>
          <Badge variant="secondary">{filteredMemories.length}</Badge>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              className="pl-8 h-8 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="concierge">Concierge</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="space-y-2 pr-2">
            {filteredMemories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">
                  {searchQuery || filterType !== "all"
                    ? "No matching memories"
                    : "No memories yet"}
                </p>
                <p className="text-xs mt-1">
                  {searchQuery || filterType !== "all"
                    ? "Try adjusting your filters"
                    : "Add your first memory above"}
                </p>
              </div>
            ) : (
              filteredMemories.map((memory) => (
                <Card
                  key={memory.id}
                  className="p-3 space-y-2 group hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${typeColors[memory.type] || ""}`}
                    >
                      {memory.type}
                    </Badge>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === memory.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            onClick={saveEdit}
                          >
                            <Check className="size-3 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            onClick={cancelEdit}
                          >
                            <X className="size-3 text-muted-foreground" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            onClick={() => startEdit(memory)}
                          >
                            <Pencil className="size-3 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            onClick={() => onDeleteMemory(memory.id)}
                          >
                            <Trash2 className="size-3 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {editingId === memory.id ? (
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="resize-none text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          saveEdit();
                        }
                        if (e.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{memory.content}</p>
                  )}
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-2.5" />
                    {memory.createdAt.toLocaleDateString()}
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
