"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { courseApi, moduleApi, lectureApi } from "@/services/api";
import { Course, Module } from "@/types";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { getYouTubeEmbedUrl, isValidUrl } from "@/lib/utils";

interface LectureFormData {
  title: string;
  videoUrl: string;
  pdfNotes: FileList;
  order: number;
}

export default function CreateLecturePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const params = useParams();
  const router = useRouter();

  const courseSlug = params.slug as string;
  const moduleSlug = params.moduleSlug as string;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LectureFormData>();

  const videoUrl = watch("videoUrl");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, moduleSlug]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch course and module details
      const [courseResponse, moduleResponse] = await Promise.all([
        courseApi.getById(courseSlug),
        // Note: You'll need to implement moduleApi.getBySlug or use a different approach
        moduleApi.getAll(courseSlug), // Get all modules and filter by slug
      ]);

      console.log(courseResponse.data);
      console.log(moduleResponse.data);

      setCourse(courseResponse.data.data);

      // Find the specific module by slug
      const targetModule = moduleResponse.data.data.find(
        (m) => m.slug === moduleSlug
      );
      setModule(targetModule || null);
    } catch (error) {
      toast.error("Failed to fetch course data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: LectureFormData) => {
    if (!course || !module) {
      toast.error("Course or module not found");
      return;
    }

    if (!isValidUrl(data.videoUrl)) {
      toast.error("Please enter a valid video URL");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("videoUrl", data.videoUrl);
      formData.append("moduleId", module._id);
      formData.append("courseId", course._id);

      // Add PDF files
      selectedFiles.forEach((file) => {
        formData.append("pdfNotes", file);
      });

      await lectureApi.create(formData);
      toast.success("Lecture created successfully!");
      router.push(`/admin/courses/${courseSlug}/modules`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create lecture");
      console.error("Error creating lecture:", error);
    } finally {
      setSubmitting(false);
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

  if (!course || !module) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Course or Module Not Found
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
      <div className="flex items-center space-x-4">
        <Link
          href={`/admin/courses/${courseSlug}/modules`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Lecture
          </h1>
          <p className="text-gray-600">
            {course.title} → {module.title}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Lecture Title */}
          <div>
            <label htmlFor="title" className="label">
              Lecture Title *
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
              placeholder="Enter lecture title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
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
              {...register("videoUrl", {
                required: "Video URL is required",
              })}
              className="input"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.videoUrl && (
              <p className="mt-1 text-sm text-red-600">
                {errors.videoUrl.message}
              </p>
            )}

            {/* Video Preview */}
            {videoUrl && isValidUrl(videoUrl) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    src={getYouTubeEmbedUrl(videoUrl)}
                    title="Video preview"
                    className="w-full h-64 rounded-lg"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* PDF Notes Upload */}
          <div>
            <label className="label">PDF Notes</label>
            <div className="mt-1">
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="pdfNotes"
              />
              <label
                htmlFor="pdfNotes"
                className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
              >
                <div className="space-y-2 text-center">
                  <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600 hover:text-blue-500">
                      Upload PDF files
                    </span>
                    <p>or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF files up to 10MB each
                  </p>
                </div>
              </label>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Selected Files:
                </p>
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <DocumentIcon className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              href={`/admin/courses/${courseSlug}/modules`}
              className="btn-outline"
            >
              Cancel
            </Link>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Creating..." : "Create Lecture"}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Tips for creating engaging lectures:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Use descriptive titles that clearly indicate what students will
            learn
          </li>
          <li>• YouTube videos work best - just paste the full URL</li>
          <li>
            • Upload relevant PDF notes, slides, or resources for each lecture
          </li>
          <li>
            • Keep lectures focused on one main topic for better learning
            outcomes
          </li>
        </ul>
      </div>
    </div>
  );
}
