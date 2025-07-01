import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import React from "react";

// For this story, the list is hardcoded.
const requiredDocuments = [
  { id: 1, name: "Pay Stub - Last 30 days", status: "Not Uploaded" },
  { id: 2, name: "Bank Statement - Last 2 months", status: "Not Uploaded" },
  { id: 3, name: "W-2 - Last 2 years", status: "Not Uploaded" },
];

const DocumentChecklist = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[70%]">Document Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requiredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentChecklist;