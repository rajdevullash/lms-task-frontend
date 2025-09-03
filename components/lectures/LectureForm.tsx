"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { getYouTubeEmbedUrl, isValidUrl } from "@/lib/utils";
import { lectureApi } from "@/services/api";
import { Lecture } from "@/types";
import LecturePdfList from "./LecturePdfList";
import LectureFileUpload from "./LectureFileUpload";

interface LectureFormProps {
  lecture: Lecture;
  slug: string;
  lectureSlug: string;
}

interface LectureFormData {
  title: string;
  videoUrl: string;
}

export default function LectureForm({
  lecture,
  slug,
  lectureSlug,
}: LectureFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LectureFormData>({
    defaultValues: {
      title: lecture.lecture.title,
      videoUrl: lecture.lecture.videoUrl,
    },
  });

  const videoUrl = watch("videoUrl");

  const onSubmit = async (data: LectureFormData) => {
    if (!isValidUrl(data.videoUrl)) {
      toast.error("Please enter a valid video URL");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("videoUrl", data.videoUrl);

      selectedFiles.forEach((file) => {
        formData.append("pdfNotes", file);
      });

      await lectureApi.update(lectureSlug, formData);
      toast.success("Lecture updated successfully!");
      router.push(`/admin/courses/${slug}/modules`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update lecture");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 space-y-6 bg-white rounded-lg shadow-sm border"
    >
      {/* Title */}
      <div>
        <label htmlFor="title" className="label">
          Lecture Title *
        </label>
        <input
          type="text"
          id="title"
          {...register("title", {
            required: "Title is required",
            minLength: 3,
          })}
          className="input"
          placeholder="Enter lecture title"
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Video URL */}
      <div>
        <label htmlFor="videoUrl" className="label">
          Video URL *
        </label>
        <input
          type="url"
          id="videoUrl"
          {...register("videoUrl", { required: "Video URL is required" })}
          className="input"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {errors.videoUrl && (
          <p className="text-sm text-red-600">{errors.videoUrl.message}</p>
        )}

        {videoUrl && isValidUrl(videoUrl) && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              title="Video preview"
              className="w-full h-64 rounded-lg"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Existing PDFs */}
      <LecturePdfList lecture={lecture} />

      {/* File Upload */}
      <LectureFileUpload
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
      />

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline"
        >
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Updating..." : "Update Lecture"}
        </button>
      </div>
    </form>
  );
}
