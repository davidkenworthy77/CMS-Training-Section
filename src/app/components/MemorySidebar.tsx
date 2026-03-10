import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Trash2, Database, Download } from "lucide-react";

interface Memory {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

interface MemorySidebarProps {
  memories: Memory[];
  onDeleteMemory: (id: string) => void;
}

const typeColors: Record<string, string> = {
  general: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  concierge: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  brand: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  technical: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  content: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
};

export function MemorySidebar({ memories, onDeleteMemory }: MemorySidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredMemories = memories.filter((memory) => {
    const matchesSearch = memory.content
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || memory.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDownload = () => {
    const grouped: Record<string, typeof memories> = {};
    memories.forEach((m) => {
      if (!grouped[m.type]) grouped[m.type] = [];
      grouped[m.type].push(m);
    });
    const sections = Object.entries(grouped).map(([type, items]) => {
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      return `## ${label}\n\n${items.map((m) => `- ${m.content}`).join("\n\n")}`;
    });
    const content = sections.length > 0 ? sections.join("\n\n") : "No memories yet.";
    const blob = new Blob([`# Memory\n\n${content}`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "memory.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-muted/30 border-l">
      <div className="p-4 border-b space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Database className="size-4" />
          Memory Bank
          <Badge variant="secondary" className="ml-auto">
            {memories.length}
          </Badge>
        </h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-7 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="concierge">Concierge</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs"
          onClick={handleDownload}
        >
          <Download className="size-3" />
          Memory
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-8">
              <Database className="size-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {searchQuery || filterType !== "all"
                  ? "No matching memories"
                  : "No memories yet"}
              </p>
            </div>
          ) : (
            filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="p-3 rounded-lg bg-background border space-y-2 group hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className={typeColors[memory.type] || ""}
                  >
                    {memory.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6"
                    onClick={() => onDeleteMemory(memory.id)}
                  >
                    <Trash2 className="size-3 text-destructive" />
                  </Button>
                </div>
                <p className="text-sm line-clamp-4">{memory.content}</p>
                <span className="text-xs text-muted-foreground block">
                  {memory.createdAt.toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}