interface Props {
  stats: {
    totalCourses: number;
    completedLectures: number;
  };
}

export default function ProgressSummary({ stats }: Props) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">🎉 Great Progress!</h2>
          <p className="text-blue-100">
            You&apos;ve completed {stats.completedLectures} lectures across{" "}
            {stats.totalCourses} courses. Keep it up!
          </p>
        </div>
      </div>
    </div>
  );
}
