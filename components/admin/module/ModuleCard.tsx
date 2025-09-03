import Link from "next/link";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { Module, Lecture } from "@/types";
import LectureItem from "./LectureItem";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import { toast } from "react-hot-toast";
import EditModuleModal from "@/components/EditModuleModal";

export default function ModuleCard({
  module,
  courseSlug,
  lectures,
  onDelete,
  onUpdateModule,
}: {
  module: Module;
  courseSlug: string;
  lectures: Lecture[];
  onDelete: (id: string, slug: string) => void;
  onUpdateModule: (updatedModule: Module) => void;
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b flex justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {module.moduleNumber}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{module.title}</h3>
              <p className="text-sm text-gray-500">
                {lectures.length} lectures
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Add Lecture */}
            <Link
              href={`/admin/courses/${courseSlug}/modules/${module.slug}/lectures/new`}
              className="btn-outline flex items-center text-sm"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Lecture
            </Link>

            {/* Edit Module */}
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <PencilIcon className="h-4 w-4" />
            </button>

            {/* Delete Module */}
            <button
              onClick={() => onDelete(module._id, module.slug)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {lectures.length > 0 ? (
            <div className="space-y-3">
              {lectures.map((lecture) => (
                <LectureItem
                  key={lecture._id}
                  lecture={lecture}
                  courseSlug={courseSlug}
                  moduleSlug={module.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h4 className="text-lg font-medium">No lectures yet</h4>
              <p className="text-gray-600 mb-4">Add your first lecture</p>
              <Link
                href={`/admin/courses/${courseSlug}/modules/${module.slug}/lectures/new`}
                className="btn-primary"
              >
                Add Lecture
              </Link>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <EditModuleModal
          module={module}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedModule: Module) => {
            onUpdateModule(updatedModule);
            setShowEditModal(false);
            toast.success("Module updated successfully");
          }}
        />
      )}
    </>
  );
}
