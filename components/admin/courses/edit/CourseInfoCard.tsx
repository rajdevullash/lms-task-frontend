import { Course } from "@/types";

export default function CourseInfoCard({ course }: { course: Course }) {
  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-blue-900 mb-2">
        Course Information:
      </h3>
      <div className="text-sm text-blue-800 grid grid-cols-1 md:grid-cols-2 gap-2">
        <p>• Created: {new Date(course.createdAt).toLocaleDateString()}</p>
        <p>• Last updated: {new Date(course.updatedAt).toLocaleDateString()}</p>
        <p>• Course ID: {course._id}</p>
        <p>• Slug: {course.slug}</p>
      </div>
    </div>
  );
}
