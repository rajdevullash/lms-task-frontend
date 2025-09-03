/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { courseApi } from "@/services/api";
import { Course } from "@/types";
import CoursesSkeleton from "@/components/admin/courses/CoursesSkeleton";
import CoursesHeader from "@/components/admin/courses/CoursesHeader";
import CoursesSearch from "@/components/admin/courses/CoursesSearch";
import CoursesGrid from "@/components/admin/courses/CoursesGrid";
import EmptyState from "@/components/admin/courses/EmptyState";

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
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchCourses(term);
  };

  const handleDelete = async (courseId: string, courseSlug: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    setDeleting(courseId);
    try {
      await courseApi.delete(courseSlug);
      setCourses(courses.filter((course) => course._id !== courseId));
      toast.success("Course deleted successfully");
    } catch {
      toast.error("Failed to delete course");
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

  if (loading) return <CoursesSkeleton />;

  return (
    <div className="space-y-6">
      <CoursesHeader />
      <CoursesSearch onSearch={handleSearch} />
      {courses.length > 0 ? (
        <CoursesGrid
          courses={courses}
          onEdit={handleEdit}
          onViewModules={handleViewModules}
          onDelete={handleDelete}
          deleting={deleting}
        />
      ) : (
        <EmptyState searchTerm={searchTerm} />
      )}
    </div>
  );
}
