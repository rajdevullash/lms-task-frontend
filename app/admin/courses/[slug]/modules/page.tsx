/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-assign-module-variable */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { courseApi, moduleApi, lectureApi } from "@/services/api";
import { Course, Module, Lecture } from "@/types";
import { toast } from "react-hot-toast";
import LoadingSkeleton from "@/components/admin/module/LoadingSkeleton";
import CourseModulesHeader from "@/components/admin/module/CourseModulesHeader";
import ModuleCard from "@/components/admin/module/ModuleCard";
import EmptyModules from "@/components/admin/module/EmptyModules";
import CreateModuleModal from "@/components/admin/module/CreateModuleModal";
import EditModuleModal from "@/components/EditModuleModal";

export default function CourseModulesPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lectures, setLectures] = useState<Record<string, Lecture[]>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const params = useParams();
  const courseSlug = params.slug as string;

  useEffect(() => {
    if (courseSlug) {
      fetchCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const courseResponse = await courseApi.getById(courseSlug);
      setCourse(courseResponse.data.data);

      const modulesResponse = await moduleApi.getAll(
        courseResponse.data.data._id
      );
      setModules(modulesResponse.data.data);

      const lecturesData: Record<string, Lecture[]> = {};
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId: string, moduleSlug: string) => {
    if (!confirm("Delete this module? All lectures will also be deleted."))
      return;
    try {
      await moduleApi.delete(moduleSlug);
      setModules(modules.filter((m) => m._id !== moduleId));
      const newLectures = { ...lectures };
      delete newLectures[moduleId];
      setLectures(newLectures);
      toast.success("Module deleted successfully");
    } catch {
      toast.error("Failed to delete module");
    }
  };

  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <CourseModulesHeader
            course={course}
            onAddModule={() => setShowCreateModal(true)}
          />

          {modules.length > 0 ? (
            <div className="space-y-6">
              {modules.map((m) => (
                <ModuleCard
                  key={m._id}
                  module={m}
                  courseSlug={courseSlug}
                  lectures={lectures[m._id] || []}
                  onDelete={handleDeleteModule}
                  onUpdateModule={(updatedModule) => {
                    setModules(
                      modules.map((m) =>
                        m._id === updatedModule._id ? updatedModule : m
                      )
                    );
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyModules onCreate={() => setShowCreateModal(true)} />
          )}
        </>
      )}

      {showCreateModal && course && (
        <CreateModuleModal
          courseId={course._id}
          onClose={() => setShowCreateModal(false)}
          onCreated={(newModule) => setModules([...modules, newModule])}
        />
      )}
    </div>
  );
}
