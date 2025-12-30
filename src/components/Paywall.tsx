// import { motion } from 'motion/react';
// import { Check, Star, Zap, X } from 'lucide-react';
// import { useEffect } from 'react';
// import { Purchases } from '@revenuecat/purchases-js';

// export function Paywall() {
//   const features = [
//     'Unlock all planetary tournaments',
//     'Unlimited custom practice sessions',
//     'Advanced performance analytics & charts',
//     'Track your global leaderboard rank',
//   ];

//   const onClose = () => { };

//   const onSubscribe = (_term: string) => {
//     void _term;
//   };

//   useEffect(() => {
//     const init = async () => {
//       const purchases = Purchases.getSharedInstance();
//       console.log(purchases);
//       const offerings = await purchases.getOfferings();
//       console.log(offerings);
//       const currentOffering = offerings.current;
//       if (!currentOffering) return;
//       const purchaseResult = await purchases.presentPaywall({ offering: currentOffering });
//       // const { customerInfo, redemptionInfo } = purchaseResult;
//       console.log(purchaseResult);
//     }
//     init();
//   }, []);

//   return (
//     <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//         // className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 via-slate-900 to-black border border-white/10 rounded-3xl shadow-2xl p-8"
//         className="pt-8 relative w-full max-w-lg px-4"
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
//         >
//           <X className="w-6 h-6" />
//         </button>

//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mb-6 shadow-lg shadow-orange-500/30">
//             <Star className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl sm:text-4xl mb-3 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
//             Unlock Abacus Pro
//           </h1>
//           <p className="text-gray-400">
//             Supercharge your mental math skills and go beyond the limits.
//           </p>
//         </div>

//         {/* Features */}
//         <div className="space-y-3 mb-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.1 + index * 0.05 }}
//               className="flex items-center gap-3"
//             >
//               <div className="w-6 h-6 flex-shrink-0 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center">
//                 <Check className="w-4 h-4 text-green-400" />
//               </div>
//               <span className="text-gray-300">{feature}</span>
//             </motion.div>
//           ))}
//         </div>

//         {/* Pricing Options */}
//         <div className="space-y-4 mb-8">
//           <motion.button
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             onClick={() => onSubscribe('yearly')}
//             className="w-full text-left bg-white/5 hover:bg-white/10 border-2 border-purple-500 rounded-2xl p-5 transition-all relative"
//           >
//             <div className="absolute top-2 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
//               SAVE 25%
//             </div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg text-white">Yearly Plan</h3>
//                 <p className="text-gray-400">$89.99 / year</p>
//               </div>
//               <div className="text-2xl text-white font-bold">$7.50/mo</div>
//             </div>
//           </motion.button>

//           <motion.button
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             onClick={() => onSubscribe('monthly')}
//             className="w-full text-left bg-white/5 hover:bg-white/10 border-2 border-white/10 rounded-2xl p-5 transition-all"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg text-white">Monthly Plan</h3>
//                 <p className="text-gray-400">Billed monthly</p>
//               </div>
//               <div className="text-2xl text-white font-bold">$9.99/mo</div>
//             </div>
//           </motion.button>
//         </div>

//         {/* CTA */}
//         <motion.button
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//           onClick={() => onSubscribe('yearly')}
//           className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl py-4 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all group flex items-center justify-center gap-2 text-lg"
//         >
//           <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
//           <span>Start Free 7-Day Trial</span>
//         </motion.button>

//         {/* Footer */}
//         <div className="mt-6 text-center text-xs text-gray-500">
//           <p>A subscription is required to access Pro features. You can cancel anytime.</p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

import { motion } from 'motion/react';
import { Check, Star, Zap, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Purchases } from '@revenuecat/purchases-js';

export function Paywall() {
  const [offerings, setOfferings] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const features = [
    'Unlock all planetary tournaments',
    'Unlimited custom practice sessions',
    'Advanced performance analytics & charts',
    'Track your global leaderboard rank',
  ];

  const onClose = () => { };

  const onSubscribe = async (term: string) => {
    if (!offerings?.current) return;
    
    setLoading(true);
    try {
      const purchases = Purchases.getSharedInstance();
      
      // Find the package based on the term (yearly or monthly)
      const packageToSubscribe = offerings.current.availablePackages.find(
        (pkg:any) => pkg.identifier.toLowerCase().includes(term.toLowerCase())
      );

      if (!packageToSubscribe) {
        console.error('Package not found for term:', term);
        return;
      }

      // Purchase the package
      const { customerInfo } = await purchases.purchase( {rcPackage: packageToSubscribe });
      console.log('Purchase successful:', customerInfo);
      
      // Check if user has active entitlement
      if (customerInfo.entitlements.active['pro']) {
        // User now has pro access - handle success
        alert('Subscription successful!');
        onClose();
      }
    } catch (error: any) {
      if (error.userCancelled) {
        console.log('User cancelled the purchase');
      } else {
        console.error('Purchase error:', error);
        alert('Purchase failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const purchases = Purchases.getSharedInstance();
        const fetchedOfferings = await purchases.getOfferings();
        console.log('Offerings:', fetchedOfferings);
        setOfferings(fetchedOfferings);

        if (!fetchedOfferings.current) {
          console.error('No current offering available');
        }
      } catch (error) {
        console.error('Error fetching offerings:', error);
      }
    };
    init();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="pt-8 relative w-full max-w-lg px-4"
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
            disabled={loading || !offerings}
            className="w-full text-left bg-white/5 hover:bg-white/10 border-2 border-purple-500 rounded-2xl p-5 transition-all relative disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute top-2 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              SAVE 25%
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white">Yearly Plan</h3>
                <p className="text-gray-400">$89.99 / year</p>
              </div>
              <div className="text-2xl text-white font-bold">$7.50/mo</div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => onSubscribe('monthly')}
            disabled={loading || !offerings}
            className="w-full text-left bg-white/5 hover:bg-white/10 border-2 border-white/10 rounded-2xl p-5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg text-white">Monthly Plan</h3>
                <p className="text-gray-400">Billed monthly</p>
              </div>
              <div className="text-2xl text-white font-bold">$9.99/mo</div>
            </div>
          </motion.button>
        </div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => onSubscribe('yearly')}
          disabled={loading || !offerings}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-2xl py-4 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all group flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>{loading ? 'Processing...' : 'Start Free 7-Day Trial'}</span>
        </motion.button>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>A subscription is required to access Pro features. You can cancel anytime.</p>
        </div>
      </motion.div>
    </div>
  );
}