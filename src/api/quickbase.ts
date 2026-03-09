import type { QuickbaseJobRecord } from "@/types/job";

export async function fetchJobs(): Promise<QuickbaseJobRecord[]> {
  const res = await fetch("/api/quickbase", {
    method: "GET",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Jobs API error: ${res.status} ${res.statusText}${
        text ? ` — ${text}` : ""
      }`
    );
  }

  const data = (await res.json()) as QuickbaseJobRecord[];
  return data;
}

