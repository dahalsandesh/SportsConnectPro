"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { useVerifyOtpMutation, useChangePasswordMutation } from "@/redux/api/common/authApi"
import { cn } from "@/lib/utils"

const otpVerificationSchema = z.object({
  otp: z.string().min(4, { message: "OTP must be 4 digits" }).max(4, { message: "OTP must be 4 digits" }),
})

const passwordResetSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type OtpVerificationFormValues = z.infer<typeof otpVerificationSchema>
type PasswordResetFormValues = z.infer<typeof passwordResetSchema>

export function OtpVerificationForm({ email, onBack }: { email: string; onBack: () => void }) {
  const [step, setStep] = useState<"otp" | "password">("otp")
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [changePassword, { isLoading: isResetting }] = useChangePasswordMutation()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Start cooldown timer on component mount
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const otpForm = useForm<OtpVerificationFormValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  })

  const passwordForm = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/api/v1/account/user/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        toast.success("New OTP has been sent to your email");
        setResendCooldown(60); // 1 minute cooldown
      } else {
        throw new Error(responseData?.message || "Failed to send OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const onOtpSubmit = async (data: OtpVerificationFormValues) => {
    setError(null);
    setIsSubmitting(true);
    
    // Ensure OTP is exactly 4 digits
    const otp = data.otp.trim();
    if (otp.length !== 4) {
      const errorMessage = "Please enter a 4-digit OTP code";
      setError(errorMessage);
      toast.error(errorMessage);
      setIsSubmitting(false);
      return;
    }
    
    // Show loading state
    const loadingToast = toast.loading("Verifying OTP...");
    
    try {
      console.log("Sending OTP verification request with:", { email, otp });
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/api/v1/account/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      
      const responseData = await response.json();
      console.log("OTP verification response:", response.status, responseData);
      
      if (response.ok) {
        // Store verification status in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('otpVerified', 'true');
          localStorage.setItem('otpVerifiedEmail', email);
          localStorage.setItem('resetPasswordEmail', email); // Keep for backward compatibility
        }
        
        // Update loading toast to success
        toast.dismiss(loadingToast);
        toast.success(responseData?.message || "OTP verified successfully!");
        
        // Small delay before showing password form
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update the step
        setStep("password");
      } else {
        throw new Error(responseData?.message || "Verification failed");
      }
      
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      const errorMessage = error.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
      toast.dismiss(loadingToast);
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  }

  const onPasswordSubmit = async (data: PasswordResetFormValues) => {
    if (isChangingPassword) return;
    
    setError(null);
    setIsChangingPassword(true);
    
    // Show loading state
    const loadingToast = toast.loading("Updating your password...");
    
    try {
      // Get the email from localStorage
      const email = typeof window !== 'undefined' ? 
        localStorage.getItem('otpVerifiedEmail') || 
        localStorage.getItem('resetPasswordEmail') : 
        null;
      
      if (!email) {
        throw new Error('Email not found. Please restart the password reset process.');
      }
      
      // Make the API call to change password
      await changePassword({
        email,
        password: data.password,
        password1: data.confirmPassword,
      }).unwrap();
      
      // Show success message
      toast.dismiss(loadingToast);
      toast.success("Your password has been reset successfully!");
      
      // Show redirecting message
      const redirectToast = toast.loading("Redirecting to login...");
      
      // Clear all stored data before redirecting
      if (typeof window !== 'undefined') {
        localStorage.removeItem('resetPasswordEmail');
        localStorage.removeItem('otpVerified');
        localStorage.removeItem('otpVerifiedEmail');
      }
      
      // Wait a moment before redirecting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.dismiss(redirectToast);
      window.location.href = "/login";
      
    } catch (error: any) {
      console.error("Password Reset Error:", error);
      const errorMessage = error.data?.message || error.message || "Failed to reset password. Please try again.";
      
      // Update error state and show error toast
      setError(errorMessage);
      toast.dismiss(loadingToast);
      toast.error(errorMessage);
      
    } finally {
      setIsChangingPassword(false);
    }
  }

  if (step === "otp") {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="px-0">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to email
        </Button>
        
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-muted-foreground">
            We've sent a 4-digit code to <span className="font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="dark:bg-destructive/10 dark:border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
            <FormField
              control={otpForm.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-center w-full block">Enter the 4-digit code</FormLabel>
                  <FormControl>
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3].map((index) => (
                        <Input
                          key={index}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          className={cn(
                            'w-14 h-14 text-2xl text-center p-0',
                            'border-2 border-input bg-background',
                            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            'transition-all duration-200',
                            field.value?.length === index ? 'border-primary ring-2 ring-ring' : ''
                          )}
                          value={field.value?.[index] || ''}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            // Only allow numbers
                            if (newValue && !/^\d*$/.test(newValue)) return;
                            
                            // Create a new array with current OTP values
                            const newOtp = Array.from(field.value || '    ');
                            newOtp[index] = newValue;
                            const otpValue = newOtp.join('').trim();
                            
                            // Update form field
                            field.onChange(otpValue);
                            
                            // Auto submit if 4 digits are entered and not already submitting
                            if (otpValue.length === 4 && !isSubmitting) {
                              otpForm.handleSubmit(onOtpSubmit)();
                              return;
                            }
                            
                            // Auto focus next input
                            if (newValue && index < 3) {
                              const nextInput = document.querySelector(`input[name='otp-${index + 1}']`) as HTMLInputElement;
                              nextInput?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            // Handle backspace to move to previous input
                            if (e.key === 'Backspace' && !field.value?.[index] && index > 0) {
                              const prevInput = document.querySelector(`input[name='otp-${index - 1}']`) as HTMLInputElement;
                              prevInput?.focus();
                            }
                          }}
                          name={`otp-${index}`}
                          autoComplete="one-time-code"
                        />
                      ))}
                    </div>
                  </FormControl>
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-center text-sm text-muted-foreground">
                      We've sent a code to {email}
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-sm"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || isResending}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : resendCooldown > 0 ? (
                        `Resend OTP in ${resendCooldown}s`
                      ) : (
                        "Resend OTP"
                      )}
                    </Button>
                  </div>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isVerifying || isSubmitting || otpForm.getValues('otp')?.length !== 4}
            >
              {(isVerifying || isSubmitting) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => setStep("otp")} className="px-0">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to verification
      </Button>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Create New Password</h2>
        <p className="text-muted-foreground">
          Enter your new password below
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="dark:bg-destructive/10 dark:border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-success/30 bg-success/10 text-success-foreground">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your new password"
                    {...field}
                    className="bg-background dark:border-input/80 focus:dark:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm your new password"
                    {...field}
                    className="bg-background dark:border-input/80 focus:dark:border-primary"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isChangingPassword}>
            {isChangingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
