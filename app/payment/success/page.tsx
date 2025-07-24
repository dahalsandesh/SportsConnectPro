'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type PaymentStatus = 'processing' | 'success' | 'pending' | 'failed' | 'cancelled' | 'expired';

// Component to display payment details
const PaymentDetails = ({ paymentData, status }: { paymentData: any, status: PaymentStatus }) => {
  if (!paymentData.amount) return null;
  
  const statusColors = {
    success: 'text-green-600',
    pending: 'text-yellow-600',
    failed: 'text-red-600',
    cancelled: 'text-red-600',
    expired: 'text-red-600',
    processing: 'text-blue-600'
  };
  
  const statusText = {
    success: 'COMPLETED',
    pending: 'PENDING',
    failed: 'FAILED',
    cancelled: 'CANCELLED',
    expired: 'EXPIRED',
    processing: 'PROCESSING'
  };

  // Format amount to display in NPR
  const formatAmount = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) / 100 : amount / 100;
    return `NPR ${numAmount.toLocaleString('en-NP')}`;
  };

  return (
    <div className="mt-6 w-full max-w-md space-y-4 rounded-lg border bg-card p-6 text-left">
      <h3 className="text-lg font-semibold mb-4">Payment Receipt</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className={`font-medium ${statusColors[status] || ''}`}>
            {statusText[status] || (paymentData.status ? paymentData.status.toUpperCase() : 'UNKNOWN')}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Amount Paid:</span>
          <span className="font-medium">{formatAmount(paymentData.amount)}</span>
        </div>
        
        {paymentData.transaction_id && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction ID:</span>
            <span className="font-mono text-sm">{paymentData.transaction_id}</span>
          </div>
        )}
        
        {paymentData.pidx && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment ID (PIDX):</span>
            <span className="font-mono text-sm">{paymentData.pidx}</span>
          </div>
        )}
        
        {paymentData.purchase_order_id && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID:</span>
            <span className="font-mono text-sm">{paymentData.purchase_order_id}</span>
          </div>
        )}
        
        {paymentData.purchase_order_name && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="text-right">{paymentData.purchase_order_name}</span>
          </div>
        )}
        
        {paymentData.mobile && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mobile:</span>
            <span>{paymentData.mobile}</span>
          </div>
        )}
        
        <div className="pt-2 mt-4 border-t">
          <p className="text-sm text-muted-foreground">
            A receipt has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    pidx?: string;
    transaction_id?: string;
    amount?: string;
    status?: string;
    purchase_order_id?: string;
  }>({});

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pidx = searchParams.get('pidx');
        const transaction_id = searchParams.get('transaction_id');
        const amount = searchParams.get('amount');
        const status = searchParams.get('status');
        const purchase_order_id = searchParams.get('purchase_order_id');

        if (!pidx) {
          throw new Error('Invalid payment reference');
        }

        // Get courtId from URL
        const courtId = searchParams.get('courtId');
        
        // Get user data from localStorage
        let userId = '';
        try {
          const userData = localStorage.user ? JSON.parse(localStorage.user) : null;
          userId = userData?.userId || '';
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
        
        // Prepare payment data
        const paymentInfo = {
          pidx,
          transaction_id,
          amount,
          status,
          purchase_order_id: purchase_order_id || searchParams.get('purchaseOrderId'),
          courtId: courtId || '',
          userId
        };
        
        setPaymentData(paymentInfo);
        
        // Determine the status from the response
        const paymentStatus = determineStatus(status);
        setStatus(paymentStatus);
        
        // Only verify with our backend for pending or success status
        if (paymentStatus === 'success' || paymentStatus === 'pending') {
          try {
            // Get token directly from localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            
            if (!token) {
              console.error('No authentication token found');
              throw new Error('Authentication required. Please log in again.');
            }
            
            const response = await fetch('http://127.0.0.1:8000/web/api/v1/user/VerifyPayment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`, // Using 'Token' prefix as per standard
              },
              body: JSON.stringify({
                pidx,
                purchaseOrderId: paymentInfo.purchase_order_id,
                courtId: paymentInfo.courtId,
                userId: paymentInfo.userId
              })
            });

            if (!response.ok) {
              throw new Error('Payment verification failed');
            }

            const result = await response.json();
            console.log('Payment verification response:', result);
            
            if (response.ok) {
              // Update payment data with the response
              setPaymentData(prev => ({
                ...prev,
                status: 'Completed',
                message: result.message || 'Payment Verified Successfully',
                // Include any additional data from the response
                ...(result.data || {})
              }));
              
              // Set status to success since we got a 200 OK
              setStatus('success');
              toast.success('Payment verified successfully!');
              
              // Redirect to home after 30 seconds for success status
              const timer = setTimeout(() => {
                router.push('/');
              }, 30000);
              
              return () => clearTimeout(timer);
            } else {
              throw new Error(result.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            // Don't change status if verification fails, keep the original status
            toast.error('Payment verification failed. Please contact support.');n
          }
        } else {
          // For failed/cancelled/expired, show appropriate message
          if (paymentStatus === 'cancelled') {
            toast.error('Payment was cancelled');
          } else if (paymentStatus === 'expired') {
            toast.error('Payment session expired');
          } else {
            toast.error('Payment failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        toast.error('Payment verification failed. Please contact support.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  const handleReturnHome = () => {
    router.push('/');
  };

  // Determine status from URL or API response
  const determineStatus = (status?: string | null): PaymentStatus => {
    if (!status) return 'processing';
    
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus === 'completed') return 'success';
    if (['pending', 'initiated', 'processing'].includes(normalizedStatus)) return 'pending';
    if (['cancelled', 'canceled', 'user_cancelled'].includes(normalizedStatus)) return 'cancelled';
    if (normalizedStatus === 'expired') return 'expired';
    if (['failed', 'rejected', 'error'].includes(normalizedStatus)) return 'failed';
    
    return 'processing';
  };

  const renderContent = () => {
    // Show loading state while verifying
    if (isVerifying) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <h2 className="text-2xl font-semibold">Verifying your payment...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment status.</p>
        </div>
      );
    }

    // Success state - Payment completed
    if (status === 'success') {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold">Payment Successful!</h2>
          <p className="text-muted-foreground max-w-md">
            Thank you for your payment. Your booking has been confirmed.
          </p>
          
          <PaymentDetails paymentData={paymentData} status={status} />
          
          <p className="text-sm text-muted-foreground mt-4">
            You will be redirected to the home page shortly...
          </p>
          
          <Button onClick={handleReturnHome} className="mt-4">
            Return to Home Now
          </Button>
        </div>
      );
    }

    // Pending state - Payment in progress
    if (status === 'pending') {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="rounded-full bg-yellow-100 p-4">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-600" />
          </div>
          <h2 className="text-2xl font-semibold">Payment Processing</h2>
          <p className="text-muted-foreground max-w-md">
            Your payment is being processed. This may take a few minutes.
            Our team will contact you shortly once the payment is confirmed.
          </p>
          
          <PaymentDetails paymentData={paymentData} status={status} />
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 max-w-md text-left">
            <h4 className="font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              What's next?
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check your email for payment confirmation</li>
              <li>Our team will verify your payment shortly</li>
              <li>You'll receive a confirmation once processed</li>
            </ul>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button variant="default" onClick={handleReturnHome}>
              Return to Home
            </Button>
            <a 
              href="mailto:support@sportsconnectpro.com" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Contact Support
            </a>
          </div>
        </div>
      );
    }

    // Failed/Cancelled/Expired states
    const isCancelled = status === 'cancelled';
    const isExpired = status === 'expired';
    
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-red-100 p-4">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-semibold">
          {isCancelled ? 'Payment Cancelled' : isExpired ? 'Payment Expired' : 'Payment Failed'}
        </h2>
        
        <p className="text-muted-foreground max-w-md">
          {isCancelled 
            ? 'You cancelled the payment process. Your booking was not confirmed.'
            : isExpired
              ? 'The payment session has expired. Please try again if you wish to complete your booking.'
              : 'We encountered an issue processing your payment. Please try again or contact support if the problem persists.'
          }
        </p>
        
        <PaymentDetails paymentData={paymentData} status={status} />
        
        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={handleReturnHome}>
            Return to Home
          </Button>
          {!isExpired && (
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-red-50 rounded-lg text-sm text-red-800 max-w-md text-left">
          <h4 className="font-medium mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Need help?
          </h4>
          <p className="mb-2">
            If you're experiencing issues, please contact our support team:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Email: support@sportsconnectpro.com</li>
            <li>Phone: +977-XXXXXXXXXX</li>
            <li>Hours: 9 AM - 6 PM, 7 days a week</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="container flex min-h-[calc(100vh-200px)] flex-col items-center justify-center py-12">
      {renderContent()}
    </div>
  );
}
