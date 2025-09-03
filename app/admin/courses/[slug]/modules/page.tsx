/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { courseApi, moduleApi, lectureApi } from "@/services/api";
import { Course, Module, Lecture } from "@/types";
import { toast } from "react-hot-toast";
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

export default function CourseModulesPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lectures, setLectures] = useState<Record<string, Lecture[]>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.slug as string;

  useEffect(() => {
    if (courseSlug) {
      fetchCourseData();
    }
  }, [courseSlug]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course details
      const courseResponse = await courseApi.getById(courseSlug);
      setCourse(courseResponse.data.data);

      // Fetch modules for this course
      const modulesResponse = await moduleApi.getAll(
        courseResponse.data.data._id
      );
      setModules(modulesResponse.data.data);

      // Fetch lectures for each module
      const lecturesData: Record<string, Lecture[]> = {};
      // eslint-disable-next-line @next/next/no-assign-module-variable
      for (const module of modulesResponse.data.data) {
        const lecturesResponse = await lectureApi.getAll({
          courseId: courseResponse.data.data._id,
          moduleId: module._id,
        });
        lecturesData[module._id] = lecturesResponse.data.data;
      }
      setLectures(lecturesData);
    } catch (error) {
      toast.error("Failed to fetch course data");
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async () => {
    if (!newModuleTitle.trim() || !course) return;

    setCreating(true);
    try {
      const response = await moduleApi.create({
        title: newModuleTitle,
        courseId: course._id,
      });

      setModules([...modules, response.data.data]);
      setNewModuleTitle("");
      setShowCreateModal(false);
      toast.success("Module created successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create module");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteModule = async (moduleId: string, moduleSlug: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this module? This will also delete all lectures in this module."
      )
    ) {
      return;
    }

    try {
      await moduleApi.delete(moduleSlug);
      setModules(modules.filter((m) => m._id !== moduleId));
      // Remove lectures for this module
      const newLectures = { ...lectures };
      delete newLectures[moduleId];
      setLectures(newLectures);
      toast.success("Module deleted successfully");
    } catch (error) {
      toast.error("Failed to delete module");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 bg-gray-200 rounded w-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900">
              {course?.title} - Modules & Lectures
            </h1>
            <p className="text-gray-600">Manage course content structure</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Module
        </button>
      </div>

      {/* Modules List */}
      {modules.length > 0 ? (
        <div className="space-y-6">
          {modules.map((module, _index) => (
            <div
              key={module._id}
              className="bg-white rounded-lg shadow-sm border"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {module.moduleNumber}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {lectures[module._id]?.length || 0} lectures
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/courses/${courseSlug}/modules/${module.slug}/lectures/new`}
                      className="btn-outline flex items-center text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Lecture
                    </Link>
                    <button
                      onClick={() =>
                        handleDeleteModule(module._id, module.slug)
                      }
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lectures */}
              <div className="p-6">
                {lectures[module._id]?.length > 0 ? (
                  <div className="space-y-3">
                    {lectures[module._id].map((lecture, lectureIndex) => (
                      <div
                        key={lecture._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                            <span className="text-gray-600 text-xs font-medium">
                              {lecture.order}
                            </span>
                          </div>
                          <PlayIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {lecture.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {lecture.pdfNotes?.length || 0} PDF notes
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/lectures/${lecture.slug}/edit`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      No lectures yet
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Add your first lecture to this module
                    </p>
                    <Link
                      href={`/admin/courses/${courseSlug}/modules/${module.slug}/lectures/new`}
                      className="btn-primary"
                    >
                      Add Lecture
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <AcademicCapIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No modules yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start structuring your course by creating your first module
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            Create First Module
          </button>
        </div>
      )}

      {/* Create Module Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Module
            </h3>
            <div className="space-y-4">
              <div>
                <label className="label">Module Title</label>
                <input
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="Enter module title"
                  className="input"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !creating) {
                      handleCreateModule();
                    }
                  }}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewModuleTitle("");
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateModule}
                  disabled={creating || !newModuleTitle.trim()}
                  className="btn-primary"
                >
                  {creating ? "Creating..." : "Create Module"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
