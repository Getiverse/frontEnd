declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_UNPLASH_KEY: string;
      NEXT_PUBLIC_BACKEND_URL: string;
      NEXT_PUBLIC_BACKEDN_DOMAIN: string;
      NEXT_PUBLIC_GIPHY: string;
      NEXT_PUBLIC_PEXELS: string;
      NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID: string;
      NEXT_PUBLIC_HOST: string;
      NEXT_PUBLIC_FILE_STACK: string;
      NEXT_PUBLIC_API_KEY: string;
      NEXT_PUBLIC_AUTH_DOMAIN: string;
      NEXT_PUBLIC_PROJECT_ID: string;
      NEXT_PUBLIC_STORAGE_BUCKET: string;
      NEXT_PUBLIC_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_APP_ID: string;
      NEXT_PUBLIC_MESURAMENT_ID: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
