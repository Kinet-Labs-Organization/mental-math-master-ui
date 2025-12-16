import { motion } from 'motion/react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

export function LeaderboardPage() {
  const leaderboard = [
    {
      rank: 1,
      name: 'Sarah Chen',
      score: 9850,
      accuracy: '98%',
      icon: Crown,
      color: 'text-yellow-400',
    },
    {
      rank: 2,
      name: 'Alex Kumar',
      score: 9720,
      accuracy: '97%',
      icon: Medal,
      color: 'text-gray-400',
    },
    {
      rank: 3,
      name: 'Maria Garcia',
      score: 9680,
      accuracy: '96%',
      icon: Medal,
      color: 'text-orange-400',
    },
    {
      rank: 4,
      name: 'John Smith',
      score: 9450,
      accuracy: '95%',
      icon: Award,
      color: 'text-blue-400',
    },
    {
      rank: 5,
      name: 'Emma Wilson',
      score: 9320,
      accuracy: '94%',
      icon: Award,
      color: 'text-purple-400',
    },
    {
      rank: 6,
      name: 'David Lee',
      score: 9180,
      accuracy: '93%',
      icon: Award,
      color: 'text-green-400',
    },
    {
      rank: 7,
      name: 'Sophie Martin',
      score: 9050,
      accuracy: '92%',
      icon: Award,
      color: 'text-pink-400',
    },
    {
      rank: 8,
      name: 'James Brown',
      score: 8920,
      accuracy: '91%',
      icon: Award,
      color: 'text-cyan-400',
    },
  ];

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl mb-6 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top performers this month</p>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-12">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 max-w-[140px]"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👤</span>
              </div>
              <Medal className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <div className="text-white mb-1">{topThree[1].name}</div>
              <div className="text-2xl text-white mb-1">{topThree[1].score}</div>
              <div className="text-xs text-gray-400">{topThree[1].accuracy} accuracy</div>
            </div>
            <div className="h-20 bg-gradient-to-br from-gray-400/20 to-gray-600/20 border border-gray-400/30 rounded-t-2xl mt-2"></div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 max-w-[160px]"
          >
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-2 border-yellow-400/50 backdrop-blur-xl rounded-3xl p-4 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <span className="text-3xl">👤</span>
              </div>
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-white mb-1">{topThree[0].name}</div>
              <div className="text-3xl text-white mb-1">{topThree[0].score}</div>
              <div className="text-xs text-gray-400">{topThree[0].accuracy} accuracy</div>
            </div>
            <div className="h-32 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 border-2 border-yellow-400/30 rounded-t-2xl mt-2"></div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 max-w-[140px]"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👤</span>
              </div>
              <Medal className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <div className="text-white mb-1">{topThree[2].name}</div>
              <div className="text-2xl text-white mb-1">{topThree[2].score}</div>
              <div className="text-xs text-gray-400">{topThree[2].accuracy} accuracy</div>
            </div>
            <div className="h-12 bg-gradient-to-br from-orange-400/20 to-orange-600/20 border border-orange-400/30 rounded-t-2xl mt-2"></div>
          </motion.div>
        </div>

        {/* Rest of the list */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="space-y-2">
            {others.map((player, index) => {
              const Icon = player.icon;
              return (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <span className="text-lg text-white">{player.rank}</span>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <div className="text-white">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.accuracy} accuracy</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xl text-white">{player.score}</div>
                    <Icon className={`w-5 h-5 ${player.color}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Your Rank */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-2 border-purple-500/30 backdrop-blur-xl rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <span className="text-lg text-white">#15</span>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <div className="text-white">You</div>
                <div className="text-sm text-gray-400">Keep practicing!</div>
              </div>
            </div>
            <div className="text-2xl text-white">8450</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
