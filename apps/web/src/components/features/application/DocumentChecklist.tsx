"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React from "react";

const initialDocuments = [
  { id: 1, name: "Pay Stub - Last 30 days", status: "Not Uploaded" },
  { id: 2, name: "Bank Statement - Last 2 months", status: "Not Uploaded" },
  { id: 3, name: "W-2 - Last 2 years", status: "Not Uploaded" },
];

const DocumentChecklist = () => {
  const [documents, setDocuments] = React.useState(initialDocuments);
  const [isUploading, setIsUploading] = React.useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedDocId, setSelectedDocId] = React.useState<number | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocId) return;

    setIsUploading(selectedDocId);

    try {
      // Step 1: Ask our backend for a signed URL
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Could not get upload URL.");
      }

      const { signedUrl, path } = await response.json();

      // Step 2: Upload the file directly to Supabase Storage
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload failed.");
      }
      
      console.log("File uploaded successfully to path:", path);
      
      // Step 3: Confirm upload with our backend
      await fetch('/api/documents/confirm-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanApplicationId: '123e4567-e89b-12d3-a456-426614174000', // Placeholder
          fileName: file.name,
          filePath: path
        }),
      });

      // Step 4: Update UI state
      setDocuments(docs =>
        docs.map(doc =>
          doc.id === selectedDocId ? { ...doc, status: "Pending Review" } : doc
        )
      );
    } catch (error) {
      console.error("Upload process failed:", error);
      alert((error as Error).message || "An unexpected error occurred.");
    } finally {
      setIsUploading(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }; // <-- This closing brace for handleFileChange was missing.

  const handleUploadClick = (docId: number) => {
    setSelectedDocId(docId);
    fileInputRef.current?.click();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
      <div className="border rounded-md">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="application/pdf,image/jpeg,image/png"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Document Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  <Badge variant={doc.status === 'Pending Review' ? 'default' : 'outline'}>
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadClick(doc.id)}
                    disabled={isUploading === doc.id || doc.status !== 'Not Uploaded'}
                  >
                    {isUploading === doc.id ? "Uploading..." : "Upload"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentChecklist; // <-- The export must be outside the component function.