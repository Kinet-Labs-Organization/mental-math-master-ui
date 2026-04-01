import { Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Progress = lazy(() => import('./components/Progress').then(m => ({ default: m.Progress })));
const Leaderboard = lazy(() => import('./components/Leaderboard').then(m => ({ default: m.Leaderboard })));
const Profile = lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
const Setting = lazy(() => import('./components/Setting').then(m => ({ default: m.Setting })));
const FlashGame = lazy(() => import('./components/FlashGame').then(m => ({ default: m.FlashGame })));
const RegularGame = lazy(() => import('./components/RegularGame').then(m => ({ default: m.RegularGame })));
const Paywall = lazy(() => import('./components/Paywall').then(m => ({ default: m.Paywall })));
const Blogs = lazy(() => import('./components/Blogs').then(m => ({ default: m.Blogs })));
const Notifications = lazy(() => import('./components/Notifications').then(m => ({ default: m.Notifications })));


export function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center px-4">
        <div className="relative mx-auto mt-[-110px] w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-cyan-400 animate-spin" />
        </div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Setting />} />
        <Route path="/flashgame" element={<FlashGame />} />
        <Route path="/regulargame" element={<RegularGame />} />
        <Route path="/paywall" element={<Paywall />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
