# Mobile Build & Sync Guide

This project uses Capacitor.

## Prerequisites

- Node.js + npm installed
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

## Install Dependencies

```bash
npm install
```

## Build Web Assets

```bash
npm run build
```

## Sync Capacitor Platforms

Sync both platforms:

```bash
npx cap sync
```

Or sync individually:

```bash
npx cap sync android
npx cap sync ios
```

## Open Native Projects

Android:

```bash
npx cap open android
```

iOS:

```bash
npx cap open ios
```

Then run from Android Studio / Xcode.

## Typical Update Flow After Code Changes

```bash
npm run build
npx cap sync
```

If needed, clean native build in IDE and run again.

## RevenueCat (Native)

Set these env values before building native apps:

```bash
VITE_REVENUECAT_IOS_API_KEY=appl_xxx
VITE_REVENUECAT_ANDROID_API_KEY=goog_xxx
VITE_REVENUECAT_OFFERING_ID=default
```

Then run:

```bash
npm run build
npx cap sync ios
npx cap sync android
```

Web app keeps using existing backend upgrade flow and does not require native RevenueCat keys.
