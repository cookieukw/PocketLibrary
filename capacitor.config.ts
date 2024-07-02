import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cookie.bpocket",
  appName: "Biblioteca Pocket",
  webDir: "dist",
  server: {
    hostname: "http://localhost:5174",
    androidScheme: "https",
  },
};

export default config;
