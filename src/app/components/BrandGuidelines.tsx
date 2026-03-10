import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RefreshCw, Upload, X, FileText, Download } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

interface BrandGuidelinesData {
  toneOfVoice: string;
  writingStyle: string;
  searchStrategy: string;
  brandVoiceDescription: string;
  targetAudience: string;
  uploadedFiles: UploadedFile[];
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

interface BrandGuidelinesProps {
  data: BrandGuidelinesData;
  onUpdate: (data: BrandGuidelinesData) => void;
  onClearCache: () => void;
  memories: Memory[];
  dos: Guardrail[];
  donts: Guardrail[];
  priorityRules: PriorityRule[];
}

export function BrandGuidelines({ data, onUpdate, onClearCache, memories, dos, donts, priorityRules }: BrandGuidelinesProps) {
  const [formData, setFormData] = useState<BrandGuidelinesData>(data);

  const handleChange = (field: keyof BrandGuidelinesData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
    }));

    const updated = {
      ...formData,
      uploadedFiles: [...formData.uploadedFiles, ...newFiles],
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const handleRemoveFile = (fileId: string) => {
    const updated = {
      ...formData,
      uploadedFiles: formData.uploadedFiles.filter((f) => f.id !== fileId),
    };
    setFormData(updated);
    onUpdate(updated);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBrand = () => {
    const content = [
      "# Brand Guidelines",
      "",
      `## Tone of Voice\n${formData.toneOfVoice}`,
      "",
      `## Writing Style\n${formData.writingStyle}`,
      "",
      `## Search Strategy\n${formData.searchStrategy}`,
      "",
      `## Brand Voice Description\n${formData.brandVoiceDescription}`,
      "",
      `## Target Audience\n${formData.targetAudience}`,
    ].join("\n");
    downloadFile("brand-guidelines.md", content);
  };

  const handleDownloadMemory = () => {
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
    downloadFile("memory.md", `# Memory\n\n${content}`);
  };

  const handleDownloadGuardrails = () => {
    const sections = [
      "# Guardrails",
      "",
      "## Priority Rules",
      ...priorityRules.map((r) => `- ${r.text}`),
      "",
      "## Do's",
      ...dos.map((d) => `- ${d.text}`),
      "",
      "## Don'ts",
      ...donts.map((d) => `- ${d.text}`),
    ].join("\n");
    downloadFile("guardrails.md", sections);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl mb-1">Brand Guidelines</h2>
          <p className="text-muted-foreground mb-4">
            Define your brand voice and communication rules
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCache}
            className="gap-2"
          >
            <RefreshCw className="size-4" />
            Clear Concierge Cache
          </Button>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm font-medium text-muted-foreground">Download Memory Files</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadBrand}>
              <Download className="size-3" />
              Brand
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadMemory}>
              <Download className="size-3" />
              Memory
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadGuardrails}>
              <Download className="size-3" />
              Guardrails
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                1
              </div>
              <CardTitle className="text-base">Tone of Voice</CardTitle>
            </div>
            <CardDescription className="text-sm">
              The overall emotional quality of how the Concierge communicates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={formData.toneOfVoice}
              onValueChange={(value) => handleChange("toneOfVoice", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                2
              </div>
              <CardTitle className="text-base">Writing Style</CardTitle>
            </div>
            <CardDescription className="text-sm">
              The structure and format of how responses are written.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={formData.writingStyle}
              onValueChange={(value) => handleChange("writingStyle", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="storytelling">Storytelling</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                3
              </div>
              <CardTitle className="text-base">Search Strategy</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Controls whether the Concierge supplements internal content with web
              search results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={formData.searchStrategy}
              onValueChange={(value) => handleChange("searchStrategy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smart">Smart</SelectItem>
                <SelectItem value="internal-only">Internal Only</SelectItem>
                <SelectItem value="web-boosted">Web Boosted</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Smart</span> — AI decides per query
                (recommended).
              </p>
              <p>
                <span className="font-medium">Internal Only</span> — indexed
                content only.
              </p>
              <p>
                <span className="font-medium">Web Boosted</span> — always includes
                web search.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                4
              </div>
              <CardTitle className="text-base">Brand Voice Description</CardTitle>
            </div>
            <CardDescription className="text-sm">
              A detailed description of how your brand should sound and communicate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.brandVoiceDescription}
              onChange={(e) =>
                handleChange("brandVoiceDescription", e.target.value)
              }
              placeholder="e.g., We are the voice of Southwest Florida's island coast. We speak with warmth and local expertise, helping visitors discover the natural beauty, diverse experiences of Fort Myers, Sanibel, Captiva, and the surrounding islands."
              rows={8}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                5
              </div>
              <CardTitle className="text-base">Target Audience</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Describe the primary audience the Concierge will be speaking with.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.targetAudience}
              onChange={(e) => handleChange("targetAudience", e.target.value)}
              placeholder="e.g., Families, couples, and active travelers looking for Gulf Coast beach vacations with authentic Florida experiences"
              rows={8}
              className="resize-none"
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-medium">
                6
              </div>
              <CardTitle className="text-base">Upload Brand Files</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Upload brand guidelines, strategic vision documents, and reference materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("fileUpload")?.click()}
                className="gap-2"
              >
                <Upload className="size-4" />
                Upload Files
              </Button>
              <input
                type="file"
                id="fileUpload"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.md"
              />
              <span className="text-xs text-muted-foreground">
                PDF, DOC, DOCX, TXT, MD
              </span>
            </div>

            {formData.uploadedFiles.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <FileText className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No files uploaded yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-background group hover:shadow-sm transition-shadow"
                  >
                    <FileText className="size-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.uploadedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <X className="size-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}