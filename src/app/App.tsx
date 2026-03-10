import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { GuardrailsSection } from "./components/GuardrailsSection";
import { TrainingChat } from "./components/TrainingChat";
import { MemorySidebar } from "./components/MemorySidebar";
import { BrandGuidelines } from "./components/BrandGuidelines";
import { Brain, Shield, MessageSquare, Sparkles, Download } from "lucide-react";
import { Button } from "./components/ui/button";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";

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

interface BrandGuidelinesData {
  toneOfVoice: string;
  writingStyle: string;
  searchStrategy: string;
  brandVoiceDescription: string;
  targetAudience: string;
  uploadedFiles: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
}

export default function App() {
  const [brandGuidelines, setBrandGuidelines] = useState<BrandGuidelinesData>({
    toneOfVoice: "friendly",
    writingStyle: "conversational",
    searchStrategy: "smart",
    brandVoiceDescription:
      "We are the voice of Southwest Florida's island coast. We speak with warmth and local expertise, helping visitors discover the natural beauty, diverse experiences of Fort Myers, Sanibel, Captiva, and the surrounding islands.",
    targetAudience:
      "Families, couples, and active travelers looking for Gulf Coast beach vacations with authentic Florida experiences",
    uploadedFiles: [],
  });

  const [memories, setMemories] = useState<Memory[]>([
    {
      id: "1",
      content:
        "Always greet customers warmly, respond within 24 hours, and offer solutions rather than just acknowledging problems.",
      type: "concierge",
      createdAt: new Date("2024-03-05"),
    },
    {
      id: "2",
      content:
        "Our flagship product is an AI-powered CMS that helps businesses manage content efficiently. Key features include smart categorization, automated workflows, and multi-channel publishing.",
      type: "general",
      createdAt: new Date("2024-03-08"),
    },
  ]);

  const [dos, setDos] = useState<Guardrail[]>([
    {
      id: "1",
      text: "Always maintain a friendly and professional tone",
      type: "do",
    },
    {
      id: "2",
      text: "Provide accurate product information",
      type: "do",
    },
    {
      id: "3",
      text: "Reference brand guidelines when responding",
      type: "do",
    },
  ]);

  const [donts, setDonts] = useState<Guardrail[]>([
    {
      id: "1",
      text: "Never make promises about features not yet released",
      type: "dont",
    },
    {
      id: "2",
      text: "Avoid technical jargon without explanation",
      type: "dont",
    },
    {
      id: "3",
      text: "Don't share confidential company information",
      type: "dont",
    },
  ]);

  const [activeTab, setActiveTab] = useState("brand");

  const [priorityRules, setPriorityRules] = useState<PriorityRule[]>([
    {
      id: "1",
      text: "Include Sanibel, Captiva, and surrounding areas in the broader Fort Myers identity",
    },
    {
      id: "2",
      text: "Respect wildlife and nature — encourage responsible tourism",
    },
  ]);

  const handleSaveToMemory = (
    messageId: string,
    content: string,
    type: string
  ) => {
    const newMemory: Memory = {
      id: messageId,
      content,
      type,
      createdAt: new Date(),
    };
    setMemories((prev) => [newMemory, ...prev]);
    toast.success(`Saved to ${type} memory`, {
      description: "Memory has been added to your knowledge base",
    });
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    toast.success("Memory deleted");
  };

  const handleUpdateBrandGuidelines = (data: BrandGuidelinesData) => {
    setBrandGuidelines(data);
  };

  const handleClearCache = () => {
    toast.success("Concierge cache cleared", {
      description: "The cache has been reset successfully",
    });
  };

  const handleAddDo = (text: string) => {
    setDos((prev) => [
      ...prev,
      { id: Date.now().toString(), text, type: "do" },
    ]);
    toast.success("Do added");
  };

  const handleAddDont = (text: string) => {
    setDonts((prev) => [
      ...prev,
      { id: Date.now().toString(), text, type: "dont" },
    ]);
    toast.success("Don't added");
  };

  const handleRemoveDo = (id: string) => {
    setDos((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRemoveDont = (id: string) => {
    setDonts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddPriorityRule = (text: string) => {
    setPriorityRules((prev) => [
      ...prev,
      { id: Date.now().toString(), text },
    ]);
    toast.success("Priority rule added");
  };

  const handleRemovePriorityRule = (id: string) => {
    setPriorityRules((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster />
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="size-8 text-primary" />
            <h1 className="text-3xl">Website Training Center</h1>
          </div>
          <p className="text-muted-foreground">
            Train your website with brand guidelines, knowledge, and behavioral
            rules
          </p>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col min-h-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-6">
            <TabsTrigger value="brand" className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Brand Guidelines
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <MessageSquare className="size-4" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="guardrails" className="flex items-center gap-2">
              <Shield className="size-4" />
              Guardrails
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brand" className="flex-1 mt-0">
            <BrandGuidelines
              data={brandGuidelines}
              onUpdate={handleUpdateBrandGuidelines}
              onClearCache={handleClearCache}
              memories={memories}
              dos={dos}
              donts={donts}
              priorityRules={priorityRules}
            />
          </TabsContent>

          <TabsContent
            value="training"
            className="flex-1 flex gap-6 min-h-0 mt-0"
          >
            <div className="flex-1 min-w-0">
              <TrainingChat onSaveToMemory={handleSaveToMemory} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-full rounded-lg border overflow-hidden">
                <MemorySidebar
                  memories={memories}
                  onDeleteMemory={handleDeleteMemory}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="guardrails" className="flex-1 mt-0">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl mb-2">Behavioral Guidelines</h2>
                <p className="text-muted-foreground">
                  Define clear do's and don'ts to guide your website's behavior
                  and responses
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
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
                  const blob = new Blob([sections], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "guardrails.md";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="size-3" />
                Download Guardrails
              </Button>
            </div>
            <GuardrailsSection
              priorityRules={priorityRules}
              dos={dos}
              donts={donts}
              onAddPriorityRule={handleAddPriorityRule}
              onRemovePriorityRule={handleRemovePriorityRule}
              onAddDo={handleAddDo}
              onAddDont={handleAddDont}
              onRemoveDo={handleRemoveDo}
              onRemoveDont={handleRemoveDont}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}