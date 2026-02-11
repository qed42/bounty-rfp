"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RelevancePanel } from "./RelevancePanel";
import { getString, getStringArray, renderValue } from "@/lib/rfpHelpers";


/* ---------------- Types ---------------- */

interface RfpCardProps {
  rfp: Record<string, unknown>;
}

/* ---------------- Component ---------------- */

export function RfpCardCardView({ rfp }: RfpCardProps) {
  const title = getString(rfp, "title") ?? "Untitled RFP";
  const description = getString(rfp, "description");
  const portalUrl = getString(rfp, "url") ?? "#";
  const rfpId = getString(rfp, "_id");
  
  // score
  const score =
  typeof rfp.score === "number" ? rfp.score : null;
  const scoreBreakdown =
    rfp.score_breakdown as
      | {
          keyword_matches?: number;
          budget_present?: number;
          deadline_present?: number;
          matched_keywords_count?: number;
          matched_keywords_list?: string[];
        }
      | undefined;



  // Metadata
  const portalName = getString(rfp, "portal_name");
  const rfpType = getString(rfp, "rfp_type");
  const location = getString(rfp, "location");

  // Tags
  const tags = getStringArray(rfp, "tags");

  return (
    <div>
      <div
        className="
          h-full rounded-xl border bg-white dark:bg-neutral-950 p-5
          hover:shadow-lg transition 
          hover:border-blue-600 dark:hover:border-blue-500
        "
      >
        {/* ---------------- Title ---------------- */}
        <Link
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer"
        >
          <h3 className="text-lg font-semibold leading-snug">
            {title}
          </h3>
        </Link>

        {/* ---------------- Tags (BADGES) ---------------- */}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.slice(0, 6).map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* ---------------- Description ---------------- */}
        {description && (
          <p className="mt-4 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* ---------------- Score Breakdown ---------------- */}
        {scoreBreakdown && (
          <div className="py-4 border-t border-b text-sm text-muted-foreground flex flex-wrap w-full items-center gap-4 mt-4">
            {/* ---------------- Score ---------------- */}
            {score !== null && (
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-blue-600 border-blue-600"
                >
                  Score: {(score * 100).toFixed(0)}%
                </Badge>
              </div>
            )}
            {scoreBreakdown.keyword_matches !== undefined && (
              <div>
                <strong>Keyword Match:</strong>{" "}
                {(scoreBreakdown.keyword_matches * 100).toFixed(0)}%
              </div>
            )}

            {scoreBreakdown.budget_present !== undefined && (
              <div>
                <strong>Budget Signal:</strong>{" "}
                {(scoreBreakdown.budget_present * 100).toFixed(0)}%
              </div>
            )}

            {scoreBreakdown.deadline_present !== undefined && (
              <div>
                <strong>Deadline Signal:</strong>{" "}
                {(scoreBreakdown.deadline_present * 100).toFixed(0)}%
              </div>
            )}

            {scoreBreakdown.matched_keywords_list &&
              scoreBreakdown.matched_keywords_list.length > 0 && (
                <div className="flex items-center gap-2">
                  <strong>Matched Keywords:</strong>
                  <div className="flex flex-wrap gap-1">
                    {scoreBreakdown.matched_keywords_list.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}


        {/* ---------------- Metadata ---------------- */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">

          {portalName && (
            <div>
              <strong>Portal:</strong> {portalName}
            </div>
          )}
          {rfpType && (
            <div>
              <strong>RFP Type:</strong> {rfpType}
            </div>
          )}
          {location && (
            <div>
              <strong>Location:</strong> {location}
            </div>
          )}
          <div>
            <strong>Organization:</strong>{" "}
            {renderValue(rfp.organization)}
          </div>
          <div>
            <strong>Reference:</strong>{" "}
            {renderValue(rfp.reference)}
          </div>
          <div>
            <strong>Published:</strong>{" "}
            {renderValue(rfp.published_date)}
          </div>
          <div>
            <strong>Deadline:</strong>{" "}
            {renderValue(rfp.deadline)}
          </div>
        </div>

        {/* ---------------- Relevance ---------------- */}
        {rfpId && <RelevancePanel rfpId={rfpId} />}
      </div>
    </div>
  );
}

