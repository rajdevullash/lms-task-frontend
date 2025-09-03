/* eslint-disable @next/next/no-img-element */
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { formatPrice, formatDate } from "@/lib/utils";
import { Course } from "@/types";

interface Props {
  course: Course;
  onEdit: (slug: string) => void;
  onViewModules: (slug: string) => void;
  onDelete: (id: string, slug: string) => void;
  deleting: string | null;
}

export default function CourseCard({
  course,
  onEdit,
  onViewModules,
  onDelete,
  deleting,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={course.thumbnail?.[0]?.secure_url || "/placeholder-course.jpg"}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(course.price)}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(course.createdAt)}
          </span>
        </div>

        <div className="flex justify-between items-center space-x-2">
          <button
            onClick={() => onViewModules(course.slug)}
            className="flex items-center text-blue-600 hover:text-blue-500 text-sm"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Modules
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(course.slug)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit course"
            >
              <PencilIcon className="h-4 w-4" />
            </button>

            <button
              onClick={() => onDelete(course._id, course.slug)}
              disabled={deleting === course._id}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Delete course"
            >
              {deleting === course._id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
