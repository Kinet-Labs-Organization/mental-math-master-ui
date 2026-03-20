const ApiURL = {
  auth: {
    signin: `auth/signin`,
    signup: `auth/signup`,
  },
  game: {
    fetchGameLevels: `game/gameLevels`,
    fetchGame: `game/fetchGame`,
    fetchCustomGame: `game/fetchCustomGame`,
    saveGame: `game/saveGame`,
  },
  user: {
    userSync: `user/userSync`,
    fetchBasicReport: `user/basicReport`,
    fetchProgressReport: `user/progressReport`,
    fetchActivities: `user/activities`,
    settingsData: `user/settingsData`,
    updateSettings: `user/updateSettings`,
    fetchNotifications: `user/notifications`,
    fetchProfile: `user/profile`,
    fetchAchievements: `user/achievements`,
    upgrade: `user/upgrade`,
  },
  generic: {
    fetchFaqs: `generic/faqs`,
    fetchLeaderboard: `generic/leaderboard`,
    fetchBlogs: `generic/blogs`,
  },
};

export default ApiURL;
