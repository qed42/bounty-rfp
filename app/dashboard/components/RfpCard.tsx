import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function RfpCard({ rfp }: { rfp: any }) {
  const [showForm, setShowForm] = useState(false);
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<any>(null);

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

      const data = await res.json();
      setScoreResult(data);
      setShowForm(false);
    } catch (err) {
      console.error("Scoring failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-full flex-col bg-card text-card-foreground border border-border hover:shadow-md transition-shadow">
      {/* ---------- Header ---------- */}
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-semibold break-words">
          {cleanTitle}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Source: {rfp.portal_name}
        </p>
      </CardHeader>

      {/* ---------- Content ---------- */}
      <CardContent className="flex-1 space-y-3 text-sm">
        <p className="text-muted-foreground line-clamp-3">
          {rfp.description ?? "No description provided"}
        </p>

        {/* Score Result */}
        {scoreResult && (
          <div className="rounded-md border border-border bg-muted p-3">
            <p className="font-medium">
              Relevance Score: {(scoreResult.score * 100).toFixed(0)}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {scoreResult.reasoning}
            </p>
          </div>
        )}

        {/* Input Form */}
        {showForm && (
          <div className="space-y-2">
            <textarea
              className="w-full rounded-md border border-border bg-background p-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              rows={3}
              placeholder="Describe your requirements..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={checkRelevance}
                disabled={loading || !requirements}
              >
                {loading ? "Scoring..." : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* ---------- Footer ---------- */}
      {!scoreResult && !showForm && (
        <CardFooter className="flex justify-end border-t border-border pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            Check Relevance
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
