"use client";

import { DocumentIcon } from "@heroicons/react/24/outline";

interface Props {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
}

export default function LectureFileUpload({
  selectedFiles,
  setSelectedFiles,
}: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files)
      setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="label">Add New PDF Notes</label>
      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="pdfNotes"
      />
      <label
        htmlFor="pdfNotes"
        className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
      >
        <div className="text-center space-y-2">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="text-sm text-gray-600">
            Upload PDF files or drag & drop
          </p>
          <p className="text-xs text-gray-500">Max 10MB each</p>
        </div>
      </label>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <DocumentIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
