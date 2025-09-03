import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function CoursesHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-600">Manage all your courses</p>
      </div>
      <Link href="/admin/courses/new" className="btn-primary flex items-center">
        <PlusIcon className="h-5 w-5 mr-2" />
        Create Course
      </Link>
    </div>
  );
}
