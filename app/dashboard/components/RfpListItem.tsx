"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RelevancePanel } from "./RelevancePanel";

interface RfpCardProps {
  rfp: Record<string, unknown>;
}

function renderValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function RfpCardListView({ rfp }: RfpCardProps) {
  const portalUrl =
    typeof rfp.url === "string" && rfp.url.length > 0 ? rfp.url : "#";

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
          hover:shadow-md transition cursor-pointer
          hover:border-blue-600 dark:hover:border-blue-500
        "
      >
        {/* HEADER */}
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              {String(rfp.title ?? "Untitled RFP")}
            </h3>

            <div className="mt-1 flex flex-wrap gap-2">
              {rfp.portal_name && (
                <Badge variant="secondary">
                  {String(rfp.portal_name)}
                </Badge>
              )}
              {rfp.rfp_type && (
                <Badge variant="outline">
                  {String(rfp.rfp_type)}
                </Badge>
              )}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Deadline: {renderValue(rfp.deadline)}
          </div>
        </div>

        {/* DESCRIPTION */}
        {rfp.description && (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
            {String(rfp.description)}
          </p>
        )}

        {/* META */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div><strong>Org:</strong> {renderValue(rfp.organization)}</div>
          <div><strong>Ref:</strong> {renderValue(rfp.reference)}</div>
          <div><strong>Location:</strong> {renderValue(rfp.location)}</div>
        </div>

        {/* RELEVANCE */}
        {typeof rfp._id === "string" && (
          <RelevancePanel rfpId={rfp._id} />
        )}
      </div>
    </Link>
  );
}
