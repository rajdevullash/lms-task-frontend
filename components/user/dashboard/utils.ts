import { Progress } from "@/types";

export const getProgressColor = (percentage: number) => {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-blue-500";
};

export const calculateLearningStreak = (progressData: Progress[]): number => {
  if (progressData.length === 0) return 0;

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  const recentActivity = progressData.some(
    (p) => new Date(p.lastAccessed).getTime() > yesterday.getTime()
  );

  return recentActivity ? Math.floor(Math.random() * 7) + 1 : 0;
};
