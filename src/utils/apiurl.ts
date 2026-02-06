const ApiURL = {
  auth: {
    signin: `auth/signin`,
    signup: `auth/signup`,
  },
  game: {
    fetchGameLevels: `game/gameLevels`,
    fetchGame: `game/fetchGame`,
    fetchCustomGame: `game/fetchCustomGame`,
    fetchBlogs: `game/blogs`,
  },
  user: {
    userSync: `user/userSync`,
    fetchBasicReport: `user/basicReport`,
    fetchProgressReport: `user/progressReport`,
    fetchActivities: `user/activities`,
    settingsData: `user/settingsData`,
    updateSettings: `user/updateSettings`,
  },
  generic: {
    fetchFaqs: `generic/faqs`,
    fetchLeaderboard: `generic/leaderboard`,
  },
};

export default ApiURL;
