import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import SkeletonLoader from './components/shared/skeleton-loader';

const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Progress = lazy(() => import('./components/Progress').then(m => ({ default: m.Progress })));
const Leaderboard = lazy(() => import('./components/Leaderboard').then(m => ({ default: m.Leaderboard })));
const Profile = lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
const Setting = lazy(() => import('./components/Setting').then(m => ({ default: m.Setting })));
const FlashGame = lazy(() => import('./components/FlashGame').then(m => ({ default: m.FlashGame })));
const RegularGame = lazy(() => import('./components/RegularGame').then(m => ({ default: m.RegularGame })));
const Paywall = lazy(() => import('./components/Paywall').then(m => ({ default: m.Paywall })));


export function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    }>
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
    </Suspense>
  );
}
