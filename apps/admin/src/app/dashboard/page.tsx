import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui";
import { Badge } from "@repo/ui";
import { createClient } from "@repo/supabase-clients/server";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";

// This is a Server Component, so we can fetch data directly.
const AdminDashboardPage = async () => {
  const supabase = await createClient();

  // Secure the page
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== 'loan_officer') {
    return redirect("/"); // Or a dedicated unauthorized page
  }

  // Fetch the applications for review
  const { data: applications, error } = await supabase
    .from("loan_applications")
    .select(
      `
      id,
      status,
      created_at,
      users ( email )
    `
    )
    .eq("status", "InReview");

  if (error) {
    return <p className="p-8">Error loading applications: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold">Loan Applications for Review</h1>
      <div className="mt-8 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications?.map((app: any) => (
              <TableRow key={app.id}>
                <TableCell className="font-mono">{app.users.email}</TableCell>
                <TableCell>
                  <Badge>{app.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(app.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/applications/${app.id}`}>
                    <button className="text-blue-600 hover:underline">Review</button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;