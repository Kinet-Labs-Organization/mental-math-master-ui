# Mental Math Master UI

Frontend application for Mental Math Master, built with React, TypeScript, and Vite, with optional native packaging via Capacitor.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Zustand (state)
- React Router DOM 7
- Firebase Authentication
- RevenueCat (native subscription flow)
- Capacitor (iOS/Android wrapper)

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+
- For mobile: Xcode (iOS) and/or Android Studio (Android)

## Setup

```bash
cd mental-math-master-ui
npm install
```

## Environment Variables

This app reads Vite env vars through `src/config/env.ts`.

Required variables:

- `VITE_APP_ENV`
- `VITE_APP_NAME`
- `VITE_API_BASE_URL`
- `VITE_PORT`
- `VITE_EMAIL_LOGIN`
- `VITE_IMAGE_BASE_URL`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_PRIVACY_POLICY_URL`
- `VITE_TERMS_OF_USE_URL`

Optional (native subscriptions):

- `VITE_REVENUECAT_IOS_API_KEY`
- `VITE_REVENUECAT_ANDROID_API_KEY`
- `VITE_REVENUECAT_OFFERING_ID`

Environment files available in repo:

- `.env.development`
- `.env.development.local`
- `.env.qa`
- `.env.production`

## Run Locally

```bash
npm run dev
```

The dev server port is read from `VITE_PORT` (fallback in config: `3000`).

## Scripts

### Development and Validation

- `npm run dev` - start local dev server
- `npm run type-check` - TypeScript check (`tsc --noEmit`)
- `npm run lint` - ESLint for `.ts/.tsx`
- `npm run lint:fix` - auto-fix lint issues
- `npm run format` - format `src/**/*.ts` with Prettier

### Web Builds

- `npm run build` - default build
- `npm run build:dev` - development-mode build
- `npm run build:qa` - QA-mode build
- `npm run build:prod` - production build
- `npm run preview:dev` - preview dev build
- `npm run preview:qa` - preview QA build
- `npm run preview:prod` - preview prod build
- `npm run clean` - remove `dist`

### Capacitor / iOS

- `npm run ios:add`
- `npm run ios:sync`
- `npm run ios:open`
- `npm run ios:run`
- `npm run ios:build`
- `npm run ios:prepare` (web build + iOS sync)
- `npm run ios:prepare:prod` (prod web build + iOS sync)

## Project Structure

```text
src/
  assets/        static assets (images/audio)
  components/    UI components and game screens
  config/        env mapping and runtime config
  libs/          Firebase and related setup
  services/      service integrations (e.g. RevenueCat)
  store/         Zustand stores
  styles/        global styles
  utils/         helpers and API utilities
```

## Notes

- `src/config/env.ts` validates required env vars in production.
- Custom practice supports `flash` and `regular` game types.
- Divide-mode custom practice sends additional divisor metadata in payload.

## Mobile References

For native workflows, see:

- `README-mobile.md`
- `README-ios-distribution.md`
