import { motion } from 'motion/react';
import { Mail, Calendar, Award, Target, Zap } from 'lucide-react';

export function ProfilePage() {
  const achievements = [
    {
      icon: '🏆',
      title: 'First Win',
      description: 'Complete your first tournament',
      unlocked: true,
    },
    { icon: '🔥', title: 'Hot Streak', description: '5 day practice streak', unlocked: true },
    {
      icon: '🎯',
      title: 'Perfectionist',
      description: '100% accuracy in a session',
      unlocked: true,
    },
    { icon: '⚡', title: 'Speed Demon', description: 'Complete Neptune level', unlocked: false },
    {
      icon: '🌟',
      title: 'Rising Star',
      description: 'Reach top 10 on leaderboard',
      unlocked: false,
    },
    { icon: '💎', title: 'Master', description: 'Complete all tournaments', unlocked: false },
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 border-2 border-purple-500/30 backdrop-blur-xl rounded-3xl p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-5xl shadow-xl">
              👤
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl text-white mb-2">John Doe</h1>
              <p className="text-gray-400 mb-4">Mental Math Enthusiast</p>
              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Joined Nov 2025</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">john.doe@email.com</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 hover:bg-white/10 text-white text-base px-6 py-3 rounded-2xl transition-all border border-white/10 hover:border-white/20"
            >
              Edit Profile
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center"
          >
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-3xl text-white mb-1">87%</div>
            <div className="text-sm text-gray-400">Avg Accuracy</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center"
          >
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl text-white mb-1">5</div>
            <div className="text-sm text-gray-400">Day Streak</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center"
          >
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-3xl text-white mb-1">12</div>
            <div className="text-sm text-gray-400">Achievements</div>
          </motion.div>
        </div>

        {/* Achievements */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl text-white mb-6">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`rounded-2xl p-4 border transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/30'
                    : 'bg-white/5 border-white/10 opacity-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                        : 'bg-white/10'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white">{achievement.title}</h3>
                      {achievement.unlocked && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
