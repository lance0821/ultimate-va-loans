import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { loanApplicationId } = await request.json();
  const supabase = await createClient();

  // Verify the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!loanApplicationId) {
    return NextResponse.json(
      { error: "Loan Application ID is required." },
      { status: 400 }
    );
  }

  try {
    // Update the status of the loan application record
    const { data, error } = await supabase
      .from("loan_applications")
      .update({ status: "InReview" })
      .eq("id", loanApplicationId)
      // Important: Ensure the user owns this application
      .eq("user_id", user.id) 
      .select()
      .single();

    if (error) {
      console.error("Error submitting application:", error);
      return NextResponse.json(
        { error: "Could not submit application." },
        { status: 404 } // 404 is appropriate if the record wasn't found for that user
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