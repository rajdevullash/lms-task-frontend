import { Progress } from "@/types";
import ProgressCard from "./ProgressCard";

interface Props {
  userProgress: Progress[];
}

export default function ProgressList({ userProgress }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Course Progress</h2>
      <div className="grid grid-cols-1 gap-6">
        {userProgress.map((progress) => (
          <ProgressCard key={progress._id} progress={progress} />
        ))}
      </div>
    </div>
  );
}
