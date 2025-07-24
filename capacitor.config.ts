import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.sportconnectpro.app",
  appName: "SportConnect Pro",
  webDir: "out",
  server: {
    // For development - uncomment the one you need
    // url: "http://10.0.2.2:3000", // Android Emulator
    url: "http://192.168.18.250:3000", // Local network for mobile testing
    androidScheme: "http",
    cleartext: true, // Allow HTTP traffic
    allowNavigation: [
      "http://10.0.2.2:8000", // For Android Emulator
      "http://192.168.18.250:8000" // For mobile devices on local network
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#10b981",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
}

export default config
