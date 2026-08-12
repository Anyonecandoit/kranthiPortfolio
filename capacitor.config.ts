import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "in.kranthikumarkatta.portfolio",
  appName: "Kranthi Kumar Katta",
  webDir: "out",
  // Keep Capacitor's default https://localhost scheme on Android — needed so
  // fetch() to the deployed https backend works without mixed-content issues.
  server: {
    androidScheme: "https",
  },
};

export default config;
