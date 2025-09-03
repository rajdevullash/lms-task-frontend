/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { courseApi } from "@/services/api";
import { Course } from "@/types";
import { toast } from "react-hot-toast";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (search?: string) => {
    try {
      setLoading(true);
      const response = await courseApi.getAll({
        searchTerm: search,
        limit: 50,
      });
      setCourses(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(searchTerm);
  };

  const handleDelete = async (courseId: string, courseSlug: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(courseId);
    try {
      await courseApi.delete(courseSlug);
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success("Course deleted successfully");
    } catch (error) {
      toast.error("Failed to delete course");
      console.error("Error deleting course:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (courseSlug: string) => {
    router.push(`/admin/courses/${courseSlug}/edit`);
  };

  const handleViewModules = (courseSlug: string) => {
    router.push(`/admin/courses/${courseSlug}/modules`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage all your courses</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Course
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                fetchCourses();
              }}
              className="btn-outline"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={
                    course.thumbnail?.[0]?.secure_url ||
                    "/placeholder-course.jpg"
                  }
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(course.price)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(course.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between items-center space-x-2">
                  <button
                    onClick={() => handleViewModules(course.slug)}
                    className="flex items-center text-blue-600 hover:text-blue-500 text-sm"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Modules
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(course.slug)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit course"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(course._id, course.slug)}
                      disabled={deleting === course._id}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete course"
                    >
                      {deleting === course._id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}
