const ApiURL = {
  auth: {
    signin: `auth/signin`,
    signup: `auth/signup`,
    userSync: `user/userSync`,
  },
  game: {
    fetchGameLevels: `game/gameLevels`,
    fetchGame: `game/fetchGame`,
    fetchCustomGame: `game/fetchCustomGame`,
    fetchBlogs: `game/blogs`,
  },
  user: {
    fetchProgressReport: `user/progressReports`,
    fetchActivities: `user/activities`,
    settingsData: `user/settingsData`,
  },
  generic: {
    fetchFaqs: `generic/faqs`,
  },
};

export default ApiURL;
