/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { courseApi, progressApi } from "@/services/api";
import { Lecture, Module } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { getYouTubeEmbedUrl, downloadFile } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  LockClosedIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function CourseLearnPage() {
  const [course, setCourse] = useState<any | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const { isAuthenticated } = useAuth();
  const params = useParams();
  const courseSlug = params.slug as string;

  useEffect(() => {
    if (courseSlug && isAuthenticated) {
      fetchCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug, isAuthenticated]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);

      // Fetch course with progress and lectures
      const courseResponse = await courseApi.getWithProgress(courseSlug);
      const courseData = courseResponse.data.data;

      console.log("course data", courseData);

      setCourse(courseData);
      setModules(courseData.modules || []);
      setLectures(courseData.lectures || []);

      // Set current lecture (from progress or first available)
      const currentLectureId = courseData.progress?.currentLecture;
      if (currentLectureId) {
        const lecture = courseData.lectures?.find(
          (l) => l._id === currentLectureId
        );
        setCurrentLecture(lecture || null);
      } else if (courseData.lectures && courseData.lectures.length > 0) {
        // Find first unlocked lecture
        const firstUnlocked = courseData.lectures.find((l) => !l.isLocked);
        setCurrentLecture(firstUnlocked || courseData.lectures[0]);
      }

      // Expand modules that have the current lecture
      if (currentLectureId) {
        const lecture = courseData.lectures?.find(
          (l) => l._id === currentLectureId
        );
        if (lecture) {
          setExpandedModules(new Set([lecture.moduleId]));
        }
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error("Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const handleLectureSelect = async (lecture: Lecture) => {
    if (lecture.isLocked) {
      toast.error(lecture.lockReason || "This lecture is locked");
      return;
    }

    setCurrentLecture(lecture);
    setSidebarOpen(false);

    // Update current lecture in progress
    if (course) {
      try {
        await progressApi.updateCurrentLecture({
          courseId: course.course._id,
          lectureId: lecture._id,
        });
      } catch (error) {
        console.error("Error updating current lecture:", error);
      }
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLecture || !course) return;

    try {
      const response = await progressApi.markLectureComplete({
        courseId: course.course._id,
        lectureId: currentLecture._id,
      });

      console.log("Mark complete response:", response);

      const { nextLecture } = response.data.data;

      setLectures((prevLectures) =>
        prevLectures.map((lecture) => {
          if (lecture._id === currentLecture._id) {
            return { ...lecture, isCompleted: true };
          }
          if (nextLecture && lecture._id === nextLecture._id) {
            return { ...lecture, isLocked: false }; // 🔓 unlock next
          }
          return lecture;
        })
      );

      // Auto move to next lecture
      if (nextLecture) {
        setCurrentLecture({
          ...nextLecture,
          isLocked: false, // ensure unlocked in state
        });
      }

      toast.success("Lecture marked as complete!");
    } catch (error) {
      console.error("Error marking lecture complete:", error);
      toast.error("Failed to mark lecture as complete");
    }
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const filteredLectures = lectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrentLectureIndex = () => {
    return lectures.findIndex((l) => l._id === currentLecture?._id);
  };

  const goToPreviousLecture = () => {
    const currentIndex = getCurrentLectureIndex();
    if (currentIndex > 0) {
      const prevLecture = lectures[currentIndex - 1];
      if (!prevLecture.isLocked) {
        handleLectureSelect(prevLecture);
      }
    }
  };

  const goToNextLecture = () => {
    const currentIndex = getCurrentLectureIndex();
    if (currentIndex < lectures.length - 1) {
      const nextLecture = lectures[currentIndex + 1];
      if (!nextLecture.isLocked) {
        handleLectureSelect(nextLecture);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to access this course.
          </p>
          <Link href="/auth/login" className="btn-primary">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!course || !currentLecture) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Course Not Available</h1>
          <Link href="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 truncate">
                {course.title}
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="mt-4 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Modules & Lectures */}
          <div className="flex-1 overflow-y-auto">
            {searchTerm ? (
              // Search Results
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Search Results ({filteredLectures.length})
                </h3>
                <div className="space-y-2">
                  {filteredLectures.map((lecture) => (
                    <button
                      key={lecture._id}
                      onClick={() => handleLectureSelect(lecture)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentLecture?._id === lecture._id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "hover:bg-gray-50"
                      } ${
                        lecture.isLocked ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {lecture.isLocked ? (
                            <LockClosedIcon className="h-4 w-4 text-gray-400" />
                          ) : lecture.isCompleted ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <PlayIcon className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="text-sm font-medium truncate">
                            {lecture.title}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Modules View
              <div className="p-4 space-y-2">
                {modules.map((module) => {
                  const moduleLectures = lectures.filter(
                    (l: any) => l.moduleId._id === module._id
                  );
                  const isExpanded = expandedModules.has(module._id);

                  return (
                    <div key={module._id}>
                      <button
                        onClick={() => toggleModuleExpansion(module._id)}
                        className="w-full flex items-center justify-between p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {module.moduleNumber}. {module.title}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {moduleLectures.length} lectures
                          </p>
                        </div>
                        <ChevronRightIcon
                          className={`h-4 w-4 text-gray-400 transform transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="mt-2 ml-4 space-y-1">
                          {moduleLectures.map((lecture) => (
                            <button
                              key={lecture._id}
                              onClick={() => handleLectureSelect(lecture)}
                              className={`w-full text-left p-2 rounded-lg transition-colors ${
                                currentLecture?._id === lecture._id
                                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                                  : "hover:bg-gray-50"
                              } ${
                                lecture.isLocked
                                  ? "opacity-60 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                {lecture.isLocked ? (
                                  <LockClosedIcon className="h-4 w-4 text-gray-400" />
                                ) : lecture.isCompleted ? (
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                ) : (
                                  <PlayIcon className="h-4 w-4 text-blue-500" />
                                )}
                                <span className="text-sm truncate">
                                  {lecture.order}. {lecture.title}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-black text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-800"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <Link
              href="/dashboard"
              className="p-2 rounded-md hover:bg-gray-800"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold truncate">{currentLecture.title}</h1>
              <p className="text-sm text-gray-400">{course.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousLecture}
              disabled={getCurrentLectureIndex() === 0}
              className="p-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextLecture}
              disabled={getCurrentLectureIndex() === lectures.length - 1}
              className="p-2 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            {!currentLecture.isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {currentLecture.videoUrl ? (
            <div className="w-full h-full">
              <iframe
                src={getYouTubeEmbedUrl(currentLecture.videoUrl)}
                title={currentLecture.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <div className="text-white text-center">
              <PlayIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">
                Video not available
              </h3>
              <p className="text-gray-400">
                This lecture doesn&apos;t have a video yet.
              </p>
            </div>
          )}
        </div>

        {/* Resources Section */}
        {currentLecture.pdfNotes && currentLecture.pdfNotes.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Lecture Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentLecture.pdfNotes.map((note, index) => (
                <button
                  key={index}
                  onClick={() =>
                    downloadFile(
                      note.secure_url,
                      `${currentLecture.title}-note-${index + 1}.pdf`
                    )
                  }
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <DocumentArrowDownIcon className="h-4 w-4" />
                  <span>Download PDF {index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
