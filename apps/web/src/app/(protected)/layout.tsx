import { createClient } from "@repo/supabase-clients/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // This is the guard logic. If the user is not logged in,
    // they will be redirected to the login page.
    redirect("/login");
  }

  return <>{children}</>;
}