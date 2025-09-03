"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useCourse } from "@/hooks/useCourse";
import CourseForm from "@/components/admin/courses/edit/CourseForm";
import CourseInfoCard from "@/components/admin/courses/edit/CourseInfoCard";

export default function EditCoursePage() {
  const params = useParams();
  const courseSlug = params.slug as string;

  const { course, loading, handleDelete, handleUpdate } = useCourse(courseSlug);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Course Not Found
        </h1>
        <Link href="/admin/courses" className="btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/courses"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-600">Update course information</p>
          </div>
        </div>

        <button
          onClick={() => handleDelete(course.slug)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
        >
          Delete Course
        </button>
      </div>

      {/* Course Form */}
      <CourseForm course={course} onSubmit={handleUpdate} />

      {/* Course Info */}
      <CourseInfoCard course={course} />
    </div>
  );
}
