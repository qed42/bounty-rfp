"use client";

import { useEffect, useState } from "react";

interface ScoreResult {
  score: number;
  reasoning: string;
  breakdown?: Record<string, number>;
}

const DEFAULT_DESCRIPTION =
  "Check the relevancy as per the services provided by qed42";

export function RelevancePanel({ rfpId }: { rfpId: string }) {
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  useEffect(() => {
    async function checkRelevance() {
      try {
        setLoading(true);

        const res = await fetch(
          "http://65.2.128.237:8000/api/v1/scoring/score",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rfp_id: rfpId,
              user_requirements: DEFAULT_DESCRIPTION,
            }),
          }
        );

        if (!res.ok) throw new Error("Scoring failed");

        const data: ScoreResult = await res.json();
        setScoreResult(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    checkRelevance();
  }, [rfpId]);

  return (
    <div
      className="mt-4 space-y-2 text-sm"
      onClick={(e) => e.stopPropagation()} // prevents card click
    >
      {/* Static description */}
      <p className="text-muted-foreground">
        {DEFAULT_DESCRIPTION}
      </p>

      {/* Loading state */}
      {loading && (
        <p className="text-xs text-muted-foreground">
          Checking relevance...
        </p>
      )}

      {/* Result */}
      {scoreResult && (
        <div className="rounded-md border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-3">
          <p className="font-medium">
            Relevance Score: {(scoreResult.score * 100).toFixed(0)}%
          </p>
          <p className="text-xs mt-1 text-muted-foreground">
            {scoreResult.reasoning}
          </p>
        </div>
      )}
    </div>
  );
}
