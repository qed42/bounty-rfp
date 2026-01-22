"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RelevancePanel } from "./RelevancePanel";
import {
  getString,
  getStringArray,
  renderValue,
} from "@/lib/rfpHelpers";


interface RfpListItemProps {
  rfp: Record<string, unknown>;
}

interface RfpListItemProps {
  rfp: Record<string, unknown>;
}

export function RfpListItem({ rfp }: RfpListItemProps) {
  const portalUrl = getString(rfp, "url")?.trim() || "#";

  // Core
  const title = getString(rfp, "title") ?? "Untitled RFP";
  const description = getString(rfp, "description");
  const rfpId = getString(rfp, "_id");

  // Metadata (NOT tags)
  const portalName = getString(rfp, "portal_name");
  const rfpType = getString(rfp, "rfp_type");
  const location = getString(rfp, "location");

  // Dates / refs
  const deadline = renderValue(rfp.deadline);
  const organization = renderValue(rfp.organization);
  const reference = renderValue(rfp.reference);

  // Tags (BADGES ONLY)
  const tags = getStringArray(rfp, "tags");

  return (
    <div>
      <div
        className="
          rounded-xl border bg-white dark:bg-neutral-950 p-5
          transition
          hover:shadow-md
          hover:border-blue-600 dark:hover:border-blue-500
        "
      >
        {/* ---------------- Header ---------------- */}
        <div className="flex justify-between gap-4">
          <div>
            <Link
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <h3 className="text-lg font-semibold">
                {title}
              </h3>
            </Link>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {tags.slice(0, 8).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground whitespace-nowrap">
            <strong>Deadline:</strong> {deadline}
          </div>
        </div>

        {/* ---------------- Description ---------------- */}
        {description && (
          <p className="mt-4 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* ---------------- Metadata ---------------- */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
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
            <strong>Organization:</strong> {organization}
          </div>
          <div>
            <strong>Reference:</strong> {reference}
          </div>
        </div>

        {/* ---------------- Relevance ---------------- */}
        {rfpId && (
          <div className="mt-4">
            <RelevancePanel rfpId={rfpId} />
          </div>
        )}
      </div>
    </div>
  );
}

