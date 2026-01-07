"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RelevancePanel } from "./RelevancePanel";

interface RfpListItemProps {
  rfp: Record<string, unknown>;
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.map(String).join(", ");
  return String(value);
}

export function RfpListItem({ rfp }: RfpListItemProps) {
  const portalUrl =
    typeof rfp.url === "string" && rfp.url.trim().length > 0
      ? rfp.url
      : "#";

  // 🔒 NORMALIZE EVERYTHING FIRST (this is mandatory)
  const title = renderValue(rfp.title ?? "Untitled RFP");
  const portalName =
    rfp.portal_name !== undefined ? renderValue(rfp.portal_name) : null;
  const rfpType =
    rfp.rfp_type !== undefined ? renderValue(rfp.rfp_type) : null;
  const deadline = renderValue(rfp.deadline);
  const description =
    rfp.description !== undefined ? renderValue(rfp.description) : null;
  const organization = renderValue(rfp.organization);
  const reference = renderValue(rfp.reference);
  const location = renderValue(rfp.location);
  const rfpId = typeof rfp._id === "string" ? rfp._id : null;

  return (
    <Link
      href={portalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className="
          rounded-xl border bg-white dark:bg-neutral-950 p-5
          transition cursor-pointer
          hover:shadow-md
          hover:border-blue-600 dark:hover:border-blue-500
        "
      >
        {/* HEADER */}
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>

            <div className="mt-1 flex flex-wrap gap-2">
              {portalName && (
                <Badge variant="secondary">{portalName}</Badge>
              )}

              {rfpType && (
                <Badge variant="outline">{rfpType}</Badge>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground whitespace-nowrap">
            <strong>Deadline:</strong> {deadline}
          </div>
        </div>

        {/* DESCRIPTION */}
        {description && (
          <p className="mt-4 text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {/* META DETAILS */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div>
            <strong>Organization:</strong> {organization}
          </div>
          <div>
            <strong>Reference:</strong> {reference}
          </div>
          <div>
            <strong>Location:</strong> {location}
          </div>
        </div>

        {/* RELEVANCE */}
        {rfpId && (
          <div className="mt-4">
            <RelevancePanel rfpId={rfpId} />
          </div>
        )}
      </div>
    </Link>
  );
}
