/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DocumentIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { Lecture } from "@/types";

export default function LecturePdfList({ lecture }: { lecture: Lecture }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeExistingPdf = (pdfIndex: number) => {
    const confirmed = window.confirm("Remove this PDF?");
    if (!confirmed) return;

    // TODO: Replace with real API call
    toast.success("PDF removed locally (API pending)");
  };

  if (!lecture.lecture.pdfNotes?.length) return null;

  return (
    <div>
      <label className="label">Current PDF Notes</label>
      <div className="space-y-2">
        {lecture.lecture.pdfNotes.map((note: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <DocumentIcon className="h-5 w-5 text-red-600" />
              <span className="text-sm">PDF Note {index + 1}</span>
              <a
                href={note.secure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm"
              >
                View
              </a>
            </div>
            <button
              onClick={() => removeExistingPdf(index)}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
