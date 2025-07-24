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
      // Redirect to login with return URL
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      setIsRegistering(true);
      const user = JSON.parse(userData);
      
      const result = await registerForEvent({
        userId: user.userId,
        eventId,
      }).unwrap();

      if (result.success) {
        toast.success('Successfully registered for the event!');
        // Optionally refresh the page or update the UI
        window.location.reload();
      } else {
        toast.error(result.message || 'Failed to register for the event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('An error occurred while registering for the event');
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
