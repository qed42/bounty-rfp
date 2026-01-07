import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface RfpCardProps {
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

export function RfpCard({ rfp }: RfpCardProps) {
  const portalUrl =
    typeof rfp.url === "string" && rfp.url.length > 0 ? rfp.url : "#";

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
        {/* ================= HEADER ================= */}
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
          </div>
        </div>

        {/* ================= DESCRIPTION ================= */}
        {rfp.description && (
          <p className="mt-4 text-sm text-muted-foreground whitespace-pre-line">
            {String(rfp.description)}
          </p>
        )}

        {/* ================= KEY DETAILS ================= */}
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
          <div>
            <strong>Estimated Cost:</strong>{" "}
            {renderValue(rfp.estimated_cost)}
          </div>
          <div>
            <strong>Category:</strong>{" "}
            {renderValue(rfp.category)}
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="mt-4 text-xs text-muted-foreground">
          Scraped at: {renderValue(rfp.scraped_at)}
        </div>
      </div>
    </Link>
  );
}
