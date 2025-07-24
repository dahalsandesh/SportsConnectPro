'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform: () => boolean;
    };
  }
}

export default function BackButtonHandler() {
  const router = useRouter();

  useEffect(() => {
    // Only add listener on client-side and if running in Capacitor
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform()) {
      let backButtonListener: { remove: () => void } | null = null;

      const setupBackButtonListener = async () => {
        try {
          backButtonListener = await App.addListener('backButton', () => {
            if (window.history.state?.idx > 0) {
              router.back();
            } else {
              // If no more history, minimize the app instead of closing
              App.minimizeApp().catch(() => {
                // Fallback to exit if minimize is not available
                App.exitApp();
              });
            }
          });
        } catch (error) {
          console.error('Failed to set up back button listener:', error);
        }
      };

      setupBackButtonListener();

      return () => {
        if (backButtonListener) {
          backButtonListener.remove();
        }
      };
    }
  }, [router]);

  return null; // This component doesn't render anything
}
