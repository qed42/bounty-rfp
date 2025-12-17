import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ---------- Types (same file) ---------- */

interface Rfp {
  _id: string;
  title: string;
  portal_name: string;
  description?: string | null;
  url?: string;
  score?: number | null;
  enriched?: boolean;
}

interface ScoreResult {
  score: number;
  reasoning: string;
  breakdown?: Record<string, number>;
}

/* ---------- Component ---------- */

export function RfpCard({ rfp }: { rfp: Rfp }) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [requirements, setRequirements] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  const cleanTitle = rfp.title.split("\n")[0];

  async function checkRelevance() {
    try {
      setLoading(true);

      const res = await fetch(
        "http://65.2.128.237:8000/api/v1/scoring/score",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rfp_id: rfp._id,
            user_requirements: requirements,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Scoring failed");
      }

      const data: ScoreResult = await res.json();
      setScoreResult(data);
      setShowForm(false);
    } catch (err) {
      console.error("Scoring failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-all">
      {/* ---------- Header ---------- */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold whitespace-normal break-words">
          {cleanTitle}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Source: {rfp.portal_name}
        </p>
      </CardHeader>

      {/* ---------- Content ---------- */}
      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {rfp.description ?? "No description provided"}
        </p>

        {/* ---------- Score Result ---------- */}
        {scoreResult && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm">
            <p className="font-medium">
              Relevance Score: {(scoreResult.score * 100).toFixed(0)}%
            </p>
            <p className="text-xs mt-1 text-gray-700 dark:text-gray-300">
              {scoreResult.reasoning}
            </p>
          </div>
        )}

        {/* ---------- Input Form ---------- */}
        {showForm && (
          <div className="space-y-2">
            <textarea
              className="w-full rounded-md border p-2 text-sm bg-background"
              rows={3}
              placeholder="Describe your requirements..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />

            <Button
              size="sm"
              onClick={checkRelevance}
              disabled={loading || !requirements}
            >
              {loading ? "Scoring..." : "Submit"}
            </Button>
          </div>
        )}
      </CardContent>

      {/* ---------- Footer Button ---------- */}
      {!scoreResult && !showForm && (
        <div className="p-4 pt-0 flex justify-end">
          <Button
            variant="outline"
            className="w-auto"
            onClick={() => setShowForm(true)}
          >
            Check Relevance
          </Button>
        </div>
      )}
    </Card>
  );
}
