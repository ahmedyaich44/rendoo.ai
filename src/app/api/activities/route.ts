import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listPublishedActivities } from "@/lib/services/activities";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await listPublishedActivities(supabase, 20);

  if (error) {
    return NextResponse.json(
      { ok: false, message: error, data: [] },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data: data ?? [] });
}
