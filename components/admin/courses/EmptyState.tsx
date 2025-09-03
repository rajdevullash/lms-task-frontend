import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

interface Props {
  searchTerm: string;
}

export default function EmptyState({ searchTerm }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <PlusIcon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm ? "No courses found" : "No courses yet"}
      </h3>
      <p className="text-gray-600 mb-6">
        {searchTerm
          ? "Try adjusting your search terms"
          : "Get started by creating your first course"}
      </p>
      {!searchTerm && (
        <Link href="/admin/courses/new" className="btn-primary">
          Create Course
        </Link>
      )}
    </div>
  );
}
