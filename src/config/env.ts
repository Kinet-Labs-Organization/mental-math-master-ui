// src/config/env.ts

interface Config {
  appEnv: "development" | "production" | "qa";
  appName: string;
  apiBaseURL: string;
  port: number;
  emailLogin: boolean;
  imageBaseURL:string;
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
  firebaseMeasurementId: string;
}

const config: Config = {
  appEnv: import.meta.env.VITE_APP_ENV,
  appName: import.meta.env.VITE_APP_NAME,
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  port: Number(import.meta.env.VITE_PORT),
  emailLogin: import.meta.env.VITE_EMAIL_LOGIN === "true" ? true : false,
  imageBaseURL: import.meta.env.VITE_IMAGE_BASE_URL,
  firebaseApiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  firebaseAuthDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: import.meta.env.VITE_FIREBASE_APP_ID,
  firebaseMeasurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required env vars
const validateConfig = () => {
  const required = [
    "VITE_APP_ENV",
    "VITE_APP_NAME",
    "VITE_API_BASE_URL",
    "VITE_PORT",
    "VITE_EMAIL_LOGIN",
    "VITE_IMAGE_BASE_URL",
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
    "VITE_FIREBASE_MEASUREMENT_ID"
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0 && import.meta.env.PROD) {
    console.error("Missing required environment variables:", missing);
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

validateConfig();

export default config;
