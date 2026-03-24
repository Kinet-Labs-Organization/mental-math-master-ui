'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Navigation, type NavSection } from './components/Navigation';
import { useUserStore } from './store/useUserStore';
import { useConfigStore } from './store/useConfigStore';
import { Login } from './components/Login';
import { Onboarding } from './components/Onboarding';
import { firebaseAuth, signOutFromFirebase } from './libs/firebaseClient';
import config from './config/env';
import api, { setNavigate } from './utils/api';
import ApiURL from './utils/apiurl';
import { Purchases, ReservedCustomerAttribute } from "@revenuecat/purchases-js";
import { GlobalToast } from './components/GlobalToast';
import CONSTANTS from './utils/constants';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getOnboardingFlag, authenticatedUser, setAuthenticatedUser, removeAuthenticatedUser } =
    useUserStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isUserSynced, setIsUserSynced] = useState(false);
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
    let unsubscribe: (() => void) | undefined;
    // let appUserId = localStorage.getItem('rc_app_user_id');
    // if (!appUserId) {
    //   appUserId = Purchases.generateRevenueCatAnonymousAppUserId();
    //   localStorage.setItem('rc_app_user_id', appUserId);
    // }
    // console.log('Purchases.generateRevenueCatAnonymousAppUserId() - invoked : from App.tsx');
    // console.log(appUserId);

    // const purchases = Purchases.configure({ apiKey: "test_eZwgKpwPadYrtvseGiBbwEoIbks", appUserId: appUserId, });
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
        // console.log('Firebase runtime config:', {
        //   origin: window.location.origin,
        //   authDomain: config.firebaseAuthDomain,
        //   projectId: config.firebaseProjectId,
        //   apiKeyPreview: config.firebaseApiKey?.slice(0, 8),
        // });
        try {
          const redirectResult = await getRedirectResult(firebaseAuth);
          // console.log('Firebase redirect result:', redirectResult);
        } catch (error) {
          console.error('Firebase redirect result error:', error);
        }

        unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
          // console.log('onAuthStateChanged fired:', firebaseUser);
          if (!firebaseUser) {
            removeAuthenticatedUser();
            setIsAuthLoading(false);
            return;
          }

          try {
            const token = await firebaseUser.getIdToken();
            const email = firebaseUser.email ?? null;
            const name = firebaseUser.displayName ?? null;
            const avatar = firebaseUser.photoURL ?? null;
            const syncedUser = await userSync({ email, name, avatar });
            setAuthenticatedUser(syncedUser ?? { token, email, name, avatar });
          } catch (error) {
            console.error('Firebase auth processing error:', error);
            removeAuthenticatedUser();
            await signOutFromFirebase();
          } finally {
            setIsAuthLoading(false);
          }
        });
      } catch (err) {
        console.error('Firebase auth init error:', err);
      } finally {
        if (!unsubscribe) {
          setIsAuthLoading(false);
        }
      }
    };

    init();

    return () => {
      try {
        unsubscribe?.();
      } catch (e) {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userSync = async (user: any) => {
    const userSynced = localStorage.getItem(CONSTANTS.AUTHENTICATED_USER_STORAGE_KEY);
    try {
      if (!userSynced) {
        setIsUserSynced(true);
        await api.post(ApiURL.user.userSync, { email: user.email, name: user.name, avatar: user.avatar });
        const firebaseUser = firebaseAuth.currentUser;
        if (firebaseUser) {
          const refreshedToken = await firebaseUser.getIdToken(true);
          const updatedAuthUser = {
            token: refreshedToken,
            email: firebaseUser.email ?? user.email ?? null,
            name: firebaseUser.displayName ?? user.name ?? null,
            avatar: firebaseUser.photoURL ?? user.avatar ?? null,
          };
          setIsUserSynced(false);
          return updatedAuthUser;
        }
      }
      return null;
    } catch (error) {
      console.error('User sync error:', error);
      setIsUserSynced(false);
      return null;
    }
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

  if(isUserSynced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center shadow-2xl">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-pink-500 animate-spin" />
          </div>
          <h2 className="text-white text-xl mb-2">Signing you in</h2>
          <p className="text-gray-400 text-sm">Syncing your account details...</p>
        </div>
      </div>
    );
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
