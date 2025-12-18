// src/config/env.ts

interface Config {
  appEnv: "development" | "production" | "qa";
  appName: string;
}

const config: Config = {
  appEnv: import.meta.env.VITE_APP_ENV,
  appName: import.meta.env.VITE_APP_NAME,
};

// Validate required env vars
const validateConfig = () => {
  const required = ["VITE_APP_ENV", "VITE_APP_NAME"];

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
