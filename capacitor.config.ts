import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.cookie.bpocket",
  appName: "PocketLibrary",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
