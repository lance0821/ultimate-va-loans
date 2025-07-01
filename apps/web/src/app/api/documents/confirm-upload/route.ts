import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { loanApplicationId, fileName, filePath } = await request.json();
  const supabase = await createClient();

  if (!loanApplicationId || !fileName || !filePath) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("application_documents")
      .insert({
        loan_application_id: loanApplicationId,
        file_name: fileName,
        storage_path: filePath,
        status: "Pending Review",
      })
      .select()
      .single();

    if (error) {
      console.error("Error confirming upload:", error);
      return NextResponse.json(
        { error: "Could not record document upload." },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}