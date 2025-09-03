import Link from "next/link";
import { ChartBarIcon } from "@heroicons/react/24/outline";

interface Props {
  unauthorized?: boolean;
}

export default function ProgressEmpty({ unauthorized }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="text-center">
        <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          {unauthorized ? "Access Denied" : "No progress yet"}
        </h3>
        <p className="text-gray-600 mb-6">
          {unauthorized
            ? "Please log in to view your progress."
            : "Start learning to see your progress here."}
        </p>
        <Link
          href={unauthorized ? "/auth/login" : "/courses"}
          className="btn-primary"
        >
          {unauthorized ? "Log In" : "Browse Courses"}
        </Link>
      </div>
    </div>
  );
}
