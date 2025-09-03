


"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { progressApi, courseApi } from "@/services/api";
import { Progress, Course } from "@/types";

import {
  BookOpenIcon,
  ClockIcon,
  TrophyIcon,
  UserIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import RecommendedCourses from "@/components/user/dashboard/RecommendedCourses";
import ContinueLearning from "@/components/user/dashboard/ContinueLearning";
import StatsCard from "@/components/user/dashboard/StatsCard";
import { calculateLearningStreak } from "@/components/user/dashboard/utils";



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
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const progressResponse = await progressApi.getUserProgress();
      const progressData = progressResponse.data.data;
      setUserProgress(progressData);

      const coursesResponse = await courseApi.getAllUsers({ limit: 6 });
      setRecentCourses(coursesResponse.data.data);

      const totalCourses = progressData.length;
      const completedLectures = progressData.reduce(
        (sum, p) => sum + (p.completedLectures?.length || 0),
        0
      );
      const averageProgress =
        totalCourses > 0
          ? progressData.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) /
            totalCourses
          : 0;

      const hoursLearned = Math.floor(completedLectures * 0.5);
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<BookOpenIcon className="h-6 w-6 text-blue-600" />}
            title="Enrolled Courses"
            value={stats.totalCourses}
            subtitle={`${stats.averageProgress}% avg progress`}
            color="bg-blue-100"
          />
          <StatsCard
            icon={<TrophyIcon className="h-6 w-6 text-green-600" />}
            title="Completed Lectures"
            value={stats.completedLectures}
            subtitle={`${stats.certificatesEarned} certificates earned`}
            color="bg-green-100"
          />
          <StatsCard
            icon={<ClockIcon className="h-6 w-6 text-purple-600" />}
            title="Hours Learned"
            value={stats.hoursLearned}
            subtitle={`~${Math.round(stats.hoursLearned / 7)} hrs/week`}
            color="bg-purple-100"
          />
          <StatsCard
            icon={<FireIcon className="h-6 w-6 text-orange-600" />}
            title="Learning Streak"
            value={stats.streak}
            subtitle={stats.streak > 0 ? "Keep it up!" : "Start today!"}
            color="bg-orange-100"
          />
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContinueLearning userProgress={userProgress} />
        </div>

        <RecommendedCourses courses={recentCourses} />
      </div>
    </div>
  );
}

