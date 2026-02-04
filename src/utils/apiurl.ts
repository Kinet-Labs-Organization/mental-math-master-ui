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
  report: {
    fetchProgressReport: `user/progressReports`,
    fetchActivities: `user/activities`,
  },
};

export default ApiURL;
