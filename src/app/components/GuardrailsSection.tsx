import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Plus, X, CheckCircle, XCircle, Star, Trash2 } from "lucide-react";

interface Guardrail {
  id: string;
  text: string;
  type: "do" | "dont";
}

interface PriorityRule {
  id: string;
  text: string;
}

interface GuardrailsSectionProps {
  priorityRules: PriorityRule[];
  dos: Guardrail[];
  donts: Guardrail[];
  onAddPriorityRule: (text: string) => void;
  onRemovePriorityRule: (id: string) => void;
  onAddDo: (text: string) => void;
  onAddDont: (text: string) => void;
  onRemoveDo: (id: string) => void;
  onRemoveDont: (id: string) => void;
}

export function GuardrailsSection({
  priorityRules,
  dos,
  donts,
  onAddPriorityRule,
  onRemovePriorityRule,
  onAddDo,
  onAddDont,
  onRemoveDo,
  onRemoveDont,
}: GuardrailsSectionProps) {
  const [priorityInput, setPriorityInput] = useState("");
  const [doInput, setDoInput] = useState("");
  const [dontInput, setDontInput] = useState("");

  const handleAddPriorityRule = () => {
    if (priorityInput.trim()) {
      onAddPriorityRule(priorityInput.trim());
      setPriorityInput("");
    }
  };

  const handleAddDo = () => {
    if (doInput.trim()) {
      onAddDo(doInput.trim());
      setDoInput("");
    }
  };

  const handleAddDont = () => {
    if (dontInput.trim()) {
      onAddDont(dontInput.trim());
      setDontInput("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Priority Rules Section */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Star className="size-4 fill-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Priority Rules</CardTitle>
              <CardDescription className="text-sm mt-1">
                Critical guardrails the Concierge <span className="font-semibold">must always</span> follow. These instructions take priority over everything else.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {priorityRules.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 group hover:shadow-sm transition-shadow"
              >
                <Star className="size-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="flex-1 text-sm">{item.text}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemovePriorityRule(item.id)}
                >
                  <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Never recommend competitor businesses"
              value={priorityInput}
              onChange={(e) => setPriorityInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddPriorityRule()}
              className="flex-1"
            />
            <Button onClick={handleAddPriorityRule} className="gap-2">
              <Plus className="size-4" />
              Add Rule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices and Topics to Avoid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                <CheckCircle className="size-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Best Practices</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Guidelines the Concierge should follow when crafting responses.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {dos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 group hover:shadow-sm transition-shadow"
                >
                  <CheckCircle className="size-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="flex-1 text-sm">{item.text}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveDo(item.id)}
                  >
                    <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a guideline..."
                value={doInput}
                onChange={(e) => setDoInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddDo()}
                className="flex-1"
              />
              <Button onClick={handleAddDo} variant="outline" className="gap-2">
                <Plus className="size-4" />
                Add Guideline
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-red-600 text-white flex items-center justify-center">
                <XCircle className="size-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Topics to Avoid</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Subjects and talking points the Concierge should steer clear of.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {donts.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 group hover:shadow-sm transition-shadow"
                >
                  <XCircle className="size-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="flex-1 text-sm">{item.text}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemoveDont(item.id)}
                  >
                    <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a restriction..."
                value={dontInput}
                onChange={(e) => setDontInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddDont()}
                className="flex-1"
              />
              <Button onClick={handleAddDont} variant="outline" className="gap-2">
                <Plus className="size-4" />
                Add Restriction
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}