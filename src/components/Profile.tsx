import { motion } from 'motion/react';
import { Mail, Calendar, Award, Target, Zap, Bell, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const navigate = useNavigate();
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

        {/* Notifications */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-white flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-400" />
              Notifications
            </h2>
            <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors" onClick={() => { navigate('/notifications') }}>
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'New Tournament Available', desc: 'The Neptune Championship has started!', time: '2h ago', icon: '🏆', color: 'bg-yellow-500/20 text-yellow-400' },
              { title: 'Daily Goal Reached', desc: 'You completed your daily practice goal.', time: '5h ago', icon: '🎯', color: 'bg-green-500/20 text-green-400' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/10"
              >
                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-lg`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
                <span className="text-gray-500 text-xs">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Latest Blogs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-purple-400" />
              Latest Blogs
            </h2>
            <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors" onClick={() => { navigate('/blogs') }}>
              Read More <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'The Art of Mental Calculation', desc: 'Discover techniques to perform complex math...', read: '5 min', image: '🧠' },
              { title: 'Vedic Math Secrets', desc: 'Ancient Indian mathematical methods that...', read: '8 min', image: '📜' }
            ].map((blog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="group p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {blog.image}
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">{blog.title}</h3>
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2">{blog.desc}</p>
                    <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-md">{blog.read} read</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
                className={`rounded-2xl p-4 border transition-all ${achievement.unlocked
                    ? 'bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/30'
                    : 'bg-white/5 border-white/10 opacity-50'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${achievement.unlocked
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
