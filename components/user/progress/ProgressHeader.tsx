interface Props {
  title?: string;
  subtitle?: string;
}

export default function ProgressHeader({
  title = "Your Learning Progress",
  subtitle = "Track your learning journey and celebrate your achievements",
}: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
