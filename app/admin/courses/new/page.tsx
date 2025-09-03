"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import CreateCourseForm from "@/components/admin/courses/create/CreateCourseForm";
import CourseTips from "@/components/admin/courses/create/CourseTips";


export default function CreateCoursePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/courses"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600">Add a new course to your platform</p>
        </div>
      </div>

      {/* Form */}
      <CreateCourseForm />

      {/* Tips */}
      <CourseTips />
    </div>
  );
}

