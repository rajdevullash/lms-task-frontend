/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { progressApi, courseApi } from "@/services/api";
import { Progress, Course } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  BookOpenIcon,
  ClockIcon,
  TrophyIcon,
  ChartBarIcon,
  PlayIcon,
  ArrowRightIcon,

  UserIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import Navbar from "@/components/Navbar";

interface DashboardStats {
  totalCourses: number;
  completedLectures: number;
  hoursLearned: number;
  averageProgress: number;
  streak: number;
  certificatesEarned: number;
}



export default function UserDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<Progress[]>([]);
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    completedLectures: 0,
    hoursLearned: 0,
    averageProgress: 0,
    streak: 0,
    certificatesEarned: 0,
  });


  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user progress
      const progressResponse = await progressApi.getUserProgress();
      const progressData = progressResponse.data.data;
      setUserProgress(progressData);
      console.log("User progress data:", progressData);

      // Fetch available courses for recommendations
      const coursesResponse = await courseApi.getAllUsers({ limit: 6 });
      setRecentCourses(coursesResponse.data.data);

      // Calculate comprehensive stats
      const totalCourses = progressData.length;
      const completedLectures = progressData.reduce(
        (sum, p) => sum + (p.completedLectures?.length || 0),
        0
      );
      const averageProgress =
        totalCourses > 0
          ? progressData.reduce(
              (sum, p) => sum + (p.progressPercentage || 0),
              0
            ) / totalCourses
          : 0;

      // Mock additional stats (in real app, these would come from API)
      const hoursLearned = Math.floor(completedLectures * 0.5); // 30 min per lecture
      const streak = calculateLearningStreak(progressData);
      const certificatesEarned = progressData.filter(
        (p) => p.progressPercentage === 100
      ).length;

      setStats({
        totalCourses,
        completedLectures,
        hoursLearned,
        averageProgress: Math.round(averageProgress),
        streak,
        certificatesEarned,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLearningStreak = (progressData: Progress[]): number => {
    // Mock streak calculation - in real app, track daily activity
    if (progressData.length === 0) return 0;

    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    // Simple mock: if user has recent activity, show streak
    const recentActivity = progressData.some(
      (p) => new Date(p.lastAccessed).getTime() > yesterday.getTime()
    );

    return recentActivity ? Math.floor(Math.random() * 7) + 1 : 0;
  };

  

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };




  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to continue your learning journey?
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <BookOpenIcon className="h-4 w-4 mr-2" />
              Browse Courses
            </Link>
            <Link
              href="/progress"
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View Progress
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Enrolled Courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCourses}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {stats.averageProgress}% avg progress
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Completed Lectures
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedLectures}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.certificatesEarned} certificates earned
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Hours Learned
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.hoursLearned}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  ~{Math.round(stats.hoursLearned / 7)} hrs/week
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Learning Streak
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.streak}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {stats.streak > 0 ? "Keep it up!" : "Start today!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Continue Learning Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Continue Learning
                </h2>
                {userProgress.length > 3 && (
                  <Link
                    href="/progress"
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    View all →
                  </Link>
                )}
              </div>
            </div>
            <div className="p-6">
              {userProgress.length > 0 ? (
                <div className="space-y-4">
                  {userProgress.slice(0, 3).map((progress: any) => (
                    <div
                      key={progress._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpenIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {progress.courseId.title}
                            {/* This would be populated from course data */}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {progress.progressPercentage}% complete
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                                progress.progressPercentage
                              )}`}
                              style={{
                                width: `${progress.progressPercentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/courses/${progress.courseId?.slug}/learn`}
                        className="ml-4 btn-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Continue
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpenIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No courses yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start your learning journey today!
                  </p>
                  <Link href="/courses" className="btn-primary">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recommended for You
              </h2>
              <Link
                href="/courses"
                className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
              >
                View all courses
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {recentCourses.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentCourses.slice(0, 3).map((course) => (
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
                          Learn More
                          <ArrowRightIcon className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

        {/* Motivational Section */}
        {stats.totalCourses > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  🎯 You&apos;re doing great!
                </h2>
                <p className="text-blue-100">
                  You&apos;ve completed {stats.completedLectures} lectures and
                  earned {stats.certificatesEarned} certificate
                  {stats.certificatesEarned !== 1 ? "s" : ""}.
                  {stats.streak > 0 &&
                    ` Your ${stats.streak}-day streak is impressive!`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {stats.averageProgress}%
                </div>
                <p className="text-sm text-blue-100">Average Progress</p>
              </div>
            </div>
            {stats.averageProgress < 100 && (
              <div className="mt-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur text-white rounded-lg hover:bg-opacity-30 transition-all"
                >
                  Continue Learning
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
