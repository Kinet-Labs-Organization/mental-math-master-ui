import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { Bell, ChevronLeft, X } from 'lucide-react';
import SkeletonLoader from './shared/skeleton-loader';
import { useNavigate } from 'react-router-dom';

export function Notifications() {
    const colors = ['bg-blue-500/20 text-blue-400', 'bg-green-500/20 text-green-400', 'bg-purple-500/20 text-purple-400', 'bg-pink-500/20 text-pink-400', 'bg-yellow-500/20 text-yellow-400'];
    const navigate = useNavigate();
    const { notifications, notificationsLoading, fetchNotifications } = useUserStore();
    const [selectedNotification, setSelectedNotification] = useState<any>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="p-6 mb-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl text-white flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    Notifications
                    <div className="relative">
                        <Bell className="w-6 h-6 text-blue-400" />
                        {notifications?.unread > 0 && (
                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[14px] text-white">{notifications.unread}</div>
                        )}
                    </div>
                </h2>
            </div>
            <div className="space-y-3">
                {notificationsLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <SkeletonLoader key={i} height={72} width="100%" radius={16} />
                        ))}
                    </div>
                ) : notifications?.notifications?.length > 0 ? (
                    notifications.notifications.map((item: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            onClick={() => setSelectedNotification(item)}
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

            {selectedNotification && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1f2635] border border-white/10 rounded-3xl p-6 max-w-sm w-full relative"
                    >
                        <button
                            onClick={() => setSelectedNotification(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                                {selectedNotification.icon || '🔔'}
                            </div>
                            <h3 className="text-xl text-white font-semibold mb-2">{selectedNotification.title}</h3>
                            <p className="text-gray-400 mb-6">
                                {selectedNotification.message || selectedNotification.description || "No details available"}
                            </p>
                            <span className="text-gray-500 text-xs">{selectedNotification.time || 'Now'}</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}