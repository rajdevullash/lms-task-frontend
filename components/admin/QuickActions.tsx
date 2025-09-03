import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <Link
            href="/admin/courses/new"
            className="flex items-center text-blue-600 hover:text-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create New Course
          </Link>
        </div>
      </div>
    </div>
  );
}
