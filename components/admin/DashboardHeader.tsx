import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here&apos;s what&apos;s happening.
        </p>
      </div>
      <Link href="/admin/courses/new" className="btn-primary flex items-center">
        <PlusIcon className="h-5 w-5 mr-2" />
        Create Course
      </Link>
    </div>
  );
}
