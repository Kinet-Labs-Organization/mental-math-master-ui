import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Progress } from './components/Progress';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { Setting } from './components/Setting';
import { FlashGame } from './components/FlashGame';
import { RegularGame } from './components/RegularGame';
import { Paywall } from './components/Paywall';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Setting />} />
      <Route path="/game" element={<FlashGame />} />
      <Route path="/regulargame" element={<RegularGame />} />
      <Route path="/paywall" element={<Paywall />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
