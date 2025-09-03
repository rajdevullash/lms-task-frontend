import Link from "next/link";
import { PencilIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Lecture } from "@/types";

export default function LectureItem({
  lecture,
  courseSlug,
  moduleSlug,
}: {
  lecture: Lecture;
  courseSlug: string;
  moduleSlug: string;
}) {
  return (
    <div className="flex justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
          <span className="text-xs">{lecture.order}</span>
        </div>
        <PlayIcon className="h-4 w-4 text-gray-400" />
        <div>
          <h4 className="font-medium">{lecture.title}</h4>
          <p className="text-sm text-gray-500">
            {lecture.pdfNotes?.length || 0} PDF notes
          </p>
        </div>
      </div>
      <Link
        href={`/admin/courses/${courseSlug}/modules/${moduleSlug}/lectures/${lecture.slug}/edit`}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
      >
        <PencilIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
