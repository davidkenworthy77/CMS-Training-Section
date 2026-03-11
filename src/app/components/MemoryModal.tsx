import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { X, Database, Download } from "lucide-react";

interface Memory {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

interface MemoryModalProps {
  open: boolean;
  onClose: () => void;
  memories: Memory[];
  onSaveAll: (updatedText: string) => void;
  memoryDescription: string;
  onUpdateMemoryDescription: (value: string) => void;
}

export function MemoryModal({
  open,
  onClose,
  memories,
  onSaveAll,
  memoryDescription,
  onUpdateMemoryDescription,
}: MemoryModalProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      // Build the text representation of all memories
      const lines = memories.map((m) => {
        const label = m.type.charAt(0).toUpperCase() + m.type.slice(1);
        return `[${label}] ${m.content}`;
      });
      setText(lines.join("\n\n"));
    }
  }, [open, memories]);

  if (!open) return null;

  const handleSave = () => {
    onSaveAll(text);
    onClose();
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "memory.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-xl shadow-2xl border w-full max-w-2xl max-h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Database className="size-5" />
              Manage Memory
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Edit your memory directly. Each entry is prefixed with its type in brackets.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-8 shrink-0"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full min-h-[300px] max-h-[50vh] rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="No memories yet..."
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
            <Download className="size-3" />
            Download
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
