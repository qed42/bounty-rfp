"use client";

import { useEffect, useState } from "react";
import { Filters } from "./components/Filters";
import { RfpCard } from "./components/RfpCard";
import { buildRfpQuery } from "../../lib/rfpApi";
import { Button } from "@/components/ui/button";
import type { Option } from "../../lib/locationApi";

const PAGE_SIZE = 9;

/* ---------------- Types ---------------- */

export interface FiltersState {
  keyword: string;
  min_budget: number;
  country: Option[];
  rfp_type: Option[];
  tech_stack: Option[];
  portal_names: Option[];
  deadline_days: number;
  exclude_onsite: boolean;
}

export type Rfp = {
  _id: string;
  [key: string]: unknown;
  title: string;
  portal_name: string;
};

/* ---------------- Component ---------------- */

export default function DashboardPage() {
  const [filters, setFilters] = useState<FiltersState>({
    keyword: "",
    min_budget: 0,
    country: [],
    rfp_type: [],
    tech_stack: [],
    portal_names: [],
    deadline_days: 0,
    exclude_onsite: false,
  });

  const [rfps, setRfps] = useState<Rfp[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- Fetch RFPs ---------------- */

  useEffect(() => {
    const controller = new AbortController();

    const fetchRfps = async (reset: boolean) => {
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

        const data = (await res.json()) as Rfp[];

        setRfps((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRfps(skip === 0);

    return () => controller.abort();
  }, [filters, skip]);

  /* ---------------- Handlers ---------------- */

  const handleFilterChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
    setSkip(0);
    setRfps([]);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    setSkip((prev) => prev + PAGE_SIZE);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          RFP Intelligence Dashboard
        </h1>

        <Filters filters={filters} onChange={handleFilterChange} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rfps.map((rfp) => (
            <RfpCard key={rfp._id} rfp={rfp} />
          ))}
        </div>

        {/* Empty State */}
        {!loading && rfps.length === 0 && !error && (
          <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No RFPs found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}

        {hasMore && rfps.length > 0 && (
          <div className="flex justify-center">
            <Button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && rfps.length > 0 && (
          <div className="text-center py-4 text-sm text-gray-500 dark:text-neutral-400">
            You have reached the end of the results
          </div>
        )}
      </div>
    </div>
  );
}
