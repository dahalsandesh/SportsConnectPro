"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSendOtpMutation } from "@/redux/api/common/authApi"
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { OtpVerificationForm } from "./otp-verification-form"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [sendOtp, { isLoading }] = useSendOtpMutation()
  const { toast } = useToast()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setError(null); // Clear any previous errors
    setIsSubmitting(true);
    
    try {
      const response = await sendOtp({ email: data.email }).unwrap()
      
      // Store the email and update state
      setEmail(data.email);
      setShowOtpForm(true);
      
      // Show success toast
      toast({
        title: "OTP Sent",
        description: response?.message || "We've sent a verification code to your email.",
        variant: "success",
        duration: 3000,
      });
      
    } catch (error: any) {
      console.error("OTP Send Error:", error);
      const errorMessage = error.data?.message || "Failed to send OTP. Please try again.";
      
      toast({
        title: "Failed to Send OTP",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showOtpForm) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
        <CardContent className="pt-6">
          <OtpVerificationForm 
            email={email} 
            onBack={() => setShowOtpForm(false)} 
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a verification code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Removed error alert since we're using toast notifications */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                      className="bg-background dark:border-input/80 focus:dark:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : "Send Verification Code"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          variant="link"
          className="font-normal text-muted-foreground"
          onClick={() => router.push("/auth/login")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Button>
      </CardFooter>
    </Card>
  )
}
