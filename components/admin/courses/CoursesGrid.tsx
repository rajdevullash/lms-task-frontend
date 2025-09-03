import { Course } from "@/types";
import CourseCard from "./CourseCard";

interface Props {
  courses: Course[];
  onEdit: (slug: string) => void;
  onViewModules: (slug: string) => void;
  onDelete: (id: string, slug: string) => void;
  deleting: string | null;
}

export default function CoursesGrid({
  courses,
  onEdit,
  onViewModules,
  onDelete,
  deleting,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          onEdit={onEdit}
          onViewModules={onViewModules}
          onDelete={onDelete}
          deleting={deleting}
        />
      ))}
    </div>
  );
}
