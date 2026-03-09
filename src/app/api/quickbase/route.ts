import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { QuickbaseJobRecord } from "@/types/job";

export async function GET(_req: NextRequest) {
  const realm = process.env.QUICKBASE_REALM;
  const token = process.env.QUICKBASE_TOKEN;
  const tableId = process.env.QUICKBASE_TABLE_ID;

  if (!realm || !token || !tableId) {
    return NextResponse.json(
      {
        error:
          "Quickbase env not configured. Expected QUICKBASE_REALM, QUICKBASE_TOKEN, QUICKBASE_TABLE_ID.",
      },
      { status: 500 }
    );
  }

  try {
    const url = "https://api.quickbase.com/v1/records/query";
    const qbResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "QB-Realm-Hostname": realm.includes(".quickbase.com")
          ? realm
          : `${realm}.quickbase.com`,
        Authorization: `QB-USER-TOKEN ${token}`,
      },
      body: JSON.stringify({
        from: tableId,
        select: [],
      }),
    });

    if (!qbResponse.ok) {
      const text = await qbResponse.text();
      return NextResponse.json(
        {
          error: `Quickbase error: ${qbResponse.status} ${qbResponse.statusText}`,
          details: text || undefined,
        },
        { status: qbResponse.status }
      );
    }

    const data = (await qbResponse.json()) as { data?: QuickbaseJobRecord[] };
    const records = data.data ?? [];
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected error calling Quickbase",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

