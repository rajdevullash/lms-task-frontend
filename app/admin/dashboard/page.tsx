"use client";

import { useEffect, useState } from "react";
import { courseApi } from "@/services/api";
import { Course } from "@/types";
import DashboardHeader from "@/components/admin/DashboardHeader";
import StatsGrid from "@/components/admin/StatsGrid";
import RecentCourses from "@/components/admin/RecentCourses";
import QuickActions from "@/components/admin/QuickActions";

interface Stats {
  totalCourses: number;
}

export default function AdminDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({ totalCourses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getAll({ limit: 6 });
      setCourses(response.data.data);
      setStats({ totalCourses: response.data.meta?.total || 0 });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <StatsGrid stats={stats} />
      <RecentCourses courses={courses} />
      <QuickActions />
    </div>
  );
}
