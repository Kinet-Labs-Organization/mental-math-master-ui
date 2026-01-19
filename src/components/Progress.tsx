'use client';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, Target, Zap, Award } from 'lucide-react';
import { useReportStore } from '../store/useReportStore';
import { useEffect } from 'react';

export function Progress() {
  const { report, reportLoading, fetchReport } = useReportStore();

  const recentActivity = [
    { planet: 'Neptune', date: 'Today', score: '95%', correct: 11, total: 12 },
    { planet: 'Uranus', date: 'Today', score: '89%', correct: 8, total: 9 },
    { planet: 'Saturn', date: 'Yesterday', score: '80%', correct: 8, total: 10 },
    { planet: 'Jupiter', date: 'Yesterday', score: '88%', correct: 7, total: 8 },
    { planet: 'Mars', date: '2 days ago', score: '86%', correct: 6, total: 7 },
  ];

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-white mb-2">Your Progress</h1>
          <p className="text-gray-400">Track your mental math journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            key="Total Sessions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4`}
            >
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl text-white mb-1">
              {reportLoading ? (
                <div className="loader" style={{ width: 38, padding: 5 }}></div>
              ) : (
                report?.sessions
              )}
            </div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </motion.div>

          <motion.div
            key="Accuracy Rate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4`}
            >
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl text-white mb-1">
              {reportLoading ? (
                <div className="loader" style={{ width: 38, padding: 5 }}></div>
              ) : (
                `${report?.accuracy}%`
              )}
            </div>
            <div className="text-sm text-gray-400">Accuracy Rate</div>
          </motion.div>

          <motion.div
            key="Current Streak"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4`}
            >
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl text-white mb-1">
              {reportLoading ? (
                <div className="loader" style={{ width: 38, padding: 5 }}></div>
              ) : (
                report?.streak
              )}
            </div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </motion.div>

          <motion.div
            key="Achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
          >
            <div
              className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4`}
            >
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl text-white mb-1">
              {reportLoading ? (
                <div className="loader" style={{ width: 38, padding: 5 }}></div>
              ) : (
                report?.achievements
              )}
            </div>
            <div className="text-sm text-gray-400">Achievements</div>
          </motion.div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-white mb-1">Performance Trend</h2>
              <p className="text-sm text-gray-400">Last 30 days</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-400">Performance chart coming soon</p>
              {/* <TinyBarChart /> */}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl text-white mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🪐</span>
                  </div>
                  <div>
                    <div className="text-white">{activity.planet}</div>
                    <div className="text-sm text-gray-400">{activity.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl text-white">{activity.score}</div>
                  <div className="text-sm text-gray-400">
                    {activity.correct}/{activity.total} correct
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
