/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { Course } from "@/types";
import CourseThumbnailUpload from "./CourseThumbnailUpload";

interface Props {
  course: Course;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function CourseForm({ course, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{
    title: string;
    description: string;
    price: string;
    thumbnail?: FileList;
  }>({
    defaultValues: {
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: undefined,
    },
  });

  const thumbnailFile = watch("thumbnail");

  const submitHandler = async (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    if (data.thumbnail?.[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <form onSubmit={handleSubmit(submitHandler)} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="label">Course Title *</label>
          <input {...register("title", { required: true })} className="input" />
          {errors.title && (
            <p className="text-sm text-red-600">Title required</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="label">Course Description *</label>
          <textarea
            {...register("description", { required: true })}
            className="input"
          />
          {errors.description && (
            <p className="text-sm text-red-600">Description required</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="label">Course Price *</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { required: true })}
            className="input"
          />
        </div>

        {/* Thumbnail Upload */}
        <CourseThumbnailUpload
          previewUrl={course.thumbnail?.[0]?.secure_url}
          register={register}
          file={thumbnailFile}
        />

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
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
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? "Updating..." : "Update Course"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
