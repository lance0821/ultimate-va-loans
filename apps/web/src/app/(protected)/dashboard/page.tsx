import { createClient } from "@repo/supabase-clients/server";
import { redirect } from "next/navigation";
import React from "react";
import LogoutButton from "@/components/features/authentication/LogoutButton";
// Ensure this import is present
import DocumentChecklist from "@/components/features/application/DocumentChecklist";

const DashboardPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="mt-4">
        Welcome, <span className="font-mono text-primary">{user.email}</span>!
      </p>
      
      {/* This is the section that needs to be added */}
      <div className="mt-8">
        <DocumentChecklist />
      </div>
    </div>
  );
};

export default DashboardPage;