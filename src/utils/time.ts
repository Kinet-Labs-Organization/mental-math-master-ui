export const formatNotificationTimeAgo = (time?: string) => {
  if (!time) return "Just Now";

  const createdAt = new Date(time).getTime();
  if (Number.isNaN(createdAt)) return "Just Now";

  const diffInMinutes = Math.floor((Date.now() - createdAt) / (1000 * 60));
  if (diffInMinutes <= 10) return "Just Now";

  if (diffInMinutes < 60) {
    const roundedMinutes = Math.floor(diffInMinutes / 5) * 5;
    return `${roundedMinutes} mins ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
};
