# Mental Math Master UI - Developer Technical Document

## 1. Purpose

This document is for developers maintaining and deploying the Mental Math Master UI.

The UI is a React + TypeScript + Vite application. It talks to the backend API, uses Firebase for authentication, supports Capacitor for mobile packaging, and optionally uses RevenueCat keys for native subscriptions.

## 2. Prerequisites

- Node.js 20+ recommended
- npm 10+
- Access to the backend API URL for the target environment
- Firebase web app credentials
- For iOS/Android builds: Xcode and/or Android Studio
- For Heroku deployment: Heroku CLI access and app permissions
- For GitHub Actions deployment: GitHub repository secrets configured

## 3. Environment Variables

The UI reads environment variables from Vite env files and maps them in `src/config/env.ts`.

Required:

```bash
VITE_APP_ENV=
VITE_APP_NAME=
VITE_API_BASE_URL=
VITE_PORT=
VITE_EMAIL_LOGIN=
VITE_IMAGE_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_PRIVACY_POLICY_URL=
VITE_TERMS_OF_USE_URL=
```

Optional for native RevenueCat subscription support:

```bash
VITE_REVENUECAT_IOS_API_KEY=
VITE_REVENUECAT_ANDROID_API_KEY=
VITE_REVENUECAT_OFFERING_ID=
```

Recommended files:

- `.env.development` for local development
- `.env.qa` for QA builds
- `.env.production` for production builds
- `.env.development.local` for developer machine overrides

Do not commit real production secrets if the repository is public or shared broadly.

## 4. Local Setup

```bash
cd mental-math-master-ui
npm install
npm run dev
```

Run checks before pushing:

```bash
npm run type-check
npm run lint
npm run build
```

## 5. Build Commands

```bash
npm run build       # default build
npm run build:dev   # development mode build
npm run build:qa    # QA mode build
npm run build:prod  # production mode build
```

Preview builds:

```bash
npm run preview:dev
npm run preview:qa
npm run preview:prod
```

## 6. QA Deployment

Recommended QA flow:

1. Set QA env values in `.env.qa`.
2. Ensure `VITE_API_BASE_URL` points to the QA backend.
3. Build with QA mode.
4. Deploy the generated `dist/` directory to the QA static host.

```bash
npm ci
npm run type-check
npm run lint
npm run build:qa
```

Deploy artifact:

```bash
dist/
```

## 7. Production Deployment

Recommended production flow:

1. Set production env values in `.env.production`.
2. Ensure `VITE_API_BASE_URL` points to the production backend.
3. Run checks.
4. Build production bundle.
5. Deploy `dist/` to production static hosting.

```bash
npm ci
npm run type-check
npm run lint
npm run build:prod
```

## 8. Docker Deployment

There is currently no UI Dockerfile in the project. If Docker deployment is required, use an Nginx static container pattern.

Recommended `Dockerfile`:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

QA image:

```bash
docker build --build-arg NODE_ENV=qa -t mental-math-master-ui:qa .
docker run -p 8080:80 mental-math-master-ui:qa
```

Production image:

```bash
docker build -t mental-math-master-ui:production .
docker run -p 8080:80 mental-math-master-ui:production
```

Important: Vite embeds env values at build time, so build one image per environment unless runtime env injection is added.

## 9. Heroku Deployment With GitHub Actions

For UI deployment on Heroku, use a static hosting approach. Common choices:

- Heroku static buildpack
- A Docker image serving `dist/` with Nginx

Required GitHub secrets:

```bash
HEROKU_API_KEY
HEROKU_EMAIL
HEROKU_UI_QA_APP
HEROKU_UI_PROD_APP
```

Example GitHub Actions workflow:

```yaml
name: Deploy UI

on:
  push:
    branches:
      - qa
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: mental-math-master-ui

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: mental-math-master-ui/package-lock.json

      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build:qa
        if: github.ref_name == 'qa'
      - run: npm run build:prod
        if: github.ref_name == 'main'

      - uses: akhileshns/heroku-deploy@v3.14.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          heroku_app_name: ${{ github.ref_name == 'main' && secrets.HEROKU_UI_PROD_APP || secrets.HEROKU_UI_QA_APP }}
          appdir: mental-math-master-ui
```

## 10. Mobile Build Notes

iOS:

```bash
npm run ios:prepare:prod
npm run ios:open
```

Then archive from Xcode for TestFlight/App Store.

See also:

- `README-mobile.md`
- `README-ios-distribution.md`

## 11. Pre-Release Checklist

- `npm run type-check` passes
- `npm run lint` passes
- `npm run build:prod` passes
- `npm audit --omit=dev` has no production vulnerabilities
- Production backend URL is correct
- Firebase project values match the target environment
- Privacy policy and terms URLs are correct
- Native RevenueCat keys are present only for native builds
