"use client";

import { useEffect, useState } from "react";
import { Filters } from "./components/Filters";
import { RfpCardCardView } from "./components/RfpCard";
import { RfpListItem } from "./components/RfpListItem";
import { buildRfpQuery } from "../../lib/rfpApi";
import { Button } from "@/components/ui/button";
import { Option } from "../../lib/locationApi";

const PAGE_SIZE = 9;

/* ---------------- Types ---------------- */

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

/* ---------------- Page ---------------- */

export default function DashboardPage() {
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

  const [rfps, setRfps] = useState<Record<string, unknown>[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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
          `http://65.2.128.237:8000/api/v1/rfps/?${query}`,
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            RFP Intelligence Dashboard
          </h1>
        </div>

        {/* Filters */}
        <Filters filters={filters} onChange={handleFilterChange} />

        {/* View Toggle */}
        <div className="inline-flex rounded-lg border bg-white dark:bg-neutral-900 p-1 gap-1">
          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={`px-4 py-2 text-sm rounded-md transition cursor-pointer
              ${
                viewMode === "card"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted dark:hover:bg-neutral-800"
              }`}
          >
            Card
          </button>

          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 text-sm rounded-md transition cursor-pointer
              ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted dark:hover:bg-neutral-800"
              }`}
          >
            List
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            {error}
          </div>
        )}
        
        {/* ---------------- Card / List / Empty State ---------------- */}
        {!loading && rfps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg bg-white dark:bg-neutral-900">
            <p className="text-lg font-medium">
              No RFPs found
            </p>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Try adjusting your filters, removing some constraints, or expanding
              the deadline and tech stack selections.
            </p>
          </div>
        ) : viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rfps.map((rfp) => (
              <RfpCardCardView key={String(rfp["_id"])} rfp={rfp} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {rfps.map((rfp) => (
              <RfpListItem key={String(rfp["_id"])} rfp={rfp} />
            ))}
          </div>
        )}


        {/* Load More */}
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
