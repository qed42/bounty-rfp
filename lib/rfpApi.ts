export function buildRfpQuery(filters: any) {
  const params = new URLSearchParams();

  const extractValues = (arr?: { value: string }[]) =>
    arr?.map((o) => o.value) || [];

  // Portals
  const portals = extractValues(filters.portal_names);
  if (portals.length) {
    params.set("portal_names", portals.join(","));
  }

  // Country (location)
  const countries = extractValues(filters.country);
  if (countries.length) {
    params.set("location", countries.join(","));
  }

  // RFP Type
  const rfpTypes = extractValues(filters.rfp_type);
  if (rfpTypes.length) {
    params.set("rfp_type", rfpTypes.join(","));
  }

  // Tech Stack
  const tech = extractValues(filters.tech_stack);
  if (tech.length) {
    params.set("keywords", tech.join(","));
  }

  // Keyword
  if (filters.keyword) {
    params.set("search", filters.keyword);
  }

  // Budget
  if (filters.min_budget) {
    params.set("min_cost", String(filters.min_budget));
  }

  // Deadline
  if (filters.deadline_days) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + filters.deadline_days);

    params.set("deadline_from", today.toISOString().split("T")[0]);
    params.set("deadline_to", future.toISOString().split("T")[0]);
  }

  // Pagination
  params.set("skip", String(filters.skip || 0));
  params.set("limit", String(filters.limit || 9));

  return params.toString();
}
