import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const {
      data: { user: exchangedUser },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      let user = exchangedUser;

      if (!user) {
        const {
          data: { user: fetchedUser },
        } = await supabase.auth.getUser();
        user = fetchedUser;
      }

      if (user) {
        const fullName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          user.user_metadata?.user_name ??
          null;
        const avatarUrl =
          user.user_metadata?.avatar_url ??
          user.user_metadata?.picture ??
          null;

        await supabase.from("profiles").upsert(
          {
            id: user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
          },
          { onConflict: "id" },
        );
      }

      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/signin", origin));
}
