import { Option } from "./locationApi";

interface RfpQueryFilters {
  keyword?: string;
  min_budget?: number;
  country?: Option[];
  rfp_type?: Option[];
  tech_stack?: Option[];
  portal_names?: Option[];
  deadline_days?: number;
  skip?: number;
  limit?: number;

  // add sort fields
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export function buildRfpQuery(filters: RfpQueryFilters): string {
  const params = new URLSearchParams();

  const values = (arr?: Option[]) => arr?.map((o) => o.value) ?? [];

  if (values(filters.portal_names).length) {
    params.set("portal_names", values(filters.portal_names).join(","));
  }

  if (values(filters.country).length) {
    params.set("location", values(filters.country).join(","));
  }

  if (values(filters.rfp_type).length) {
    params.set("rfp_type", values(filters.rfp_type).join(","));
  }

  if (values(filters.tech_stack).length) {
    params.set("keywords", values(filters.tech_stack).join(","));
  }

  if (filters.keyword) {
    params.set("search", filters.keyword);
  }

  if (filters.min_budget) {
    params.set("min_cost", String(filters.min_budget));
  }

  if (filters.deadline_days) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + filters.deadline_days);

    params.set("deadline_from", today.toISOString().split("T")[0]);
    params.set("deadline_to", future.toISOString().split("T")[0]);
  }

  // add sort params
  if (filters.sort_by) {
    params.set("sort_by", filters.sort_by);
  }

  if (filters.sort_order) {
    params.set("sort_order", filters.sort_order);
  }

  params.set("skip", String(filters.skip ?? 0));
  params.set("limit", String(filters.limit ?? 9));

  return params.toString();
}
