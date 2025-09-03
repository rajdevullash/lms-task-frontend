import { AcademicCapIcon } from "@heroicons/react/24/outline";

export default function EmptyModules({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
      <AcademicCapIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">No modules yet</h3>
      <p className="text-gray-600 mb-6">
        Start structuring your course by creating your first module
      </p>
      <button onClick={onCreate} className="btn-primary">
        Create First Module
      </button>
    </div>
  );
}
