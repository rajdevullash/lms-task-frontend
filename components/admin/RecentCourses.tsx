/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { Course } from "@/types";

export default function RecentCourses({ courses }: { courses: Course[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Recent Courses</h2>
        <Link
          href="/admin/courses"
          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
        >
          View all
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 mb-3">
                <img
                  src={
                    course.thumbnail?.[0]?.secure_url ||
                    "/placeholder-course.jpg"
                  }
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {course.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-blue-600">
                  ${course.price}
                </span>
                <Link
                  href={`/admin/courses/${course.slug}/modules`}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first course.
          </p>
          <Link href="/admin/courses/new" className="btn-primary">
            Create Course
          </Link>
        </div>
      )}
    </div>
  );
}
