"use client";

import { useEffect, useState } from "react";
import Select from "@/components/ui/ClientSelect";
import { OnChangeValue } from "react-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { fetchCountries, Option } from "../../../lib/locationApi";

/* ---------------- Types ---------------- */

type FiltersState = {
  keyword: string;
  min_budget: number;
  country: Option[];
  rfp_type: Option[];
  deadline_days: number;
  tech_stack: Option[]; // FINAL payload field
  portal_names: Option[];
  exclude_onsite: boolean;
};

type TechCategory =
  | "web"
  | "cms"
  | "frontend"
  | "ai"
  | "mobile"
  | "government";

/* ---------------- Constants ---------------- */

const DEFAULT_FILTERS: FiltersState = {
  keyword: "",
  min_budget: 0,
  country: [],
  rfp_type: [],
  deadline_days: 0,
  tech_stack: [],
  portal_names: [],
  exclude_onsite: false,
};

const TECH_CATEGORIES: { label: string; value: TechCategory }[] = [
  { label: "Web Development", value: "web" },
  { label: "CMS", value: "cms" },
  { label: "Frontend", value: "frontend" },
  { label: "AI / Data", value: "ai" },
  { label: "Mobile", value: "mobile" },
  { label: "Government", value: "government" },
];

const TECH_STACK_MAP: Record<TechCategory, Option[]> = {
  web: [
    { label: "Website", value: "website" },
    { label: "Web Page", value: "web_page" },
    { label: "Javascript", value: "javascript" },
    { label: "Next JS", value: "next js" },
  ],
  cms: [
    { label: "Drupal Development", value: "drupal development" },
    { label: "WordPress", value: "wordpress" },
    {
      label: "Content Management System",
      value: "content management system",
    },
  ],
  frontend: [{ label: "React", value: "react" }],
  ai: [
    { label: "Artificial Intelligence", value: "artificial intelligence" },
    { label: "GenAI", value: "genai" },
    { label: "Data Visualization", value: "data visualization" },
  ],
  mobile: [{ label: "Mobile App", value: "mobile app" }],
  government: [{ label: "Government Websites", value: "government websites" }],
};

/* ---------------- Component ---------------- */

export function Filters({
  filters,
  onChange,
}: {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}) {
  const [countries, setCountries] = useState<Option[]>([]);
  const [techCategory, setTechCategory] = useState<TechCategory | null>(null);

  const [localFilters, setLocalFilters] = useState<FiltersState>({
    ...DEFAULT_FILTERS,
    ...filters,
  });

  /* -------- Fetch Countries -------- */

  useEffect(() => {
    async function loadCountries() {
      const data = await fetchCountries();
      setCountries(data);
    }
    loadCountries();
  }, []);

  /* -------- Sync external filters -------- */

  useEffect(() => {
    setLocalFilters({ ...DEFAULT_FILTERS, ...filters });
  }, [filters]);

  /* -------- Helpers -------- */

  function update<K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleSelectChange(
    key: keyof FiltersState,
    v: OnChangeValue<Option, true>
  ) {
    update(key, (v ?? []) as Option[]);
  }

  /* -------- Build FINAL payload -------- */

  function buildPayload(): FiltersState {
    let finalTechStack: Option[] = [];
  
    // CASE 1: Parent selected, NO children
    if (techCategory && localFilters.tech_stack.length === 0) {
      const parent = TECH_CATEGORIES.find(
        (c) => c.value === techCategory
      );
  
      if (parent) {
        finalTechStack = [{ label: parent.label, value: parent.value }];
      }
    }
  
    // CASE 2: Parent + children selected → ONLY children
    if (techCategory && localFilters.tech_stack.length > 0) {
      finalTechStack = localFilters.tech_stack;
    }
  
    // CASE 3: No parent
    if (!techCategory) {
      finalTechStack = [];
    }
  
    return {
      ...localFilters,
      tech_stack: finalTechStack,
    };
  }
  

  /* ---------------- UI ---------------- */

  return (
    <div className="rounded-xl border bg-white dark:bg-neutral-950 p-6 space-y-6">
      <h2 className="text-lg font-semibold">RFP Filters</h2>

      {/* -------- Row 1 -------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <Label className="mb-2 block">Min Budget</Label>
          <Input
            type="number"
            value={localFilters.min_budget}
            onChange={(e) =>
              update("min_budget", Number(e.target.value))
            }
          />
        </div>

        <div>
          <Label className="mb-2 block">Country</Label>
          <Select
            isMulti
            options={countries}
            value={localFilters.country}
            onChange={(v) => handleSelectChange("country", v)}
          />
        </div>

        <div>
          <Label className="mb-2 block">RFP Type</Label>
          <Select
            isMulti
            options={[
              { label: "RFP", value: "RFP" },
              { label: "RFQ", value: "RFQ" },
              { label: "RFI", value: "RFI" },
              { label: "EOI", value: "EOI" },
              { label: "Tender", value: "TENDER" },
            ]}
            value={localFilters.rfp_type}
            onChange={(v) => handleSelectChange("rfp_type", v)}
          />
        </div>

        <div>
          <Label className="mb-2 block">Deadline (Days)</Label>
          <Input
            type="number"
            value={localFilters.deadline_days}
            onChange={(e) =>
              update("deadline_days", Number(e.target.value))
            }
          />
        </div>
      </div>

      {/* -------- Row 2 -------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <Label className="mb-2 block">Tech Category</Label>
          <Select
            options={TECH_CATEGORIES}
            value={
              techCategory
                ? TECH_CATEGORIES.find(
                    (c) => c.value === techCategory
                  )
                : null
            }
            onChange={(v) => {
              setTechCategory(v?.value ?? null);
              update("tech_stack", []);
            }}
          />
        </div>

        <div>
          <Label className="mb-2 block">Tech Stack</Label>
          <Select
            isMulti
            isDisabled={!techCategory}
            options={
              techCategory ? TECH_STACK_MAP[techCategory] : []
            }
            value={localFilters.tech_stack}
            onChange={(v) => handleSelectChange("tech_stack", v)}
            placeholder={
              techCategory
                ? "Select tech stack"
                : "Select tech category first"
            }
          />
        </div>

        <div>
          <Label className="mb-2 block">Portals</Label>
          <Select
            isMulti
            options={[
              { label: "Merx", value: "Merx" },
              { label: "UNGM", value: "UNGM" },
              { label: "GlobalTenders", value: "GlobalTenders" },
              { label: "InstantMarkets", value: "InstantMarkets" },
            ]}
            value={localFilters.portal_names}
            onChange={(v) =>
              handleSelectChange("portal_names", v)
            }
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch
            checked={localFilters.exclude_onsite}
            onCheckedChange={(v) =>
              update("exclude_onsite", v)
            }
          />
          <Label>Exclude Onsite</Label>
        </div>
      </div>

      {/* -------- Actions -------- */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            setTechCategory(null);
            onChange(DEFAULT_FILTERS);
          }}
        >
          Reset
        </Button>

        <Button onClick={() => onChange(buildPayload())}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
