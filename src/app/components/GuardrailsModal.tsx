import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Shield, Download } from "lucide-react";

interface Guardrail {
  id: string;
  text: string;
  type: "do" | "dont";
}

interface PriorityRule {
  id: string;
  text: string;
}

interface GuardrailsModalProps {
  open: boolean;
  onClose: () => void;
  dos: Guardrail[];
  donts: Guardrail[];
  priorityRules: PriorityRule[];
}

function buildGuardrailsText(
  dos: Guardrail[],
  donts: Guardrail[],
  priorityRules: PriorityRule[]
): string {
  const sections: string[] = [];

  sections.push("# Guardrails\n");

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

  return sections.join("\n");
}

export function GuardrailsModal({
  open,
  onClose,
  dos,
  donts,
  priorityRules,
}: GuardrailsModalProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setText(buildGuardrailsText(dos, donts, priorityRules));
    }
  }, [open, dos, donts, priorityRules]);

  if (!open) return null;

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guardrails.md";
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
              <Shield className="size-5" />
              Guardrails
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Priority rules, do's, and don'ts for your website's behavior.
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
