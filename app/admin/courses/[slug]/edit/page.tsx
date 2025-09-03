/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { courseApi } from "@/services/api";
import { Course } from "@/types";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface CourseFormData {
  title: string;
  description: string;
  price: string;
  thumbnail?: FileList;
}

export default function EditCoursePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>();

  const thumbnailFile = watch("thumbnail");

  useEffect(() => {
    if (courseSlug) {
      fetchCourse();
    }
  }, [courseSlug]);

  useEffect(() => {
    if (thumbnailFile && thumbnailFile.length > 0) {
      const file = thumbnailFile[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [thumbnailFile]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getById(courseSlug);
      const courseData = response.data.data;

      setCourse(courseData);

      // Populate form with existing data
      setValue("title", courseData.title);
      setValue("description", courseData.description);
      setValue("price", courseData.price);

      // Set existing thumbnail as preview
      if (courseData.thumbnail?.[0]?.secure_url) {
        setPreviewUrl(courseData.thumbnail[0].secure_url);
      }
    } catch (error: any) {
      toast.error("Failed to fetch course details");
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    if (!course) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);

      if (data.thumbnail && data.thumbnail.length > 0) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      await courseApi.update(course.slug, formData);
      toast.success("Course updated successfully!");
      router.push("/admin/courses");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update course");
      console.error("Error updating course:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!course) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this course? This action cannot be undone and will also delete all modules and lectures associated with this course."
    );

    if (!confirmed) return;

    try {
      await courseApi.delete(course.slug);
      toast.success("Course deleted successfully!");
      router.push("/admin/courses");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete course");
      console.error("Error deleting course:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Course Not Found
        </h1>
        <Link href="/admin/courses" className="btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/courses"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-600">Update course information</p>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Delete Course
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Course Title */}
          <div>
            <label htmlFor="title" className="label">
              Course Title *
            </label>
            <input
              type="text"
              id="title"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              className="input"
              placeholder="Enter course title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Course Description */}
          <div>
            <label htmlFor="description" className="label">
              Course Description *
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              className="input"
              placeholder="Enter course description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Course Price */}
          <div>
            <label htmlFor="price" className="label">
              Course Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              id="price"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              className="input"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Course Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className="label">
              Course Thumbnail
            </label>
            <div className="mt-1">
              {previewUrl && (
                <div className="mb-4">
                  <img
                    src={previewUrl}
                    alt="Current thumbnail"
                    className="h-32 w-48 object-cover rounded-lg border border-gray-300"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Current thumbnail
                  </p>
                </div>
              )}

              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                <div className="space-y-2 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="thumbnail"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload new thumbnail</span>
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        {...register("thumbnail")}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <Link href="/admin/courses" className="btn-outline">
              Cancel
            </Link>

            <div className="flex space-x-3">
              <Link
                href={`/admin/courses/${course.slug}/modules`}
                className="btn-secondary"
              >
                Manage Modules
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? "Updating..." : "Update Course"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Course Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Course Information:
        </h3>
        <div className="text-sm text-blue-800 grid grid-cols-1 md:grid-cols-2 gap-2">
          <p>• Created: {new Date(course.createdAt).toLocaleDateString()}</p>
          <p>
            • Last updated: {new Date(course.updatedAt).toLocaleDateString()}
          </p>
          <p>• Course ID: {course._id}</p>
          <p>• Slug: {course.slug}</p>
        </div>
      </div>
    </div>
  );
}
