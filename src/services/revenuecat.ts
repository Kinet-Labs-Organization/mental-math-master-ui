import { Capacitor } from '@capacitor/core';
import { LOG_LEVEL, type PurchasesPackage, Purchases } from '@revenuecat/purchases-capacitor';
import config from '../config/env';

export type PaywallPlan = 'yearly' | 'monthly' | 'trial';
export type RevenueCatSubscriptionSnapshot = {
  status: 'PRO' | 'UNSUBSCRIBED';
  subscriptionExpiration: string | null;
};

let configuredUserId: string | null = null;

const getRevenueCatApiKey = () => {
  const platform = Capacitor.getPlatform();
  if (platform === 'ios') {
    return config.revenueCatIOSApiKey;
  }
  if (platform === 'android') {
    return config.revenueCatAndroidApiKey;
  }
  return undefined;
};

export const isNativeRevenueCatEnabled = () => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }
  return Boolean(getRevenueCatApiKey());
};

export const getOfferings = async () => {
  const offerings = await Purchases.getOfferings();
  const selectedOffering = config.revenueCatOfferingId
    ? offerings.all[config.revenueCatOfferingId]
    : offerings.current;
  console.log(offerings);
  console.log(selectedOffering);
  return {
    offerings,
    selectedOffering,
  }
}

export const configureRevenueCat = async (appUserID: string) => {
  const apiKey = getRevenueCatApiKey();
  if (!apiKey) {
    throw new Error('RevenueCat API key is missing for current native platform.');
  }

  if (configuredUserId === appUserID) {
    return;
  }

  await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
  await Purchases.configure({ apiKey, appUserID });
  configuredUserId = appUserID;
};

const getPackageForPlan = (plan: PaywallPlan, packages: PurchasesPackage[]) => {
  const selected = plan === 'yearly'
    ? packages.find((pack) => pack.packageType === 'ANNUAL')
    : packages.find((pack) => pack.packageType === 'MONTHLY');

  if (selected) {
    return selected;
  }

  return packages[0] ?? null;
};

export const purchasePlanWithRevenueCat = async (plan: PaywallPlan) => {
  // const offerings = await Purchases.getOfferings();
  // const selectedOffering = config.revenueCatOfferingId
  //   ? offerings.all[config.revenueCatOfferingId]
  //   : offerings.current;
  const { offerings, selectedOffering } = await getOfferings();

  if (!selectedOffering) {
    const availableOfferingIds = Object.keys(offerings.all ?? {});
    throw new Error(
      `No RevenueCat offering found. requested=${config.revenueCatOfferingId ?? 'current'} available=${availableOfferingIds.join(',') || 'none'}`
    );
  }

  const selectedPackage = getPackageForPlan(plan, selectedOffering.availablePackages);
  if (!selectedPackage) {
    throw new Error(`No purchasable package in offering=${selectedOffering.identifier}`);
  }

  const result = await Purchases.purchasePackage({ aPackage: selectedPackage });
  return result.customerInfo;
};

const mapCustomerInfoToSnapshot = (customerInfo: any): RevenueCatSubscriptionSnapshot => {
  const proEntitlement = customerInfo?.entitlements?.active?.pro ?? null;
  const expirationRaw = proEntitlement?.expirationDate ?? null;
  const expirationDate =
    expirationRaw && !Number.isNaN(new Date(expirationRaw).getTime())
      ? new Date(expirationRaw).toISOString()
      : null;

  if (!proEntitlement) {
    return {
      status: 'UNSUBSCRIBED',
      subscriptionExpiration: null,
    };
  }

  return {
    status: 'PRO',
    subscriptionExpiration: expirationDate,
  };
};

export const getRevenueCatSubscriptionSnapshot = async (): Promise<RevenueCatSubscriptionSnapshot> => {
  const customerInfo = await Purchases.getCustomerInfo();
  console.log('customer info');
  console.log(customerInfo);
  return mapCustomerInfoToSnapshot(customerInfo);
};

export const addRevenueCatSubscriptionListener = async (
  onChange: (snapshot: RevenueCatSubscriptionSnapshot) => void,
) => {
  const listenerId = await Purchases.addCustomerInfoUpdateListener((customerInfo) => {
    onChange(mapCustomerInfoToSnapshot(customerInfo));
  });

  return async () => {
    await Purchases.removeCustomerInfoUpdateListener({ listenerToRemove: listenerId });
  };
};
