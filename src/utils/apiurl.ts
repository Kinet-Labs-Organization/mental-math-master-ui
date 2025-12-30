const ApiURL = {
  auth: {
    signin: `auth/signin`,
    signup: `auth/signup`,
    userSync: `user/userSync`,
  },
  game: {
    fetchPracticeGame: `user/practiceGames`,
    fetchGameLevels: `user/gameLevels`,
    fetchGame: `user/fetchGame`,
  },
  report: {
    fetchProgressReport: `user/progressReports`,
  },
};

export default ApiURL;
