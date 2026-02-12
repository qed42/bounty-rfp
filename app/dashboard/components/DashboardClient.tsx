"use client";

import { useEffect, useState } from "react";
import { Filters } from "./Filters";
import { RfpCardCardView } from "./RfpCard";
import { RfpListItem } from "./RfpListItem";
import { buildRfpQuery } from "../../../lib/rfpApi";
import { Button } from "@/components/ui/button";
import { Option } from "../../../lib/locationApi";
import config from "@/data/config.json";

const PAGE_SIZE = 9;

export interface FiltersState {
  keyword: string;
  min_budget: number;
  sector: Option[];
  country: Option[];
  rfp_type: Option[];
  tech_stack: Option[];
  portal_names: Option[];
  deadline_days: number;
  exclude_onsite: boolean;
}

type ViewMode = "card" | "list";

export default function DashboardClient({
  initialRfps,
}: {
  initialRfps: Record<string, unknown>[];
}) {
  const [filters, setFilters] = useState<FiltersState>({
    keyword: "",
    min_budget: 0,
    sector: [],
    country: [],
    rfp_type: [],
    tech_stack: [],
    portal_names: [],
    deadline_days: 0,
    exclude_onsite: false,
  });

  const [rfps, setRfps] = useState<Record<string, unknown>[]>(
    initialRfps || []
  );
  const [skip, setSkip] = useState(initialRfps?.length || 0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialRfps?.length === PAGE_SIZE
  );
  const [error, setError] = useState<string | null>(null);
  

  const [viewMode, setViewMode] = useState<ViewMode>("card");

  /* ---------------- Fetch RFPs ---------------- */

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRfps(reset = false) {
      try {
        setLoading(true);
        setError(null);

        const query = buildRfpQuery({
          ...filters,
          skip: reset ? 0 : skip,
          limit: PAGE_SIZE,
        });

        const res = await fetch(
          `${config.baseUrl}/rfps/?${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = (await res.json()) as Record<string, unknown>[];

        setRfps((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRfps(skip === 0);
    return () => controller.abort();
  }, [filters, skip]);

  /* ---------------- Handlers ---------------- */

  function handleFilterChange(newFilters: FiltersState) {
    setFilters(newFilters);
    setSkip(0);
    setRfps([]);
    setHasMore(true);
  }

  function handleLoadMore() {
    setSkip((prev) => prev + PAGE_SIZE);
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">
          RFP Intelligence Dashboard
        </h1>

        <Filters filters={filters} onChange={handleFilterChange} />

        {/* View Toggle */}
        <div className="inline-flex rounded-lg border bg-white dark:bg-neutral-900 p-1 gap-1">
          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={`px-4 py-2 text-sm rounded-md ${
              viewMode === "card"
                ? "bg-primary text-white"
                : "text-muted-foreground"
            }`}
          >
            Card
          </button>

          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 text-sm rounded-md ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "text-muted-foreground"
            }`}
          >
            List
          </button>
        </div>

        {/* RFP Display */}
        {!loading && rfps.length === 0 ? (
          <div className="text-center py-16">
            No RFPs found
          </div>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-3 gap-6">
            {rfps.map((rfp) => (
              <RfpCardCardView
                key={String(rfp["_id"])}
                rfp={rfp}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rfps.map((rfp) => (
              <RfpListItem
                key={String(rfp["_id"])}
                rfp={rfp}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
