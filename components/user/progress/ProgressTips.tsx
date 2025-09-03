export default function ProgressTips() {
  const tips = [
    "Set aside regular time for learning each day",
    "Take notes and practice what you learn",
    "Review previous lectures before starting new ones",
    "Complete courses fully to maximize retention",
  ];

  return (
    <div className="mt-12 bg-blue-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        💡 Tips for Better Learning
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
        {tips.map((tip, idx) => (
          <div key={idx} className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p>{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
