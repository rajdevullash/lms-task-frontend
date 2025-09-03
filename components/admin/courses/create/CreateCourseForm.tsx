/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { courseApi } from "@/services/api";
import CourseThumbnailUpload from "./CourseThumbnailUpload";

interface CourseFormData {
  title: string;
  description: string;
  price: string;
  thumbnail: FileList;
}

export default function CreateCourseForm() {
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

  // Preview logic
  useEffect(() => {
    if (thumbnailFile?.[0]) {
      const file = thumbnailFile[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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

      if (data.thumbnail?.[0]) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      await courseApi.create(formData);
      toast.success("Course created successfully!");
      router.push("/admin/courses");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create course");
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="label">Course Title *</label>
          <input
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
            className="input"
            placeholder="Enter course title"
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="label">Course Description *</label>
          <textarea
            rows={4}
            {...register("description", {
              required: "Description is required",
              minLength: { value: 10, message: "At least 10 characters" },
            })}
            className="input"
            placeholder="Enter course description"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="label">Course Price ($) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            className="input"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Thumbnail */}
        <CourseThumbnailUpload
          previewUrl={previewUrl}
          register={register}
          error={errors.thumbnail?.message}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Link href="/admin/courses" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
