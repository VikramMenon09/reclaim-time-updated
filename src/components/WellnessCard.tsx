import { TrendingUp, Heart, Brain } from 'lucide-react';

interface WellnessCardProps {
  score: number;
  streak: number;
}

export function WellnessCard({ score, streak }: WellnessCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent balance! 🌟';
    if (score >= 60) return 'Good balance 👍';
    if (score >= 40) return 'Room for improvement 📈';
    return 'Let\'s rebalance 🎯';
  };

  return (
    <div className="wellness-gradient rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 transform translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 transform -translate-x-8 translate-y-8" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Fora Score</h3>
            <p className="text-white/80 text-sm">{getScoreMessage(score)}</p>
          </div>
          <Brain className="w-6 h-6 text-white/80" />
        </div>

        <div className="flex items-center space-x-6">
          {/* Circular Progress */}
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="white"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - score / 100)}`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{score}%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">{streak} day streak</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Wellness focus</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
