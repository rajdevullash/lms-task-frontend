"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { progressApi } from "@/services/api";
import { Progress } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  BookOpenIcon,
  ChartBarIcon,
  TrophyIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ProgressPage() {
  const [userProgress, setUserProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLectures: 0,
    completedLectures: 0,
    totalHours: 0,
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProgressData();
    }
  }, [isAuthenticated]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await progressApi.getUserProgress();
      const progressData = response.data.data;

      setUserProgress(progressData);

      // Calculate stats
      const totalCourses = progressData.length;
      const completedCourses = progressData.filter(
        (p) => p.progressPercentage === 100
      ).length;
      const totalLectures = progressData.reduce(
        (sum, p) => sum + (p.completedLectures?.length || 0),
        0
      );
      const completedLectures = totalLectures; // Since we're counting completed lectures
      const totalHours = Math.floor(completedLectures * 0.5); // Assume 30 min per lecture

      setStats({
        totalCourses,
        completedCourses,
        totalLectures,
        completedLectures,
        totalHours,
      });
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "from-green-400 to-green-600";
    if (percentage >= 50) return "from-yellow-400 to-yellow-600";
    return "from-blue-400 to-blue-600";
  };

  const getProgressTextColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-blue-600";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              Please log in to view your progress.
            </p>
            <Link href="/auth/login" className="btn-primary">
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-lg shadow-sm border"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Learning Progress
          </h1>
          <p className="text-gray-600">
            Track your learning journey and celebrate your achievements
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedCourses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <PlayIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Lectures Watched
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedLectures}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Hours Learned
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalHours}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">🎉 Great Progress!</h2>
              <p className="text-blue-100">
                You&apos;ve completed {stats.completedLectures} lectures across{" "}
                {stats.totalCourses} courses. Keep it up!
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {stats.totalCourses > 0
                  ? Math.round(
                      (stats.completedCourses / stats.totalCourses) * 100
                    )
                  : 0}
                %
              </div>
              <p className="text-sm text-blue-100">Overall Completion</p>
            </div>
          </div>
        </div>

        {/* Course Progress */}
        {userProgress.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Course Progress
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {userProgress.map((progress) => (
                <div
                  key={progress._id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Course Title{" "}
                          {/* You'd get this from the populated course data */}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            {progress.completedLectures.length} lectures
                            completed
                          </span>
                          <span>•</span>
                          <span>
                            Last accessed {formatDate(progress.lastAccessed)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${getProgressTextColor(
                              progress.progressPercentage
                            )}`}
                          >
                            {Math.round(progress.progressPercentage)}%
                          </div>
                          <p className="text-xs text-gray-500">Complete</p>
                        </div>

                        {progress.progressPercentage < 100 ? (
                          <Link
                            href={`/courses/${progress.courseId}/learn`}
                            className="btn-primary flex items-center"
                          >
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Continue
                          </Link>
                        ) : (
                          <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Completed
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(
                          progress.progressPercentage
                        )} transition-all duration-500`}
                        style={{ width: `${progress.progressPercentage}%` }}
                      ></div>
                    </div>

                    {/* Progress Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <BookOpenIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Progress: {progress.progressPercentage}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PlayIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {progress.completedLectures.length} lectures done
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          Last: {formatDate(progress.lastAccessed)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No progress yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start learning to see your progress here
            </p>
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        )}

        {/* Learning Tips */}
        {userProgress.length > 0 && (
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              💡 Tips for Better Learning
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Set aside regular time for learning each day</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Take notes and practice what you learn</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Review previous lectures before starting new ones</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Complete courses fully to maximize retention</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
