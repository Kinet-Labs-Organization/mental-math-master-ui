import { motion } from 'motion/react';
import { Mail, Calendar, Bell, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import SkeletonLoader from './shared/skeleton-loader';
import { useGenericStore } from '../store/useGenericStore';

export function Profile() {
  const colors = ['bg-blue-500/20 text-blue-400', 'bg-green-500/20 text-green-400', 'bg-purple-500/20 text-purple-400', 'bg-pink-500/20 text-pink-400', 'bg-yellow-500/20 text-yellow-400'];
  const navigate = useNavigate();
  const {
    fetchNotifications, notifications, notificationsLoading,
  } = useUserStore();

  const {
    fetchBlogs, blogs, blogsLoading
  } = useGenericStore();

  useEffect(() => {
    fetchNotifications(2);
    fetchBlogs(4);
  }, []);

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

        {/* Notifications */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl text-white flex items-center gap-3">
              <div className="relative">
                <Bell className="w-6 h-6 text-blue-400" />
              </div>
              Notifications
              {notifications?.unread > 0 && (
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[14px] text-white">{notifications.unread}</div>
                )}
            </h2>
            <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors" onClick={() => { navigate('/notifications') }}>
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {notificationsLoading ? (
              <div className="space-y-3">
                <SkeletonLoader height={72} width="100%" radius={16} />
                <SkeletonLoader height={72} width="100%" radius={16} />
              </div>
            ) : notifications?.notifications?.length > 0 ? (
              notifications.notifications.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/10"
                >
                  <div className={`w-10 h-10 ${colors[i % colors.length]} rounded-full flex items-center justify-center text-lg`}>
                    {item.icon || '🔔'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium text-sm">{item.title}</h3>
                      {!item.read && <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />}
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs">{item.time || 'Now'}</span>
                </motion.div>
              ))) : (
              <div className="text-gray-400 text-center py-4">No notifications</div>
            )}
          </div>
        </div>

        {/* Blogs */}
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
          <div className="space-y-3">
            {blogsLoading ? (
              <div className="space-y-3">
                <SkeletonLoader height={72} width="100%" radius={16} />
                <SkeletonLoader height={72} width="100%" radius={16} />
              </div>
            ) : blogs?.length > 0 ? (
              blogs.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer border border-white/5 hover:border-white/10"
                >
                  <div className={`w-10 h-10 ${colors[i % colors.length]} rounded-full flex items-center justify-center text-lg`}>
                    {item.icon || '📜'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm mb-2">{item.title}</h3>
                    <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-md">{item.read || '5 min'} read</span>
                  </div>
                </motion.div>
              ))) : (
              <div className="text-gray-400 text-center py-4">No blogs available</div>
            )}
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
