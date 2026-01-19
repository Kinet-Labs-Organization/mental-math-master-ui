'use client';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, Target, Zap, Award, WandSparkles } from 'lucide-react';
import { useReportStore } from '../store/useReportStore';
import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function Progress() {
  const { report, reportLoading, fetchReport } = useReportStore();

  const recentActivity = [
    { planet: 'Neptune', date: 'Today', score: '95%', correct: 11, total: 12 },
    { planet: 'Uranus', date: 'Today', score: '89%', correct: 8, total: 9 },
    { planet: 'Saturn', date: 'Yesterday', score: '80%', correct: 8, total: 10 },
    { planet: 'Jupiter', date: 'Yesterday', score: '88%', correct: 7, total: 8 },
    { planet: 'Mars', date: '2 days ago', score: '86%', correct: 6, total: 7 },
  ];

  // Sample data for 30 days
  const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  const scores = Array.from({ length: 30 }, () => Math.floor(Math.random() * 31) + 70);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Score (%)',
        data: scores,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Trend',
      },
    },
  };

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
          <div className="h-64">
            <Line data={chartData} options={options} />
          </div>
        </div>

        {/* Suggestion Note */}
        <div className='w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-3xl p-6 shadow-lg transition-all border border-blue-400/20 group mb-7'>
        <div className="flex items-center gap-4">
                  <div className="text-left">
                    <div className='flex mb-4'>
                      <WandSparkles className="w-7 h-7 text-white" />
                      <h3 className="text-white text-xl mb-1 ml-4">AI Suggestion</h3>
                    </div>
                    <p className="text-blue-100 text-sm">
                      Thik kore dekho, tumar accuracy rate aro barate parbe jodi tumar daily practice session gulo aro consistent rakho. Chesta koro prottek din e ekta session complete korte!
                    </p>
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

        {/* Load More Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={()=>{}}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-base py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Load more</span>
          </motion.button>

      </div>
    </div>
  );
}
