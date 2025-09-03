/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { courseApi } from "@/services/api";
import { Course } from "@/types";
import {
  BookOpenIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

interface Stats {
  totalCourses: number;
  totalUsers: number;
  totalModules: number;
  totalLectures: number;
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalUsers: 0,
    totalModules: 0,
    totalLectures: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getAll({ limit: 6 });
      console.log(response);
      setCourses(response.data.data);

      // Mock stats for demonstration
      setStats({
        totalCourses: response.data.meta?.total || 0,
        totalUsers: 156,
        totalModules: 45,
        totalLectures: 234,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpenIcon,
      color: "bg-blue-500",
      href: "/admin/courses",
    },
    {
      name: "Total Users",
      value: stats.totalUsers,
      icon: UsersIcon,
      color: "bg-green-500",
      href: "/admin/users",
    },
    {
      name: "Total Modules",
      value: stats.totalModules,
      icon: AcademicCapIcon,
      color: "bg-purple-500",
      href: "/admin/modules",
    },
    {
      name: "Total Lectures",
      value: stats.totalLectures,
      icon: ChartBarIcon,
      color: "bg-orange-500",
      href: "/admin/lectures",
    },
  ];

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Course
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Courses
            </h2>
            <Link
              href="/admin/courses"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h3 className="font-medium text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-blue-600">
                      ${course.price}
                    </span>
                    <Link
                      href={`/admin/courses/${course.slug}`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/courses/new"
              className="flex items-center text-blue-600 hover:text-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Course
            </Link>
            <Link
              href="/admin/modules"
              className="flex items-center text-blue-600 hover:text-blue-500"
            >
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              Manage Modules
            </Link>
            <Link
              href="/admin/lectures"
              className="flex items-center text-blue-600 hover:text-blue-500"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View All Lectures
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• New user registration: john@example.com</p>
            <p>• Course &quot;React Fundamentals&quot; was updated</p>
            <p>• 15 lectures completed today</p>
            <p>• New module added to &quot;Node.js Basics&quot;</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            System Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Server Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Storage</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                75% Used
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
