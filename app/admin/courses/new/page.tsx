/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { courseApi } from "@/services/api";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect } from "react";
interface CourseFormData {
  title: string;
  description: string;
  price: string;
  thumbnail: FileList;
}

export default function CreateCoursePage() {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>();

  const thumbnailFile = watch("thumbnail");

  // Handle thumbnail preview
  
  useEffect(() => {
    if (thumbnailFile && thumbnailFile.length > 0) {
      const file = thumbnailFile[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // Cleanup URL on unmount
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [thumbnailFile]);

  const onSubmit = async (data: CourseFormData) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);

      if (data.thumbnail && data.thumbnail.length > 0) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      await courseApi.create(formData);
      toast.success("Course created successfully!");
      router.push("/admin/courses");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create course");
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/courses"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-600">Add a new course to your platform</p>
        </div>
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
              Course Thumbnail *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
              <div className="space-y-2 text-center">
                {previewUrl ? (
                  <div className="mb-4">
                    <img
                      src={previewUrl}
                      alt="Thumbnail preview"
                      className="mx-auto h-32 w-48 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}

                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="thumbnail"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      {...register("thumbnail", {
                        required: "Thumbnail is required",
                      })}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </div>
            {errors.thumbnail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link href="/admin/courses" className="btn-outline">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Tips for creating a great course:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Use a clear, descriptive title that tells students what they&apos;ll
            learn
          </li>
          <li>
            • Write a compelling description that highlights the value and
            outcomes
          </li>
          <li>
            • Choose an eye-catching thumbnail that represents your course
            content
          </li>
          <li>
            • Price your course competitively based on the value you provide
          </li>
        </ul>
      </div>
    </div>
  );
}
