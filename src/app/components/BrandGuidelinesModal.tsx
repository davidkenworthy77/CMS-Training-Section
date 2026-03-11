import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Sparkles, Download } from "lucide-react";

interface BrandGuidelinesData {
  toneOfVoice: string;
  writingStyle: string;
  searchStrategy: string;
  brandVoiceDescription: string;
  targetAudience: string;
}

interface Memory {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
}

interface Guardrail {
  id: string;
  text: string;
  type: "do" | "dont";
}

interface PriorityRule {
  id: string;
  text: string;
}

interface BrandGuidelinesModalProps {
  open: boolean;
  onClose: () => void;
  brand: BrandGuidelinesData;
  memories: Memory[];
  dos: Guardrail[];
  donts: Guardrail[];
  priorityRules: PriorityRule[];
}

function buildFullGuidelines(
  brand: BrandGuidelinesData,
  memories: Memory[],
  dos: Guardrail[],
  donts: Guardrail[],
  priorityRules: PriorityRule[]
): string {
  const sections: string[] = [];

  sections.push("# Brand Guidelines\n");
  sections.push(`## Tone of Voice\n${brand.toneOfVoice}\n`);
  sections.push(`## Writing Style\n${brand.writingStyle}\n`);
  sections.push(`## Search Strategy\n${brand.searchStrategy}\n`);
  sections.push(`## Brand Voice Description\n${brand.brandVoiceDescription}\n`);
  sections.push(`## Target Audience\n${brand.targetAudience}\n`);

  if (memories.length > 0) {
    sections.push("\n# Memory\n");
    const grouped: Record<string, Memory[]> = {};
    memories.forEach((m) => {
      if (!grouped[m.type]) grouped[m.type] = [];
      grouped[m.type].push(m);
    });
    Object.entries(grouped).forEach(([type, items]) => {
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      sections.push(`## ${label}\n`);
      items.forEach((m) => sections.push(`- ${m.content}`));
      sections.push("");
    });
  }

  if (priorityRules.length > 0 || dos.length > 0 || donts.length > 0) {
    sections.push("\n# Guardrails\n");
    if (priorityRules.length > 0) {
      sections.push("## Priority Rules");
      priorityRules.forEach((r) => sections.push(`- ${r.text}`));
      sections.push("");
    }
    if (dos.length > 0) {
      sections.push("## Do's");
      dos.forEach((d) => sections.push(`- ${d.text}`));
      sections.push("");
    }
    if (donts.length > 0) {
      sections.push("## Don'ts");
      donts.forEach((d) => sections.push(`- ${d.text}`));
      sections.push("");
    }
  }

  return sections.join("\n");
}

export function BrandGuidelinesModal({
  open,
  onClose,
  brand,
  memories,
  dos,
  donts,
  priorityRules,
}: BrandGuidelinesModalProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setText(buildFullGuidelines(brand, memories, dos, donts, priorityRules));
    }
  }, [open, brand, memories, dos, donts, priorityRules]);

  if (!open) return null;

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "full-brand-guidelines.md";
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
              <Sparkles className="size-5" />
              Full Brand Guidelines
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Complete view of brand, memory, and guardrails combined.
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
            readOnly
            className="w-full h-full min-h-[300px] max-h-[50vh] rounded-lg border bg-muted/30 p-4 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-4 border-t">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
            <Download className="size-3" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
