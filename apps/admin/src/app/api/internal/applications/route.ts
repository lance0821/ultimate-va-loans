import { createClient } from "@repo/supabase-clients/server";
import { Server } from "@repo/supabase-clients";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // We will need a server-side Supabase client for the admin app.
  // This assumes a similar setup to the 'web' app's /lib/supabase/server.ts
  const supabase = await Server.createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- Role-Based Access Control (RBAC) ---
  // This security check ensures only authorized users can access this data.
  if (!user || user.user_metadata?.role !== 'loan_officer') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Fetch all applications that are ready for review.
    const { data, error } = await supabase
      .from("loan_applications")
      .select(`
        id,
        status,
        created_at,
        users ( email )
      `)
      .eq("status", "InReview");

    if (error) {
      console.error("Error fetching applications for review:", error);
      return NextResponse.json(
        { error: "Could not fetch applications." },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}