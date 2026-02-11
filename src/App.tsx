'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Navigation, type NavSection } from './components/Navigation';
import { useUserStore } from './store/useUserStore';
import { useConfigStore } from './store/useConfigStore';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { supabase } from './libs/supabaseClient';
import api, { setNavigate } from './utils/api';
import ApiURL from './utils/apiurl';
import { Purchases, ReservedCustomerAttribute } from "@revenuecat/purchases-js";
import { GlobalToast } from './components/GlobalToast';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getOnboardingFlag, authenticatedUser, setAuthenticatedUser, removeAuthenticatedUser } =
    useUserStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  const pathToSection = (pathname: string): NavSection => {
    switch (pathname) {
      case '/progress':
        return 'progress';
      case '/leaderboard':
        return 'leaderboard';
      case '/profile':
      case '/blogs':
      case '/notifications':
        return 'profile';
      case '/settings':
        return 'settings';
      default:
        return 'dashboard';
    }
  };

  useEffect(() => {
    let subscription: any;
    let appUserId = localStorage.getItem('rc_app_user_id');
    if (!appUserId) {
      appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
      localStorage.setItem('rc_app_user_id', appUserId);
    }
    // console.log('Purchases.generateRevenueCatAnonymousAppUserId() - invoked : from App.tsx');
    // console.log(appUserId);

    const purchases = Purchases.configure({ apiKey: "test_eZwgKpwPadYrtvseGiBbwEoIbks", appUserId: appUserId, });
    // const purchases = Purchases.configure({ apiKey: "test_eZwgKpwPadYrtvseGiBbwEoIbks" });
    // console.log('Purchases.configure(...) - invoked : from App.tsx');
    // console.log(purchases);

    const init = async () => {
      try {
        // try {
        //   const customerInfo = await purchases.getCustomerInfo();
        //   console.log(customerInfo);
        //   if (customerInfo.entitlements.active['pro']) {
        //     console.log('User has active subscription');
        //   }
        // } catch (e) {
        //   console.error('Error checking subscription:', e);
        // }
        UXConfigLogics(location.pathname);

        // Check active sessions (await to ensure we capture returned session before clearing loading)
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session) {
          const token = session.access_token ?? null;
          const email = session.user?.email ?? null;
          const name = session.user?.user_metadata?.name ?? null;
          const avatar = session.user?.user_metadata?.avatar_url ?? null;
          setAuthenticatedUser({ token, email, name, avatar });
          // if (email || name) {
          //   purchases.setAttributes({
          //     ...(email && { [ReservedCustomerAttribute.Email]: email }),
          //     ...(name && { [ReservedCustomerAttribute.DisplayName]: name }),
          //   });
          // }
        } else {
          removeAuthenticatedUser();
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
            const name = newSession.user?.user_metadata?.name ?? null;
            const avatar = newSession.user?.user_metadata?.avatar_url ?? null;
            setAuthenticatedUser({ token, email, name, avatar });
            // if (email || name) {
            //   purchases.setAttributes({
            //     ...(email && { [ReservedCustomerAttribute.Email]: email }),
            //     ...(name && { [ReservedCustomerAttribute.DisplayName]: name }),
            //   });
            // }
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
    return await api.post(ApiURL.user.userSync, { email: user.email, name: user.name });
  }

  useEffect(() => {
    UXConfigLogics(location.pathname);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

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
      if (pathname === '/regulargame' || pathname === '/flashgame' || pathname === '/paywall') {
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
    <>
    <GlobalToast />
    <Routes>
      <Route
        path="/onboarding"
        element={
          authenticatedUser && authenticatedUser.token ? (
            <Navigate to="/" replace />
          ) : getOnboardingFlag() ? (
            <Onboarding />
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
            <Login />
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
    </>
  );
}
