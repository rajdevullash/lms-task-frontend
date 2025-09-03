export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="space-y-2">
              {[...Array(2)].map((_, j) => (
                <div
                  key={j}
                  className="h-4 bg-gray-200 rounded w-full animate-pulse"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
