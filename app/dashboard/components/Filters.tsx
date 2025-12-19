// filter.tsx
"use client";

import { useEffect, useState } from "react";
import Select, { OnChangeValue } from "react-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { fetchCountries, Option } from "../../../lib/locationApi";

type FiltersState = {
  keyword: string;
  min_budget: number;
  country: Option[];
  rfp_type: Option[];
  deadline_days: number;
  tech_stack: Option[];
  portal_names: Option[];
  exclude_onsite: boolean;
};

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

export function Filters({
  filters,
  onChange,
}: {
  filters: FiltersState;
  onChange: (filters: FiltersState) => void;
}) {
  const [countries, setCountries] = useState<Option[]>([]);
  const [localFilters, setLocalFilters] = useState<FiltersState>({
    ...DEFAULT_FILTERS,
    ...filters,
  });

  /* -------- Fetch countries dynamically -------- */
  useEffect(() => {
    async function loadCountries() {
      const data = await fetchCountries();
      setCountries(data);
    }
    loadCountries();
  }, []);

  useEffect(() => {
    setLocalFilters({ ...DEFAULT_FILTERS, ...filters });
  }, [filters]);

  function update<K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }

  const handleSelectChange = (
    key: keyof FiltersState,
    v: OnChangeValue<Option, true>
  ) => {
    update(key, (v ?? []) as Option[]);
  };

  return (
    <div className="rounded-xl border bg-white dark:bg-neutral-950 p-6 space-y-6">
      <h2 className="text-lg font-semibold">RFP Filters</h2>

      {/* -------- Row 1 -------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">

        <div>
          <Label className="mb-2 block" htmlFor="min_budget">
            Min Budget
          </Label>
          <Input
            id="min_budget"
            type="number"
            value={localFilters.min_budget}
            onChange={(e) =>
              update("min_budget", Number(e.target.value))
            }
          />
        </div>

        <div>
          <Label className="mb-2 block" htmlFor="country-select">
            Country
          </Label>
          <Select
            inputId="country-select"
            isMulti
            options={countries}
            value={localFilters.country}
            onChange={(v) => handleSelectChange("country", v)}
          />
        </div>

        <div>
          <Label className="mb-2 block" htmlFor="rfp-type-select">
            RFP Type
          </Label>
          <Select
            inputId="rfp-type-select"
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
          <Label className="mb-2 block" htmlFor="deadline_days">
            Deadline (Days)
          </Label>
          <Input
            id="deadline_days"
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
          <Label className="mb-2 block" htmlFor="tech-stack-select">
            Tech Stack
          </Label>
          <Select
            inputId="tech-stack-select"
            isMulti
            options={[
              { label: "Artificial Intelligence", value: "artificial intelligence" },
              { label: "Drupal Development", value: "drupal development" },
              { label: "Website", value: "website" },
              { label: "Web Page", value: "web_page" },
              { label: "Content Management System", value: "content management system" },
              { label: "GenAI", value: "genai" },
              { label: "Government Websites", value: "government websites" },
              { label: "React", value: "react" },
              { label: "WordPress", value: "wordpress" },
              { label: "Mobile App", value: "mobile app" },
              { label: "Data Visualization", value: "data visualization" },
              { label: "Next JS", value: "next js" },
              { label: "Javascript", value: "javascript" },
            ]}
            value={localFilters.tech_stack}
            onChange={(v) => handleSelectChange("tech_stack", v)}
          />
        </div>

        <div>
          <Label className="mb-2 block" htmlFor="portals-select">
            Portals
          </Label>
          <Select
            inputId="portals-select"
            isMulti
            options={[
              { label: "Merx", value: "Merx" },
              { label: "UNGM", value: "UNGM" },
              { label: "GlobalTenders", value: "GlobalTenders" },
              { label: "InstantMarkets", value: "InstantMarkets" },
            ]}
            value={localFilters.portal_names}
            onChange={(v) => handleSelectChange("portal_names", v)}
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch
            id="exclude_onsite"
            checked={localFilters.exclude_onsite}
            onCheckedChange={(v) =>
              update("exclude_onsite", v)
            }
          />
          <Label htmlFor="exclude_onsite">Exclude Onsite</Label>
        </div>
      </div>

      {/* -------- Actions -------- */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => onChange(DEFAULT_FILTERS)}>
          Reset
        </Button>
        <Button onClick={() => onChange(localFilters)}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
