/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { courseApi } from "@/services/api";
import { Course } from "@/types";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useCourse(slug: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (slug) fetchCourse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await courseApi.getById(slug);
      setCourse(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch course");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData: FormData) => {
    try {
      await courseApi.update(slug, formData);
      toast.success("Course updated successfully!");
      router.push("/admin/courses");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update course");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure? This will delete course and modules")) return;
    try {
      await courseApi.delete(slug);
      toast.success("Course deleted successfully!");
      router.push("/admin/courses");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete course");
    }
  };

  return { course, loading, handleUpdate, handleDelete };
}
