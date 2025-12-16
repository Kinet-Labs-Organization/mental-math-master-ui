import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { ProgressPage } from './components/ProgressPage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { TrainingGame } from './components/TrainingGame';
import { MCQPractice } from './components/MCQPractice';
import { Paywall } from './components/Paywall';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/game" element={<TrainingGame />} />
      <Route path="/mcq" element={<MCQPractice />} />
      <Route path="/paywall" element={<Paywall />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
