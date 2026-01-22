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

