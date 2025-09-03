import Link from "next/link";
import {
  PlayIcon,
  CheckCircleIcon,
  BookOpenIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: any;
}

const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "from-green-400 to-green-600";
  if (percentage >= 50) return "from-yellow-400 to-yellow-600";
  return "from-blue-400 to-blue-600";
};

const getProgressTextColor = (percentage: number) => {
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 50) return "text-yellow-600";
  return "text-blue-600";
};

export default function ProgressCard({ progress }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {progress.courseId.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                {progress.completedLectures.length} lectures completed
              </span>
              <span>•</span>
              <span>Last accessed {formatDate(progress.lastAccessed)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${getProgressTextColor(
                  progress.progressPercentage
                )}`}
              >
                {Math.round(progress.progressPercentage)}%
              </div>
              <p className="text-xs text-gray-500">Complete</p>
            </div>

            {progress.progressPercentage < 100 ? (
              <Link
                href={`/courses/${progress.courseId.slug}/learn`}
                className="btn-primary flex items-center"
              >
                <PlayIcon className="h-4 w-4 mr-2" /> Continue
              </Link>
            ) : (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircleIcon className="h-4 w-4 mr-2" /> Completed
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(
              progress.progressPercentage
            )} transition-all duration-500`}
            style={{ width: `${progress.progressPercentage}%` }}
          />
        </div>

        {/* Progress Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              Progress: {Math.round(progress.progressPercentage)}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <PlayIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              {progress.completedLectures.length} lectures done
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              Last: {formatDate(progress.lastAccessed)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
