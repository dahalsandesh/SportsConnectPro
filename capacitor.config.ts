import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.sportconnectpro.app",
  appName: "SportConnect Pro",
  webDir: "out",
  server: {
    url: "https://sportsconnectpro.vercel.app/",
    androidScheme: "https",
  }
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
