import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockCapacitor = vi.hoisted(() => ({
  getPlatform: vi.fn(),
  isNativePlatform: vi.fn(),
}));

const mockPurchases = vi.hoisted(() => ({
  setLogLevel: vi.fn(),
  configure: vi.fn(),
  getOfferings: vi.fn(),
  purchasePackage: vi.fn(),
  getCustomerInfo: vi.fn(),
  addCustomerInfoUpdateListener: vi.fn(),
  removeCustomerInfoUpdateListener: vi.fn(),
}));

const mockConfig = vi.hoisted(() => ({
  revenueCatIOSApiKey: 'ios-key',
  revenueCatAndroidApiKey: 'android-key',
  revenueCatOfferingId: undefined as string | undefined,
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: mockCapacitor,
}));

vi.mock('@revenuecat/purchases-capacitor', () => ({
  LOG_LEVEL: {
    DEBUG: 'DEBUG',
  },
  Purchases: mockPurchases,
}));

vi.mock('../config/env', () => ({
  default: mockConfig,
}));

const loadService = async () => {
  vi.resetModules();
  return import('./revenuecat');
};

const annualPackage = {
  identifier: 'annual-package',
  packageType: 'ANNUAL',
};

const monthlyPackage = {
  identifier: 'monthly-package',
  packageType: 'MONTHLY',
};

const fallbackPackage = {
  identifier: 'fallback-package',
  packageType: 'CUSTOM',
};

describe('revenuecat service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockConfig.revenueCatIOSApiKey = 'ios-key';
    mockConfig.revenueCatAndroidApiKey = 'android-key';
    mockConfig.revenueCatOfferingId = undefined;
    mockCapacitor.getPlatform.mockReturnValue('ios');
    mockCapacitor.isNativePlatform.mockReturnValue(true);
    mockPurchases.configure.mockResolvedValue(undefined);
    mockPurchases.setLogLevel.mockResolvedValue(undefined);
    mockPurchases.getOfferings.mockResolvedValue({
      current: {
        identifier: 'current-offering',
        availablePackages: [annualPackage, monthlyPackage],
      },
      all: {},
    });
    mockPurchases.purchasePackage.mockResolvedValue({
      customerInfo: { id: 'customer-info' },
    });
    mockPurchases.getCustomerInfo.mockResolvedValue({
      customerInfo: {
        entitlements: {
          active: {},
        },
      },
    });
    mockPurchases.addCustomerInfoUpdateListener.mockResolvedValue('listener-id');
    mockPurchases.removeCustomerInfoUpdateListener.mockResolvedValue(undefined);
  });

  it('reports RevenueCat disabled outside native platforms', async () => {
    mockCapacitor.isNativePlatform.mockReturnValue(false);
    const { isNativeRevenueCatEnabled } = await loadService();

    expect(isNativeRevenueCatEnabled()).toBe(false);
  });

  it('reports RevenueCat enabled for native platforms with an API key', async () => {
    const { isNativeRevenueCatEnabled } = await loadService();

    expect(isNativeRevenueCatEnabled()).toBe(true);
  });

  it('configures RevenueCat with the current platform API key once per user', async () => {
    const { configureRevenueCat } = await loadService();

    await configureRevenueCat('user-123');
    await configureRevenueCat('user-123');

    expect(mockPurchases.setLogLevel).toHaveBeenCalledTimes(1);
    expect(mockPurchases.setLogLevel).toHaveBeenCalledWith({ level: 'DEBUG' });
    expect(mockPurchases.configure).toHaveBeenCalledTimes(1);
    expect(mockPurchases.configure).toHaveBeenCalledWith({
      apiKey: 'ios-key',
      appUserID: 'user-123',
    });
  });

  it('throws when configuring without an API key for the platform', async () => {
    mockConfig.revenueCatIOSApiKey = undefined as any;
    const { configureRevenueCat } = await loadService();

    await expect(configureRevenueCat('user-123')).rejects.toThrow(
      'RevenueCat API key is missing for current native platform.'
    );
    expect(mockPurchases.configure).not.toHaveBeenCalled();
  });

  it('selects a configured offering when one is provided', async () => {
    mockConfig.revenueCatOfferingId = 'pro-offering';
    mockPurchases.getOfferings.mockResolvedValue({
      current: {
        identifier: 'current-offering',
        availablePackages: [],
      },
      all: {
        'pro-offering': {
          identifier: 'pro-offering',
          availablePackages: [monthlyPackage],
        },
      },
    });
    const { getOfferings } = await loadService();

    const result = await getOfferings();

    expect(result.selectedOffering.identifier).toBe('pro-offering');
  });

  it('purchases the annual package for the yearly plan', async () => {
    const { purchasePlanWithRevenueCat } = await loadService();

    const customerInfo = await purchasePlanWithRevenueCat('yearly');

    expect(mockPurchases.purchasePackage).toHaveBeenCalledWith({
      aPackage: annualPackage,
    });
    expect(customerInfo).toEqual({ id: 'customer-info' });
  });

  it('purchases the monthly package for monthly and trial plans', async () => {
    const { purchasePlanWithRevenueCat } = await loadService();

    await purchasePlanWithRevenueCat('monthly');
    await purchasePlanWithRevenueCat('trial');

    expect(mockPurchases.purchasePackage).toHaveBeenNthCalledWith(1, {
      aPackage: monthlyPackage,
    });
    expect(mockPurchases.purchasePackage).toHaveBeenNthCalledWith(2, {
      aPackage: monthlyPackage,
    });
  });

  it('falls back to the first available package when the preferred package is absent', async () => {
    mockPurchases.getOfferings.mockResolvedValue({
      current: {
        identifier: 'custom-offering',
        availablePackages: [fallbackPackage],
      },
      all: {},
    });
    const { purchasePlanWithRevenueCat } = await loadService();

    await purchasePlanWithRevenueCat('yearly');

    expect(mockPurchases.purchasePackage).toHaveBeenCalledWith({
      aPackage: fallbackPackage,
    });
  });

  it('throws a helpful error when no offering is available', async () => {
    mockConfig.revenueCatOfferingId = 'missing-offering';
    mockPurchases.getOfferings.mockResolvedValue({
      current: null,
      all: {
        other: {
          identifier: 'other',
          availablePackages: [monthlyPackage],
        },
      },
    });
    const { purchasePlanWithRevenueCat } = await loadService();

    await expect(purchasePlanWithRevenueCat('monthly')).rejects.toThrow(
      'No RevenueCat offering found. requested=missing-offering available=other'
    );
  });

  it('throws when the selected offering has no purchasable packages', async () => {
    mockPurchases.getOfferings.mockResolvedValue({
      current: {
        identifier: 'empty-offering',
        availablePackages: [],
      },
      all: {},
    });
    const { purchasePlanWithRevenueCat } = await loadService();

    await expect(purchasePlanWithRevenueCat('monthly')).rejects.toThrow(
      'No purchasable package in offering=empty-offering'
    );
  });

  it('maps customer info without a pro entitlement to an unsubscribed snapshot', async () => {
    const { getRevenueCatSubscriptionSnapshot } = await loadService();

    await expect(getRevenueCatSubscriptionSnapshot()).resolves.toEqual({
      status: 'UNSUBSCRIBED',
      subscriptionExpiration: null,
      term: null,
    });
  });

  it('maps active monthly, yearly, and trial entitlements to subscription snapshots', async () => {
    const { getRevenueCatSubscriptionSnapshot } = await loadService();

    mockPurchases.getCustomerInfo.mockResolvedValueOnce({
      customerInfo: {
        entitlements: {
          active: {
            mental_math_master_pro: {
              expirationDateMillis: '1710000000000',
              productIdentifier: 'rc_promo_mental_math_master_pro_monthly',
            },
          },
        },
      },
    });
    await expect(getRevenueCatSubscriptionSnapshot()).resolves.toEqual({
      status: 'PRO',
      subscriptionExpiration: '1710000000000',
      term: 'd30',
    });

    mockPurchases.getCustomerInfo.mockResolvedValueOnce({
      customerInfo: {
        entitlements: {
          active: {
            mental_math_master_pro: {
              expirationDateMillis: '1720000000000',
              productIdentifier: 'rc_promo_mental_math_master_yearly_pro',
            },
          },
        },
      },
    });
    await expect(getRevenueCatSubscriptionSnapshot()).resolves.toEqual({
      status: 'PRO',
      subscriptionExpiration: '1720000000000',
      term: 'd365',
    });

    mockPurchases.getCustomerInfo.mockResolvedValueOnce({
      customerInfo: {
        entitlements: {
          active: {
            mental_math_master_pro: {
              expirationDateMillis: '1730000000000',
              productIdentifier: 'trial-product',
            },
          },
        },
      },
    });
    await expect(getRevenueCatSubscriptionSnapshot()).resolves.toEqual({
      status: 'PRO',
      subscriptionExpiration: '1730000000000',
      term: 'd7',
    });
  });

  it('notifies subscription listeners and returns a cleanup function', async () => {
    const { addRevenueCatSubscriptionListener } = await loadService();
    const onChange = vi.fn();

    const unsubscribe = await addRevenueCatSubscriptionListener(onChange);
    const listener = mockPurchases.addCustomerInfoUpdateListener.mock.calls[0][0];
    listener({
      entitlements: {
        active: {
          mental_math_master_pro: {
            expirationDateMillis: '1710000000000',
            productIdentifier: 'rc_promo_mental_math_master_pro_monthly',
          },
        },
      },
    });
    await unsubscribe();

    expect(onChange).toHaveBeenCalledWith({
      status: 'PRO',
      subscriptionExpiration: '1710000000000',
      term: 'd30',
    });
    expect(mockPurchases.removeCustomerInfoUpdateListener).toHaveBeenCalledWith({
      listenerToRemove: 'listener-id',
    });
  });
});
