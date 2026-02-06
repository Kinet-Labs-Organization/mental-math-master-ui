import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { ListView } from './ListView';

export function Notifications() {
    const { notifications, notificationsLoading, fetchNotifications } = useUserStore();

    const [allNotifications, setAllNotifications] = useState<any[]>([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        setAllNotifications(notifications);
    }, [notifications]);

    return (
        <ListView title="Notifications" data={allNotifications} loading={notificationsLoading} error={null} />
    );
}