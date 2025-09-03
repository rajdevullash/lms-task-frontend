"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { progressApi } from "@/services/api";
import { Progress } from "@/types";
import Navbar from "@/components/Navbar";
import ProgressEmpty from "@/components/user/progress/ProgressEmpty";
import ProgressSkeleton from "@/components/user/progress/ProgressSkeleton";
import ProgressHeader from "@/components/user/progress/ProgressHeader";
import ProgressStats from "@/components/user/progress/ProgressStats";
import ProgressSummary from "@/components/user/progress/ProgressSummary";
import ProgressList from "@/components/user/progress/ProgressList";
import ProgressTips from "@/components/user/progress/ProgressTips";

export default function ProgressPage() {
  const { isAuthenticated } = useAuth();
  const [userProgress, setUserProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    completedLectures: 0,
    totalHours: 0,
  });

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

      // Stats
      const totalCourses = progressData.length;
      const completedCourses = progressData.filter(
        (p) => p.progressPercentage === 100
      ).length;
      const completedLectures = progressData.reduce(
        (sum, p) => sum + (p.completedLectures?.length || 0),
        0
      );
      const totalHours = Math.floor(completedLectures * 0.5); // 30 min per lecture

      setStats({
        totalCourses,
        completedCourses,
        completedLectures,
        totalHours,
      });
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <ProgressEmpty unauthorized />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ProgressSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProgressHeader />
        <ProgressStats stats={stats} />
        <ProgressSummary stats={stats} />

        {userProgress.length > 0 ? (
          <>
            <ProgressList userProgress={userProgress} />
            <ProgressTips />
          </>
        ) : (
          <ProgressEmpty />
        )}
      </div>
    </div>
  );
}
