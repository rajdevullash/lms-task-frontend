/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { lectureApi } from "@/services/api";
import { Lecture } from "@/types";
import LectureForm from "@/components/lectures/LectureForm";

export default function EditLecturePage() {
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const { lectureSlug, slug } = params as { lectureSlug: string; slug: string };

  useEffect(() => {
    if (lectureSlug) fetchLecture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureSlug]);

  const fetchLecture = async () => {
    try {
      setLoading(true);
      const response = await lectureApi.getById(lectureSlug);
      setLecture(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch lecture details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!lecture) return;
    const confirmed = window.confirm("Delete this lecture permanently?");
    if (!confirmed) return;

    try {
      await lectureApi.delete(lectureSlug);
      toast.success("Lecture deleted successfully!");
      router.push(`/admin/courses/${slug}/modules`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete lecture");
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
            {[...Array(3)].map((_, i) => (
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
  if (!lecture) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Lecture Not Found
        </h1>
        <Link href="/admin/courses" className="btn-primary">
          Back to course
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
            href={`/admin/courses/${slug}/modules`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Lecture</h1>
            <p className="text-gray-600">Update lecture information</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Delete Lecture
        </button>
      </div>

      {/* Form */}
      <LectureForm lecture={lecture} slug={slug} lectureSlug={lectureSlug} />
    </div>
  );
}
