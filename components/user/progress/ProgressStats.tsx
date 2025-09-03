import {
  BookOpenIcon,
  TrophyIcon,
  PlayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface Props {
  stats: {
    totalCourses: number;
    completedCourses: number;
    completedLectures: number;
    totalHours: number;
  };
}

export default function ProgressStats({ stats }: Props) {
  const cards = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpenIcon,
      color: "blue",
    },
    {
      label: "Completed",
      value: stats.completedCourses,
      icon: TrophyIcon,
      color: "green",
    },
    {
      label: "Lectures Watched",
      value: stats.completedLectures,
      icon: PlayIcon,
      color: "purple",
    },
    {
      label: "Hours Learned",
      value: stats.totalHours,
      icon: ClockIcon,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white p-6 rounded-lg shadow-sm border flex items-center"
        >
          <div className={`bg-${color}-100 p-3 rounded-lg`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
