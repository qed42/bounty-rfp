"use client";

import { useEffect, useState } from "react";
import { Filters } from "./components/Filters";
import { RfpCard } from "./components/RfpCard";
import { buildRfpQuery } from "../../lib/rfpApi";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 9;

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    keyword: "",
    min_budget: 0,
    sector: [] as string[],
    country: [] as string[],
    rfp_type: [] as string[],
    tech_stack: [] as string[],
    portal_names: [] as string[],
    deadline_days: 0,
    exclude_onsite: false,
  });  
  
  const [rfps, setRfps] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ------------------ Fetch RFPs ------------------ */
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

        const data = await res.json();

        setRfps(prev => reset ? data : [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch RFPs:', err);
          setError(err.message || 'Failed to load RFPs');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRfps(skip === 0);

    return () => controller.abort();
  }, [filters, skip]);

  /* ------------------ Reset on Filter Change ------------------ */
  function handleFilterChange(newFilters: any) {
    setFilters(newFilters);
    setSkip(0);
    setRfps([]);
    setHasMore(true);
  }

  /* ------------------ Load More ------------------ */
  function handleLoadMore() {
    setSkip(prev => prev + PAGE_SIZE);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            RFP Intelligence Dashboard
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Filter and discover relevant opportunities
          </p>
        </div>

        <Filters filters={filters} onChange={handleFilterChange} />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading RFPs</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State (First Load) */}
        {loading && rfps.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-neutral-400">Loading RFPs...</p>
            </div>
          </div>
        )}

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

        {/* RFP Cards */}
        {rfps.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-neutral-400">
              Found {rfps.length} RFP{rfps.length !== 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rfps.map((rfp: any) => (
                <RfpCard key={rfp._id} rfp={rfp} />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {hasMore && rfps.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              disabled={loading}
              onClick={handleLoadMore}
              className="min-w-[140px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Loading...
                </span>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}

        {/* End of Results */}
        {!hasMore && rfps.length > 0 && (
          <div className="text-center py-4 text-sm text-gray-500 dark:text-neutral-400">
            You've reached the end of the results
          </div>
        )}
      </div>
    </div>
  );
}
