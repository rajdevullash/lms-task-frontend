/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect } from "react";
import { moduleApi } from "@/services/api";
import { Module } from "@/types";
import { toast } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface EditModuleModalProps {
  module: Module;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedModule: Module) => void;
}

export default function EditModuleModal({
  module,
  isOpen,
  onClose,
  onUpdate,
}: EditModuleModalProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("module info", module);

  useEffect(() => {
    if (isOpen && module) {
      setTitle(module.title);
    }
  }, [isOpen, module]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Module title is required");
      return;
    }

    setLoading(true);
    try {
      const response = await moduleApi.update(module.slug, { title });
      const updatedModule = response.data.data;
      console.log(updatedModule);
      onUpdate(updatedModule);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update module");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Module</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Module Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter module title"
              className="input"
              required
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <button type="button" onClick={onClose} className="btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Updating..." : "Update Module"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>
            <strong>Module Number:</strong> {module.moduleNumber}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(module.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>ID:</strong> {module._id}
          </p>
        </div>
      </div>
    </div>
  );
}
