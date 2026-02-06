'use client';
import { motion } from 'motion/react';
import { TrendingUp, Calendar, Target, Zap, Award, WandSparkles, Check, X } from 'lucide-react';
import { useReportStore } from '../store/useReportStore';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import SkeletonLoader from './shared/skeleton-loader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function Progress() {
  const {
    basicReport, basicReportLoading, basicReportError, fetchBasicReport,
    progressReport, progressReportLoading, progressReportError, fetchProgressReport,
    activities, activitiesLoading, activitiesError, fetchActivities
  } = useReportStore();

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    fetchActivities(recentActivity.length);
    if (activities.length >= 30) {
      setHasMore(false);
    }
  };

  const formatDate = (date: Date) => {
    const today = Date.now();
    const millisecondsInADay = 1000 * 60 * 60 * 24;
    return Math.floor((today - date.getTime()) / millisecondsInADay);
  }

  const calculateScore = (correctAnswers: number, totalQuestions: number) => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  useEffect(() => {
    const fetchedActivities = activities.map((activity: any) => {
      return {
        gameName: activity.gameName,
        gamePlayedAt: formatDate(new Date(activity.gamePlayedAt)) === 0 ? 'Today' : `${formatDate(new Date(activity.gamePlayedAt))} days ago`,
        gameType: activity.gameType,
        totalQuestions: activity.totalQuestions || null,
        correctAnswers: activity.correctAnswers || null,
        correctness: activity.correctness || null,
        score: activity.gameType === 'regular' ? calculateScore(activity.correctAnswers || 0, activity.totalQuestions || 0) : null,
      };
    });
    const newActivities = fetchedActivities.slice(recentActivity.length);
    setRecentActivity(prev => [...prev, ...newActivities]);
  }, [activities]);

  const labels = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  });
  const scores = progressReport?.performanceTrend || [];

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
        display: false,
        text: 'Performance Trend',
      },
    },
  };

  useEffect(() => {
    fetchBasicReport();
    fetchProgressReport();
    fetchActivities(0);
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

          {basicReportLoading ? (
            <StatProgressionSkeleton />
          ) : (<motion.div
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
              {
                basicReport?.totalSessions
              }
            </div>
            <div className="text-sm text-gray-400">Total Sessions</div>
          </motion.div>)}

          {basicReportLoading ? (
            <StatProgressionSkeleton />
          ) : (<motion.div
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
              {basicReportLoading ? (
                <div className="loader" style={{ width: 38, padding: 5 }}></div>
              ) : (
                basicReport?.accuracyRate && `${basicReport?.accuracyRate}%`
              )}
            </div>
            <div className="text-sm text-gray-400">Accuracy Rate</div>
          </motion.div>)}

          {basicReportLoading ? (
            <StatProgressionSkeleton />
          ) : (<motion.div
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
              {progressReportLoading ? (
                <div className="loader" style={{ width: 38, padding: 5 }}></div>
              ) : (
                basicReport?.currentStreak
              )}
            </div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </motion.div>)}

          {basicReportLoading ? (
            <StatProgressionSkeleton />
          ) : (<motion.div
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
              {basicReportLoading ? (
                <div className="loader" style={{ width: 38, padding: 5 }}></div>
              ) : (
                basicReport?.achievements?.length
              )}
            </div>
            <div className="text-sm text-gray-400">Achievements</div>
          </motion.div>)}

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
          {progressReportLoading ? (
            <StatProgressionSkeleton />
          ) : (<div className="h-64">
            <Line data={chartData} options={options} />
          </div>)}
        </div>

        {/* Suggestion Note */}
        {progressReportLoading ? (
          <div className='mb-7'><StatProgressionSkeleton /></div>
        ) : (<div className='w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-3xl p-6 shadow-lg transition-all border border-blue-400/20 group mb-7'>
          <div className="flex items-center gap-4">
            <div className="text-left">
              <div className='flex mb-4'>
                <WandSparkles className="w-7 h-7 text-white" />
                <h3 className="text-white text-xl mb-1 ml-4">AI Suggestion</h3>
              </div>
              {progressReport?.aiSuggestions.map((ele: any, index: any) => (
                <p key={index} className="text-blue-100 text-sm mb-4">
                  {ele}
                </p>
              ))}
            </div>
          </div>
        </div>)}

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl text-white mb-6">Recent Activity</h2>
          <InfiniteScroll
            dataLength={recentActivity.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<p className="text-gray-400 text-center mt-6">Loading....</p>}
            endMessage={<p className="text-gray-400 text-center mt-6">No more activities</p>}
            height={400}
          >
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
                      <div className="text-white">{activity.gameName}</div>
                      <div className="text-sm text-gray-400">{activity.gamePlayedAt}</div>
                    </div>
                  </div>
                  {activity.gameType === 'flash' && (
                    <div className="text-right">
                      {activity.correctness ? <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6"
                      >
                        <Check className="w-4 h-4 text-green-400" />
                      </div> :
                        <div className="w-8 h-8 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                          <X className="w-4 h-4 text-red-400" />
                        </div>}
                    </div>
                  )}
                  {activity.gameType === 'regular' && (<div className="text-right">
                    <div className="text-xl text-white">{activity.score}</div>
                    <div className="text-sm text-gray-400">
                      {activity.correctAnswers}/{activity.totalQuestions} correct
                    </div>
                  </div>)}
                </motion.div>
              ))}
            </div>
          </InfiniteScroll>
        </div>

      </div>
    </div>
  );
}

const StatProgressionSkeleton = () => {
  return (
    <div className="h-[174px]">
      <SkeletonLoader height={'100%'} width={'100%'} radius={20} />
    </div>
  );
};