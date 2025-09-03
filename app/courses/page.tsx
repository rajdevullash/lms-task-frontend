/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { courseApi } from "@/services/api";
import { Course } from "@/types";
import { formatPrice, truncateText } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (search?: string) => {
    try {
      setLoading(true);
      const response = await courseApi.getAllUsers({
        searchTerm: search,
        limit: 50,
      });
      console.log(response.data);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Amazing Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expand your skills with our comprehensive collection of courses
            designed by experts
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
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
            </div>
          </form>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden"
              >
                <Link href={`/courses/${course.slug}`}>
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={
                        course.thumbnail?.[0]?.secure_url ||
                        "/placeholder-course.jpg"
                      }
                      alt={course.title}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </Link>

                <div className="p-6">
                  <Link href={`/courses/${course.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {truncateText(course.description, 120)}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {parseFloat(course.price) === 0
                        ? "Free"
                        : formatPrice(course.price)}
                    </span>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="btn-primary text-sm"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No courses found" : "No courses available"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "Check back later for new courses"}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchCourses();
                }}
                className="btn-primary"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
