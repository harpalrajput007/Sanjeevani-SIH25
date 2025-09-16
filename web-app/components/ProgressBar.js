export default function ProgressBar({ current, target, label, color = "green" }) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorClasses = {
    green: "bg-green-600",
    amber: "bg-amber-600",
    blue: "bg-blue-600"
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{current}/{target}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}