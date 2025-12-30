// src/config/env.ts

interface Config {
  appEnv: "development" | "production" | "qa";
  appName: string;
  apiBaseURL: string;
  port: number;
  emailLogin: boolean;
}

const config: Config = {
  appEnv: import.meta.env.VITE_APP_ENV,
  appName: import.meta.env.VITE_APP_NAME,
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  port: Number(import.meta.env.VITE_PORT),
  emailLogin: import.meta.env.VITE_EMAIL_LOGIN === "true" ? true : false,
};

// Validate required env vars
const validateConfig = () => {
  const required = [
    "VITE_APP_ENV",
    "VITE_APP_NAME",
    "VITE_API_BASE_URL",
    "VITE_PORT",
    "VITE_EMAIL_LOGIN",
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
