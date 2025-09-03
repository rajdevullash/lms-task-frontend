/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { Course } from "@/types";
import { formatPrice } from "@/lib/utils";

interface RecommendedCoursesProps {
  courses: Course[];
}

export default function RecommendedCourses({
  courses,
}: RecommendedCoursesProps) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200 flex justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Recommended for You
        </h2>
        <Link
          href="/courses"
          className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
        >
          View all courses <ArrowRightIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course._id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
            >
              <Link href={`/courses/${course.slug}`}>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={
                      course.thumbnail?.[0]?.secure_url ||
                      "/placeholder-course.jpg"
                    }
                    alt={course.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/courses/${course.slug}`}>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-blue-600">
                    {parseFloat(course.price) === 0
                      ? "Free"
                      : formatPrice(course.price)}
                  </span>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
                  >
                    Learn More <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No courses available
          </h3>
          <p className="text-gray-600">Check back later for new courses</p>
        </div>
      )}
    </div>
  );
}
