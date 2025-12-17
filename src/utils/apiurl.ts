const ApiURL = {
  auth: {
    signin: `auth/signin`,
    signup: `auth/signup`,
    userSync: `user/userSync`,
  },
  game: {
    fetchPracticeGame: `user/practiceGames`,
    fetchTournamentGame: `user/tournamentGames`,
  },
  report: {
    fetchProgressReport: `user/progressReports`,
  },
};

export default ApiURL;
