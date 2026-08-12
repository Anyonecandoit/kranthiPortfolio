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
  plugins: {
    SplashScreen: {
      // Hide early from components/native-shell.tsx after first paint so the
      // branded splash melts straight into the page (no white flash), while
      // launchAutoHide: true keeps a native-side timer as a safety net — even
      // if the WebView fails to load, the splash always clears on its own.
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#f2f0ee",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      // Resize the WebView around the keyboard instead of overlapping it, and
      // do the same when Android is in edge-to-edge (fullscreen) mode.
      resize: "native",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
