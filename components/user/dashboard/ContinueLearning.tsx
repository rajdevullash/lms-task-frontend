/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { BookOpenIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Progress } from "@/types";
import { getProgressColor } from "./utils";

interface ContinueLearningProps {
  userProgress: Progress[];
}

export default function ContinueLearning({
  userProgress,
}: ContinueLearningProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b border-gray-200 flex justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Continue Learning
        </h2>
        {userProgress.length > 3 && (
          <Link
            href="/progress"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="p-6">
        {userProgress.length > 0 ? (
          <div className="space-y-4">
            {userProgress.slice(0, 3).map((progress: any) => (
              <div
                key={progress._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpenIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {progress.courseId.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {Math.round(progress.progressPercentage)}% complete
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          progress.progressPercentage
                        )}`}
                        style={{ width: `${progress.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/courses/${progress.courseId?.slug}/learn`}
                  className="ml-4 btn-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <PlayIcon className="h-4 w-4 mr-1" /> Continue
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start your learning journey today!
            </p>
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
