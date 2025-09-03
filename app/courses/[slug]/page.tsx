/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { courseApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  PlayIcon,
  DocumentIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import Navbar from "@/components/Navbar";

export default function CourseDetailPage() {
  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  console.log("User:", user);
  const params = useParams();
  const courseSlug = params.slug as string;

  useEffect(() => {
    if (courseSlug) {
      fetchCourseDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, user]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a separate endpoint for course details with modules/lectures
      const response = await courseApi.getWithProgress(courseSlug);
      console.log(response.data.data);
      setCourse(response.data.data);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLectures = course.lectures?.length || 0;
  const completedLectures = course.progress?.completedLectures || 0;
  const progressPercentage = course.progress?.progressPercentage || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course?.course.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {course?.course.description}
              </p>

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span>Instructor Name</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{totalLectures} lectures</span>
                </div>
                <div className="flex items-center">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  <span>Beginner Level</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className="h-4 w-4 text-yellow-400"
                    />
                  ))}
                  <span className="ml-2">4.8 (1,234 reviews)</span>
                </div>
              </div>
            </div>

            {/* Course Image/Video */}
            <div className="mb-8">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={
                    course?.course.thumbnail?.[0]?.secure_url ||
                    "/placeholder-course.jpg"
                  }
                  alt={course?.course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Progress Bar (if enrolled) */}

            <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Progress
                </h3>
                <span className="text-sm text-gray-600">
                  {completedLectures} of {totalLectures} lectures completed
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {progressPercentage}% complete
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {["overview", "curriculum", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-6 text-sm font-medium capitalize border-b-2 ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        What you&apos;ll learn
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            Master the fundamentals of the subject
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            Build practical projects from scratch
                          </span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            Get ready for advanced topics and certifications
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Course Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {course.course.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Requirements
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Basic computer skills</li>
                        <li>Access to a computer with internet connection</li>
                        <li>No prior experience required</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Course Content
                    </h3>

                    {course.modules && course.modules.length > 0 ? (
                      <div className="space-y-4">
                        {course.modules.map((module: any) => {
                          const moduleLectures =
                            course.lectures?.filter(
                              (lecture: any) =>
                                lecture.moduleId._id === module._id
                            ) || [];

                          return (
                            <div
                              key={module._id}
                              className="border border-gray-200 rounded-lg"
                            >
                              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h4 className="font-medium text-gray-900">
                                  Module {module.moduleNumber}: {module.title}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {moduleLectures.length} lectures
                                </p>
                              </div>

                              <div className="divide-y divide-gray-200">
                                {moduleLectures.map((lecture: any) => (
                                  <div
                                    key={lecture._id}
                                    className="px-4 py-3 flex items-center justify-between"
                                  >
                                    <div className="flex items-center space-x-3">
                                      {lecture.isLocked ? (
                                        <LockClosedIcon className="h-4 w-4 text-gray-400" />
                                      ) : lecture.isCompleted ? (
                                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <PlayIcon className="h-4 w-4 text-blue-500" />
                                      )}
                                      <span className="text-gray-900">
                                        {lecture.title}
                                      </span>
                                      {lecture.pdfNotes &&
                                        lecture.pdfNotes.length > 0 && (
                                          <DocumentIcon className="h-4 w-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                      <ClockIcon className="h-4 w-4" />
                                      <span>15:30</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        Course curriculum will be available soon.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                          4.8
                        </div>
                        <div className="flex items-center justify-center">
                          {[...Array(5)].map((_, i) => (
                            <StarSolidIcon
                              key={i}
                              className="h-5 w-5 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">1,234 reviews</p>
                      </div>

                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div
                            key={rating}
                            className="flex items-center space-x-2"
                          >
                            <span className="text-sm text-gray-600 w-3">
                              {rating}
                            </span>
                            <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{
                                  width: `${
                                    rating === 5 ? 70 : rating === 4 ? 20 : 5
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {rating === 5
                                ? "70%"
                                : rating === 4
                                ? "20%"
                                : "5%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      {[
                        {
                          name: "John Doe",
                          rating: 5,
                          date: "2 weeks ago",
                          comment:
                            "Excellent course! The instructor explains everything clearly and the hands-on projects are very helpful.",
                        },
                        {
                          name: "Jane Smith",
                          rating: 4,
                          date: "1 month ago",
                          comment:
                            "Good content overall. Would have liked more advanced topics but great for beginners.",
                        },
                      ].map((review, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-200 pb-4"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {review.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {review.name}
                              </p>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <StarSolidIcon
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              {/* Course Price */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {parseFloat(course.course.price) === 0
                    ? "Free"
                    : formatPrice(course.course.price)}
                </div>
              </div>

              {/* Enroll Button */}
              <div className="mb-6">
                {user ? (
                  <Link
                    href={`/courses/${course.course.slug}/learn`}
                    className="w-full btn-primary text-center block"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <Link
                    href="/auth/register"
                    className="w-full btn-primary text-center block"
                  >
                    Sign Up to Enroll
                  </Link>
                )}
              </div>

              {/* Course Info */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">8 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lectures:</span>
                  <span className="font-medium">{totalLectures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-medium">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate:</span>
                  <span className="font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {formatDate(course.course.createdAt)}
                  </span>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">
                  This course includes:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <PlayIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>{totalLectures} on-demand video lectures</span>
                  </li>
                  <li className="flex items-center">
                    <DocumentIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Downloadable resources</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span>Full lifetime access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
