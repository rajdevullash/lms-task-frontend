/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { moduleApi } from "@/services/api";
import { toast } from "react-hot-toast";

export default function CreateModuleModal({
  courseId,
  onClose,
  onCreated,
}: {
  courseId: string;
  onClose: () => void;
  onCreated: (module: any) => void;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await moduleApi.create({ title, courseId });
      onCreated(res.data.data);
      setTitle("");
      onClose();
      toast.success("Module created successfully");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to create module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Create New Module</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter module title"
          className="input mb-4"
          onKeyPress={(e) => e.key === "Enter" && handleCreate()}
        />
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !title.trim()}
            className="btn-primary"
          >
            {loading ? "Creating..." : "Create Module"}
          </button>
        </div>
      </div>
    </div>
  );
}
