"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLoginMutation } from "@/redux/api/common/authApi"
import { useAppDispatch } from "@/hooks/redux"
import { setCredentials } from "@/redux/features/authSlice"
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { UserType } from "@/types/auth"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [login, { isLoading }] = useLoginMutation()
  const { toast } = useToast()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const redirectUrl = searchParams.get("redirect")
  const bookingState = searchParams.get("state")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setError(null)
    try {
      const response = await login(data).unwrap()
      dispatch(setCredentials(response))
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.fullName || response.userName}!`,
        variant: "success",
      })

      // Redirect based on redirect URL or user type
      if (redirectUrl) {
        // If there's a booking state, append it to the redirect URL
        if (bookingState) {
          router.push(`${redirectUrl}?bookingState=${encodeURIComponent(bookingState)}`)
        } else {
          router.push(redirectUrl)
        }
      } else {
        // Default redirect based on user type
        switch (response.userType) {
          case UserType.Admin:
            router.push("/admin")
            break
          case UserType.VenueOwner:
            router.push("/venue-owner")
            break
          default:
            router.push("/dashboard")
        }
      }
    } catch (error: any) {
      const errorMessage = error.data?.message || "Invalid email or password. Please try again."
      setError(errorMessage)
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {registered && (
          <Alert className="mb-4 border-success/30 bg-success/10 text-success-foreground">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Account created successfully!</AlertTitle>
            <AlertDescription>Please check your email to activate your account.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button
                      variant="link"
                      className="p-0 h-auto font-normal text-xs"
                      onClick={() => router.push("/forgot-password")}
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="bg-background pr-10 dark:border-input/80 focus:dark:border-primary"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline focus-ring rounded-sm">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
