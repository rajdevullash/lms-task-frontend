import Link from "next/link";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Course } from "@/types";

export default function CourseModulesHeader({
  course,
  onAddModule,
}: {
  course: Course | null;
  onAddModule: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/courses"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {course?.title} – Modules & Lectures
          </h1>
          <p className="text-gray-600">Manage course content structure</p>
        </div>
      </div>
      <button onClick={onAddModule} className="btn-primary flex items-center">
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Module
      </button>
    </div>
  );
}
