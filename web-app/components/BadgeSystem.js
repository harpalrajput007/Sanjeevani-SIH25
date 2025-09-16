export default function BadgeSystem({ totalBatches }) {
  const badges = [
    { id: 1, name: "Herb Starter", icon: "🌿", requirement: 1, unlocked: totalBatches >= 1 },
    { id: 2, name: "Green Collector", icon: "🍃", requirement: 5, unlocked: totalBatches >= 5 },
    { id: 3, name: "Nature Guardian", icon: "🌳", requirement: 10, unlocked: totalBatches >= 10 },
    { id: 4, name: "Ayurveda Master", icon: "🏆", requirement: 25, unlocked: totalBatches >= 25 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-green-800 mb-4">Achievement Badges</h3>
      <div className="grid grid-cols-2 gap-4">
        {badges.map(badge => (
          <div 
            key={badge.id}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              badge.unlocked 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}
          >
            <div className={`text-3xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>
              {badge.icon}
            </div>
            <p className="font-semibold text-sm">{badge.name}</p>
            <p className="text-xs mt-1">
              {badge.unlocked ? 'Unlocked!' : `Need ${badge.requirement} batches`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}