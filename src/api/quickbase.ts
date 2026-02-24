import type { QuickbaseJobRecord } from "@/types/job";

export async function fetchJobs(): Promise<QuickbaseJobRecord[]> {
  const realm = process.env.NEXT_PUBLIC_QUICKBASE_REALM;
  const token = process.env.NEXT_PUBLIC_QUICKBASE_TOKEN;
  const tableId = process.env.NEXT_PUBLIC_QUICKBASE_TABLE_ID;
  if (!realm || !token) {
    throw new Error("Quickbase env not configured (NEXT_PUBLIC_QUICKBASE_*)");
  }
  if (!tableId) {
    throw new Error("NEXT_PUBLIC_QUICKBASE_TABLE_ID is required");
  }
  const url = "https://api.quickbase.com/v1/records/query";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "QB-Realm-Hostname": realm,
      Authorization: `QB-USER-TOKEN ${token}`,
    },
    body: JSON.stringify({
      from: tableId,
      select: [],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Quickbase error: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  const data = (await res.json()) as { data?: QuickbaseJobRecord[] };
  return data.data ?? [];
}
