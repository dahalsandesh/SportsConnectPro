"use client";

import { useEffect, useState } from 'react';
import { VenueOwnerHeader } from './header';

export function ClientVenueOwnerHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions as the header to prevent layout shift
    return <div className="h-16 w-full" />;
  }

  return <VenueOwnerHeader />;
}

export default ClientVenueOwnerHeader;
