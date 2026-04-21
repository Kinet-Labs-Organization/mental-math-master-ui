# iOS Build and Distribution Guide

This guide explains how to build, run, sign, and distribute the iOS app for this Capacitor project.

## 1. Prerequisites

- macOS with Xcode installed
- Apple ID signed in to Xcode (`Xcode > Settings > Accounts`)
- Node.js + npm installed
- Project dependencies installed: `npm install`

For App Store/TestFlight distribution, a paid Apple Developer Program account is required.

## 2. Direct iOS Commands

- Add iOS platform: `npx cap add ios`
- Sync web build + plugins to iOS: `npx cap sync ios`
- Open Xcode project: `npx cap open ios`
- Run using Capacitor CLI: `npx cap run ios`
- Build using Capacitor CLI: `npx cap build ios`

## 3. Daily iOS Dev Flow

1. Build web assets:
   `tsc -b && vite build`
2. Sync to iOS:
   `npx cap sync ios`
3. Open in Xcode:
   `npx cap open ios`
4. In Xcode, choose simulator/device and run (`Cmd+R`).

If `ios` is not present yet, run `npx cap add ios` once first.

## 4. Simulator vs Physical iPhone

- Simulator build and device build are different targets.
- After switching to a physical iPhone, Xcode must build/sign again.
- Physical device testing is strongly recommended before release.

## 5. Firebase iOS Config

The app requires `GoogleService-Info.plist` for native Firebase.

Expected location:
- `ios/App/App/GoogleService-Info.plist`

Also ensure it is included in:
- Target `App` -> `Build Phases` -> `Copy Bundle Resources`

If missing, app can crash on launch with `FirebaseApp.configure()` errors.

## 6. Signing and Provisioning Basics

In Xcode target `App` -> `Signing & Capabilities`:

- `Automatically manage signing` = ON
- Select correct `Team`
- Bundle identifier must be valid/unique for that team

Common issue symptoms:
- `Command CodeSign failed with a nonzero exit code`
- `errSecInternalComponent`
- Missing/invalid provisioning profile UUID

Useful local checks:

```bash
security find-identity -v -p codesigning
ls -la ~/Library/Developer/Xcode/UserData/Provisioning\ Profiles
ls -la ~/Library/MobileDevice/Provisioning\ Profiles
```

## 7. If Packages Break (SPM / XCFramework errors)

If you see missing package artifacts (for example missing `.xcframework`):

1. Xcode -> `File > Packages > Reset Package Caches`
2. Xcode -> `File > Packages > Resolve Package Versions`
3. Xcode -> `Product > Clean Build Folder`
4. Rebuild

Optional cleanup:

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ~/Library/Caches/org.swift.swiftpm
rm -rf ~/Library/org.swift.swiftpm
```

## 8. Release Config Note (`server.url`)

For App Store/release-style builds, do not use `server.url` in Capacitor config.  
Use bundled `dist` assets (`webDir: "dist"`), then `build + sync + archive`.

## 9. Distribution (TestFlight / App Store)

1. Prepare production build and sync:
   `tsc -b && vite build --mode production`
   `npx cap sync ios`
2. `npx cap open ios`
3. In Xcode: `Product > Archive`
4. In Organizer: `Distribute App`
5. Upload to:
   - TestFlight (recommended first), or
   - App Store Connect (production release)

## 10. Git Commit Guidance

In this project, `.gitignore` currently ignores:
- `dist/`
- `node_modules/`
- `ios/` (except `ios/.gitignore`)

So usually commit only source/config changes (for example `src`, `package.json`, `capacitor.config.ts`, docs).  
If your team wants to track native iOS manual edits, you should stop ignoring `ios/`.
