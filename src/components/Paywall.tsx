import { motion } from 'motion/react';
import { Check, Star, Zap, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { useUserStore } from '../store/useUserStore';
import api from '../utils/api';
import ApiURL from '../utils/apiurl';
import { firebaseAuth } from '../libs/firebaseClient';
import { configureRevenueCat, isNativeRevenueCatEnabled, purchasePlanWithRevenueCat, type PaywallPlan, getOfferings } from '../services/revenuecat';

export function Paywall() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any>({
    yearly: { yearly: null, monthly: null, numericPricePerMonth: 0 },
    monthly: { yearly: null, monthly: null, numericPricePerMonth: 0 },
  });
  const [discount, setDiscount] = useState(0);
  const { authenticatedUser, profile, profileLoading, fetchProfile, setOnboardingPaywallFlag, getOnboardingPaywallFlag } = useUserStore();
  const [isOnboardingPaywall] = useState(() => getOnboardingPaywallFlag());

  useEffect(() => {
    if (!authenticatedUser?.email || profile) {
      return;
    }
    if (!profileLoading) {
      void fetchProfile();
    }
  }, [authenticatedUser?.email, profile, profileLoading, fetchProfile]);

  const features = [
    'Unlock all level of tournaments',
    'Unlimited custom practice sessions',
    'Advanced performance analytics & charts',
    'Track your global leaderboard rank',
  ];

  const onClose = () => {
    const nextRoute: any = getOnboardingPaywallFlag() ? '/' : -1;
    setOnboardingPaywallFlag();
    navigate(nextRoute);
  };

  // useEffect(() => {
  //   console.log(2);
  //   setOnboardingPaywallFlag();
  // }, [setOnboardingPaywallFlag]);

  useEffect(() => {
    if (!authenticatedUser?.email) {
      return
    }
    void configureRevenueCat(authenticatedUser.email).catch((error) => {
      console.error('RevenueCat configure failed:', error);
    });
    void getOfferings().then(({ selectedOffering }) => {
      const yearlyPkg = selectedOffering?.availablePackages.find((p: any) => p.packageType === 'ANNUAL');
      const monthlyPkg = selectedOffering?.availablePackages.find((p: any) => p.packageType === 'MONTHLY');
      const yearlyPricePerMonth = Number(yearlyPkg?.product.pricePerMonth ?? 0);
      const monthlyPricePerMonth = Number(monthlyPkg?.product.pricePerMonth ?? 0);
      setPlans({
        yearly: {
          yearly: yearlyPkg?.product.pricePerYearString ?? null,
          monthly: yearlyPkg?.product.pricePerMonthString ?? null,
          numericPricePerMonth: yearlyPricePerMonth
        },
        monthly: {
          yearly: monthlyPkg?.product.pricePerYearString ?? null,
          monthly: monthlyPkg?.product.pricePerMonthString ?? null,
          numericPricePerMonth: monthlyPricePerMonth
        }
      });
      if (monthlyPricePerMonth > 0 && yearlyPricePerMonth >= 0) {
        const discountPercent = ((monthlyPricePerMonth - yearlyPricePerMonth) * 100) / monthlyPricePerMonth;
        setDiscount(Number.isFinite(discountPercent) ? Math.max(0, Math.round(discountPercent)) : 0);
      } else {
        setDiscount(0);
      }
    });
  }, [authenticatedUser?.email]);

  if (authenticatedUser?.email && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="loader" />
      </div>
    );
  }

  if (profile?.plan?.planId === 'PRO') {
    return <Navigate to="/" replace />;
  }

  const onSubscribe = async (plan: PaywallPlan) => {
    if (!authenticatedUser?.email) {
      return;
    }

    const termMap = {
      yearly: 'd365',
      monthly: 'd30',
      trial: 'd7',
    } as const;

    setLoading(true);
    try {
      const isNative = Capacitor.isNativePlatform();
      if (isNative) {
        if (!isNativeRevenueCatEnabled()) {
          throw new Error('RevenueCat is not configured for this native platform. Please set native RevenueCat API key.');
        }
        await configureRevenueCat(authenticatedUser.email);
        await purchasePlanWithRevenueCat(plan);
      }
      await api.post(ApiURL.user.upgrade, {
        term: termMap[plan],
      });
      await firebaseAuth.currentUser?.getIdToken(true);
      console.log('Subscription updated successfully!');
      onClose();
    } catch (error) {
      console.error('Subscribe flow failed:', error);
      const errorObj = error as any;
      const code = errorObj?.code ? ` (${errorObj.code})` : '';
      const message = errorObj?.message || 'Unknown subscription error';
      const cancelled = errorObj?.userCancelled === true || errorObj?.code === '1';
      if (cancelled) {
        alert('Purchase cancelled.');
      } else {
        alert(`Unable to subscribe${code}: ${message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    profileLoading && !profile ? (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
        <div className="loader" />
      </div>
    ) : (
      <div
        className={
          isOnboardingPaywall
            ? 'min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4 overflow-y-auto'
            : 'fixed inset-0 bg-gray-900/80 backdrop-blur-lg z-50 p-4 overflow-y-auto'
        }
      >
        <div className="min-h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="pt-8 relative w-full max-w-lg bg-transparent rounded-3xl px-5 sm:px-6 pb-6 mt-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-orange-500/30">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl mb-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Unlock Abacus Pro
              </h1>
              <p className="text-gray-400">
                Supercharge your mental math skills and go beyond the limits.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 flex-shrink-0 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Pricing Options */}
            <div className="space-y-4 mb-8">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => onSubscribe('yearly')}
                disabled={loading}
                className="w-full text-left bg-white/5 hover:bg-white/10 border-2 border-purple-500 rounded-2xl p-5 transition-all relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute top-[-10px] right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  SAVE {discount}%
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base text-white">Yearly Plan</h3>
                    <p className="text-sm text-gray-400">{plans.yearly.yearly}/year</p>
                  </div>
                  <div className="text-xl text-white font-bold">{plans.yearly.monthly}/mo</div>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => onSubscribe('monthly')}
                disabled={loading}
                className="w-full text-left bg-white/5 hover:bg-white/10 border-2 border-white/10 rounded-2xl p-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base text-white">Monthly Plan</h3>
                    <p className="text-sm text-gray-400">Billed monthly</p>
                  </div>
                  <div className="text-xl text-white font-bold">{plans.monthly.monthly}/mo</div>
                </div>
              </motion.button>
            </div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => onSubscribe('trial')}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl py-4 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all group flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{loading ? 'Processing...' : 'XStart Free 7-Day Trial'}</span>
            </motion.button>

            {/* Footer */}
            <div className="mt-6 text-center text-xs text-gray-500">
              <p>A subscription is required to access Pro features. You can cancel anytime.</p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  );
}
