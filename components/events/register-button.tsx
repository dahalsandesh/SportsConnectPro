'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRegisterForEventMutation } from '@/redux/api/user';
import { toast } from 'sonner';

interface RegisterButtonProps {
  eventId: string;
  className?: string;
}

export function RegisterButton({ eventId, className }: RegisterButtonProps) {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerForEvent] = useRegisterForEventMutation();

  const handleRegister = async () => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      const currentUrl = window.location.href;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    try {
      setIsRegistering(true);
      const user = JSON.parse(userData);
      
      const result = await registerForEvent({
        userId: user.userId,
        eventId,
      }).unwrap();
      
      // Show success message
      const successMessage = result?.message || 'Successfully registered for the event!';
      toast.success(successMessage);
      
    } catch (error: any) {
      // Extract the error message from the error object
      const errorData = error?.data || {};
      let errorMessage = errorData?.message || error?.message || 'An error occurred while registering for the event';
      const isAlreadyRegistered = error.status === 409 || errorData.message?.includes('Already Registered');
      
      // Show the toast
      if (isAlreadyRegistered) {
        toast.info('Already registered for this event');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Button 
      onClick={handleRegister} 
      disabled={isRegistering}
      className={className}
    >
      {isRegistering ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Registering...
        </>
      ) : (
        'Register Now'
      )}
    </Button>
  );
}
