import { BookOpenIcon } from "@heroicons/react/24/outline";
import StatCard from "./StatCard";

interface Stats {
  totalCourses: number;
}

export default function StatsGrid({ stats }: { stats: Stats }) {
  const statCards = [
    {
      name: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpenIcon,
      color: "bg-blue-500",
      href: "/admin/courses",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <StatCard key={stat.name} {...stat} />
      ))}
    </div>
  );
}
