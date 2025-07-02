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
import ConfirmationModal from "@/components/ui/custom/ConfirmationModal";

const initialDocuments = [
  { id: 1, name: "Pay Stub - Last 30 days", status: "Not Uploaded", db_id: null as string | null },
  { id: 2, name: "Bank Statement - Last 2 months", status: "Not Uploaded", db_id: null as string | null },
  { id: 3, name: "W-2 - Last 2 years", status: "Not Uploaded", db_id: null as string | null },
];

const LOAN_APPLICATION_ID = 'f6389290-eadc-486d-b260-793203e91427';

const DocumentChecklist = () => {
  const [documents, setDocuments] = React.useState(initialDocuments);
  const [isUploading, setIsUploading] = React.useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedDocId, setSelectedDocId] = React.useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [docToDelete, setDocToDelete] = React.useState<string | null>(null);

    const allDocumentsUploaded = documents.every(
    (doc) => doc.status === "Pending Review"
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedDocId) return;

    setIsUploading(selectedDocId);

    try {
      const uploadUrlResponse = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });

      if (!uploadUrlResponse.ok) {
        const errorData = await uploadUrlResponse.json();
        throw new Error(errorData.error || "Could not get upload URL.");
      }
      const { signedUrl, path } = await uploadUrlResponse.json();

      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("File upload to storage failed.");
      }

      const confirmResponse = await fetch('/api/documents/confirm-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanApplicationId: LOAN_APPLICATION_ID, 
          fileName: file.name,
          filePath: path
        }),
      });
      
      if (!confirmResponse.ok) {
          throw new Error("Failed to confirm document upload.");
      }

      const newDocumentRecord = await confirmResponse.json();

      setDocuments(docs =>
        docs.map(doc =>
          doc.id === selectedDocId
            ? { ...doc, status: "Pending Review", db_id: newDocumentRecord.id }
            : doc
        )
      );

    } catch (error) {
      console.error("Upload process failed:", error);
      alert((error as Error).message);
    } finally {
      setIsUploading(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

    const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/application/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loanApplicationId: LOAN_APPLICATION_ID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application.");
      }

      setApplicationSubmitted(true); // Lock the UI
      alert("Application submitted successfully!");

    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadClick = (docId: number) => {
    setSelectedDocId(docId);
    fileInputRef.current?.click();
  };

  const openDeleteModal = (docDbId: string | null) => {
    if (docDbId) {
      setDocToDelete(docDbId);
      setIsModalOpen(true);
    } else {
      // This case should not happen if the button is disabled correctly,
      // but it's good practice to handle it.
      alert("Cannot delete a document without a valid ID.");
    }
  };

  const closeDeleteModal = () => {
    setDocToDelete(null);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (docToDelete === null) return;
    
    try {
      const response = await fetch(`/api/documents/${docToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete document.");
      }

      setDocuments(docs =>
        docs.map(doc =>
          doc.db_id === docToDelete
            ? { ...doc, status: "Not Uploaded", db_id: null }
            : doc
        )
      );

    } catch (error) {
      console.error("Delete process failed:", error);
      alert((error as Error).message || "An unexpected error occurred.");
    } finally {
      closeDeleteModal();
    }
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
                <TableCell className="text-right space-x-2">
                  {doc.status === 'Pending Review' && doc.db_id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteModal(doc.db_id)}
                    >
                      Delete
                    </Button>
                  )}
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

      <div className="mt-6 flex justify-end">
        {applicationSubmitted ? (
          <p className="text-green-600 font-semibold">Your application has been submitted for review.</p>
        ) : (
          <Button
            onClick={handleSubmitApplication}
            disabled={!allDocumentsUploaded || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application for Review"}
          </Button>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the uploaded file."
      />
    </div>
  );
};

export default DocumentChecklist;