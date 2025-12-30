'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Navigation, type NavSection } from './components/Navigation';
import { useUserStore } from './store/useUserStore';
import { useConfigStore } from './store/useConfigStore';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { supabase } from './libs/supabaseClient';
import api from './utils/api';
import ApiURL from './utils/apiurl';
import { Purchases } from "@revenuecat/purchases-js";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getOnboardingFlag, authenticatedUser, setAuthenticatedUser, removeAuthenticatedUser } =
    useUserStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const pathToSection = (pathname: string): NavSection => {
    switch (pathname) {
      case '/progress':
        return 'progress';
      case '/leaderboard':
        return 'leaderboard';
      case '/profile':
        return 'profile';
      case '/settings':
        return 'settings';
      default:
        return 'dashboard';
    }
  };

  useEffect(() => {
    let subscription: any;
    const appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
    const purchases = Purchases.configure({apiKey: "test_eZwgKpwPadYrtvseGiBbwEoIbks",appUserId: appUserId,});

    const init = async () => {
      try {
        UXConfigLogics(location.pathname);

        // Check active sessions (await to ensure we capture returned session before clearing loading)
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session) {
          const token = session.access_token ?? null;
          const email = session.user?.email ?? null;
          setAuthenticatedUser({ token, email });
        }

        // Listen for auth changes and mirror them to the app store
        const resp: any = supabase.auth.onAuthStateChange(async (_event: any, newSession: any) => {
          if (newSession?.access_token) {
            // user sync code starts
            if (!newSession?.user?.user_metadata?.onboarding_completed) {
              const userSyncResult = await userSync(newSession?.user?.user_metadata);
              if (userSyncResult) {
                await supabase.auth.updateUser({ data: { onboarding_completed: true } });
              } else {
                console.log('user sync failed');
              }
            }
            // user sync code ends
            const token = newSession.access_token ?? null;
            const email = newSession.user?.email ?? null;
            setAuthenticatedUser({ token, email });
          } else {
            removeAuthenticatedUser();
          }
        });
        subscription = resp?.data?.subscription;
      } catch (err) {
        // ignore
      } finally {
        setIsAuthLoading(false);
      }
    };

    init();

    return () => {
      try {
        subscription?.unsubscribe();
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userSync = async (user: any) => {
    return await api.post(ApiURL.auth.userSync, { email: user.email, name: user.name });
  }

  useEffect(() => {
    UXConfigLogics(location.pathname);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // Removed unused onboardingUser helper (was never called)
  const {
    FooterNavigation,
    TopEmptySpace,
    BottomEmptySpace,
    showTopEmptySpace,
    showBottomEmptySpace,
    showFooterNavigation,
    hideFooterNavigation,
    hideTopEmptySpace,
    hideBottomEmptySpace,
  } = useConfigStore();

  const UXConfigLogics = useCallback(
    (pathname?: string) => {
      if (pathname === '/mcq' || pathname === '/game' || pathname === '/paywall') {
        hideTopEmptySpace();
        hideBottomEmptySpace();
        hideFooterNavigation();
      } else {
        showTopEmptySpace();
        showBottomEmptySpace();
        showFooterNavigation();
      }
    },
    [showTopEmptySpace, showBottomEmptySpace, showFooterNavigation, hideFooterNavigation, hideTopEmptySpace, hideBottomEmptySpace]
  );

  if (isAuthLoading) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="/onboarding"
        element={
          authenticatedUser && authenticatedUser.token ? (
            <Navigate to="/" replace />
          ) : getOnboardingFlag() ? (
            <OnboardingFlow />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/login"
        element={
          authenticatedUser && authenticatedUser.token ? (
            <Navigate to="/" replace />
          ) : (
            <LoginScreen />
          )
        }
      />
      <Route
        path="/*"
        element={
          authenticatedUser && authenticatedUser.token ? (
            <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col">
              <div ref={scrollContainerRef} className="flex-1 overflow-auto">
                {TopEmptySpace && <div style={{ height: '42px' }}></div>}
                <AppRoutes />
                {BottomEmptySpace && <div style={{ height: '68px' }}></div>}
              </div>
              {FooterNavigation && (
                <Navigation
                  activeSection={pathToSection(location.pathname)}
                  onSectionChange={section =>
                    navigate(section === 'dashboard' ? '/' : `/${section}`)
                  }
                />
              )}
            </div>
          ) : (
            // <Navigate to="/onboarding" replace />
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
