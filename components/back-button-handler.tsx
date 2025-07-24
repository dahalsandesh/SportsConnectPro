'use client';

import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { usePathname, useRouter } from 'next/navigation';

declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform: () => boolean;
    };
  }
}

export default function BackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const isCapacitor = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();

  useEffect(() => {
    if (!isCapacitor) return;

    const handleBackButton = () => {
      // Use the browser's history stack to determine if we can go back
      if (window.history.length > 1) {
        router.back();
      } else {
        // If no more history, minimize the app
        App.minimizeApp().catch(() => {
          // Fallback to exit if minimize is not available
          App.exitApp();
        });
      }
    };

    // Add the back button listener
    let backButtonListener: { remove: () => void } | null = null;
    
    const setupBackButtonListener = async () => {
      try {
        backButtonListener = await App.addListener('backButton', handleBackButton);
      } catch (error) {
        console.error('Failed to set up back button listener:', error);
      }
    };

    setupBackButtonListener();

    // Clean up the listener when the component unmounts
    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [isCapacitor, pathname, router]);

  return null; // This component doesn't render anything
}
