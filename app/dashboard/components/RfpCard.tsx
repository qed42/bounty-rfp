"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RelevancePanel } from "./RelevancePanel";

/* ---------------- Types ---------------- */

interface RfpCardProps {
  rfp: Record<string, unknown>;
}

/* ---------------- Helpers ---------------- */

function getString(
  obj: Record<string, unknown>,
  key: string
): string | null {
  const value = obj[key];
  return typeof value === "string" ? value : null;
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

/* ---------------- Component ---------------- */

export function RfpCardCardView({ rfp }: RfpCardProps) {
  const title = getString(rfp, "title") ?? "Untitled RFP";
  const description = getString(rfp, "description");
  const portalName = getString(rfp, "portal_name");
  const rfpType = getString(rfp, "rfp_type");
  const location = getString(rfp, "location");
  const portalUrl = getString(rfp, "url") ?? "#";
  const rfpId = getString(rfp, "_id");

  return (
    <Link
      href={portalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <div
        className="
          h-full rounded-xl border bg-white dark:bg-neutral-950 p-5
          hover:shadow-lg transition cursor-pointer
          hover:border-blue-600 dark:hover:border-blue-500
        "
      >
        {/* ---------------- Header ---------------- */}
        <h3 className="text-lg font-semibold leading-snug">
          {title}
        </h3>

        {/* ---------------- Badges ---------------- */}
        <div className="mt-2 flex flex-wrap gap-2">
          {portalName && (
            <Badge variant="secondary">
              {portalName}
            </Badge>
          )}

          {rfpType && (
            <Badge variant="outline">
              {rfpType}
            </Badge>
          )}

          {location && (
            <Badge variant="outline">
              {location}
            </Badge>
          )}
        </div>

        {/* ---------------- Description ---------------- */}
        {description && (
          <p className="mt-4 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* ---------------- Details ---------------- */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
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
        {rfpId && (
          <RelevancePanel rfpId={rfpId} />
        )}
      </div>
    </Link>
  );
}
