import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json(
      { ok: false, message: "Missing Supabase environment variables." },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, message: "Supabase is connected." });
}
