const CONSTANTS = {
  AUTHENTICATED_USER_STORAGE_KEY: "authenticatedUser",
  ONBOARDING_FLAG_STORAGE_KEY: "onboardingUser",
  PAYWALL_FLAG_STORAGE_KEY: "onboardingUserPaywall",
  FLASH_GAME_LEVEL_STORAGE_KEY: "flashGameLevel",
  REGULAR_GAME_LEVEL_STORAGE_KEY: "regularGameLevel",
  USER_SYNCED_FLAG_STORAGE_KEY: "userSynced",
  PRICING_PACKAGES: {
    yearly: {
      yearly: "80",
      monthly: "6.67",
      numericPricePerMonth: 6.67
    },
    monthly: {
      yearly: "96",
      monthly: "8",
      numericPricePerMonth: 8
    }
  },
  PRICING_PACKAGES_DOSCOUNT_ON_YEARLY: 16.67
};

export default CONSTANTS;
