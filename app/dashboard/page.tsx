import { buildRfpQuery } from "../../lib/rfpApi";
import config from "@/data/config.json";
import DashboardClient from "./components/DashboardClient";

const PAGE_SIZE = 9;

export default async function DashboardPage() {
  const query = buildRfpQuery({
    keyword: "",
    min_budget: 0,
    sector: [],
    country: [],
    rfp_type: [],
    tech_stack: [],
    portal_names: [],
    deadline_days: 0,
    exclude_onsite: false,
    skip: 0,
    limit: PAGE_SIZE,
  });

  const res = await fetch(
    `${config.serverBaseUrl}/rfps/?${query}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch RFPs");
  }

  const initialRfps = await res.json();

  return <DashboardClient initialRfps={initialRfps} />;
}
