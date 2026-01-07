import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RfpListItemProps {
  rfp: Record<string, unknown>;
}

function renderValue(value: unknown) {
  if (value === null || value === undefined) return "—";

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  if (typeof value === "object") {
    return Object.keys(value as object).length
      ? JSON.stringify(value, null, 2)
      : "—";
  }

  return String(value);
}

export function RfpListItem({ rfp }: RfpListItemProps) {
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
          rounded-xl border border-gray-200 dark:border-neutral-800
          bg-white dark:bg-neutral-950
          p-5
          transition-all duration-200
          hover:border-blue-600 dark:hover:border-blue-500
          hover:shadow-md
          cursor-pointer
        "
      >
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-snug">
              {String(rfp.title ?? "Untitled RFP")}
            </h3>

            <div className="flex flex-wrap gap-2">
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
              {rfp.location && (
                <Badge variant="outline">
                  {String(rfp.location)}
                </Badge>
              )}
              {rfp.organization && (
                <Badge variant="outline">
                  {String(rfp.organization)}
                </Badge>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              <strong>Published:</strong>{" "}
              {renderValue(rfp.published_date)}
            </div>
            <div>
              <strong>Deadline:</strong>{" "}
              {renderValue(rfp.deadline)}
            </div>
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        {rfp.description && (
          <p className="mt-4 text-sm text-muted-foreground whitespace-pre-line">
            {String(rfp.description)}
          </p>
        )}

        {/* ================= KEY DETAILS ================= */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div>
            <strong>Reference:</strong>{" "}
            {renderValue(rfp.reference)}
          </div>
          <div>
            <strong>Category:</strong>{" "}
            {renderValue(rfp.category)}
          </div>
          <div>
            <strong>Estimated Cost:</strong>{" "}
            {renderValue(rfp.estimated_cost)}
          </div>
          <div>
            <strong>Matched Keyword:</strong>{" "}
            {renderValue(rfp.matched_keyword)}
          </div>
          <div>
            <strong>Enriched:</strong>{" "}
            {rfp.enriched ? "Yes" : "No"}
          </div>
          <div>
            <strong>Portal ID:</strong>{" "}
            {renderValue(rfp.portal_id)}
          </div>
        </div>

        {/* ================= FULL API DATA ================= */}
        <details className="mt-5">
          <summary className="cursor-pointer text-sm font-medium">
            View full API data
          </summary>

          <div className="mt-3 max-h-72 overflow-auto rounded bg-muted p-3 text-xs">
            {Object.entries(rfp).map(([key, value]) => (
              <div key={key} className="mb-2">
                <span className="font-semibold">{key}:</span>{" "}
                <span className="whitespace-pre-wrap">
                  {renderValue(value)}
                </span>
              </div>
            ))}
          </div>
        </details>

        {/* ================= FOOTER ================= */}
        <div className="mt-4 text-xs text-muted-foreground">
          Scraped at: {renderValue(rfp.scraped_at)}
        </div>
      </div>
    </Link>
  );
}
