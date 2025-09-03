import Link from "next/link";

interface StatCardProps {
  name: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href: string;
}

export default function StatCard({
  name,
  value,
  icon: Icon,
  color,
  href,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
    >
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{name}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Link>
  );
}
