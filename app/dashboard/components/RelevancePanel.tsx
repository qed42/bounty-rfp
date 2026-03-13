"use client";

import { useState } from "react";
import config from "@/data/config.json";

interface ScoreResult {
  score: number;
  why_relevant: string;
  breakdown?: Record<string, number>;
}

const DEFAULT_DESCRIPTION =
  "Check the relevancy as per the services provided by qed42";

export function RelevancePanel({ rfpId }: { rfpId: string }) {
  const [loading, setLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkRelevance() {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${config.baseUrl}/scoring/score`,
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
      setError("Unable to check relevance. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="mt-4 space-y-2 text-sm"
      onClick={(e) => e.stopPropagation()} // prevents card click
    >
      {/* Action button */}
      {!scoreResult && (
        <button
          onClick={checkRelevance}
          disabled={loading}
          className="rounded-md border px-3 py-1.5 text-xs font-medium cursor-pointer
                     hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Checking relevance..." : "Check Relevance"}
        </button>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Result */}
      {scoreResult && (
        <div className="rounded-md border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-3">
          <p className="font-medium">
            Relevance Score: {(scoreResult.score * 100).toFixed(0)}%
          </p>
          <p className="text-xs mt-1 text-muted-foreground">
            {scoreResult.why_relevant}
          </p>
        </div>
      )}
    </div>
  );
}
