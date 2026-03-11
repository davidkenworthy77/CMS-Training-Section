import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Database, Download, Upload, FileText, X, Plus, ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { MemoryModal } from "./MemoryModal";

interface Memory {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

interface MemoryFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

interface MemorySidebarProps {
  memories: Memory[];
  onSaveAllMemories: (text: string) => void;
  memoryFiles: MemoryFile[];
  onAddMemoryFiles: (files: FileList) => void;
  onRemoveMemoryFile: (id: string) => void;
  memoryDescription: string;
  onUpdateMemoryDescription: (value: string) => void;
}

export function MemorySidebar({
  memories,
  onSaveAllMemories,
  memoryFiles,
  onAddMemoryFiles,
  onRemoveMemoryFile,
  memoryDescription,
  onUpdateMemoryDescription,
}: MemorySidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    memory: true,
    files: true,
  });
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    onAddMemoryFiles(files);
    event.target.value = "";
  };

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
    <div className="h-full flex flex-col bg-muted/30">
      <MemoryModal
        open={memoryModalOpen}
        onClose={() => setMemoryModalOpen(false)}
        memories={memories}
        onSaveAll={onSaveAllMemories}
        memoryDescription={memoryDescription}
        onUpdateMemoryDescription={onUpdateMemoryDescription}
      />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {/* Memory Section */}
          <div className="rounded-lg border bg-background">
            <button
              className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors rounded-t-lg"
              onClick={() => toggleSection("memory")}
            >
              <div className="flex items-center gap-2">
                <Database className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Memory</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMemoryModalOpen(true);
                  }}
                >
                  <Pencil className="size-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  <Download className="size-3" />
                </Button>
                {expandedSections.memory ? (
                  <ChevronDown className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-4 text-muted-foreground" />
                )}
              </div>
            </button>
            {expandedSections.memory && (
              <div className="px-3 pb-3 space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {memoryDescription || "No description set. Click the pencil to add one."}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {memories.length} {memories.length === 1 ? "entry" : "entries"} stored
                </p>
              </div>
            )}
          </div>

          {/* Files Section */}
          <div className="rounded-lg border bg-background">
            <button
              className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              onClick={() => toggleSection("files")}
            >
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Files</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("memoryFileUpload")?.click();
                  }}
                >
                  <Plus className="size-3" />
                </Button>
                {expandedSections.files ? (
                  <ChevronDown className="size-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="size-4 text-muted-foreground" />
                )}
              </div>
            </button>
            <input
              type="file"
              id="memoryFileUpload"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.md,.csv"
            />
            {expandedSections.files && (
              <div className="px-3 pb-3 space-y-3">
                {memoryFiles.length === 0 ? (
                  <div
                    className="text-center py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => document.getElementById("memoryFileUpload")?.click()}
                  >
                    <Upload className="size-6 mx-auto mb-1.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Click to upload files
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {memoryFiles.map((file) => {
                        const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
                        return (
                          <div
                            key={file.id}
                            className="relative group rounded-lg border bg-muted/30 p-2 flex flex-col items-center gap-1.5 hover:shadow-sm transition-shadow"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-1 -right-1 size-5 bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onRemoveMemoryFile(file.id)}
                            >
                              <X className="size-2.5 text-destructive" />
                            </Button>
                            <div className="w-full aspect-[4/3] rounded bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border">
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0">
                                {ext}
                              </Badge>
                            </div>
                            <p className="text-[10px] font-medium text-center leading-tight line-clamp-2 w-full">
                              {file.name}
                            </p>
                          </div>
                        );
                      })}
                      <div
                        className="rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors min-h-[80px]"
                        onClick={() => document.getElementById("memoryFileUpload")?.click()}
                      >
                        <Plus className="size-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {memoryFiles.length} {memoryFiles.length === 1 ? "file" : "files"} · {
                        memoryFiles.reduce((acc, f) => acc + f.size, 0) > 1024 * 1024
                          ? (memoryFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(1) + " MB"
                          : (memoryFiles.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1) + " KB"
                      } total
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
