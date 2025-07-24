import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ReduxProvider } from '@/redux/provider';
import { NotificationProvider } from '@/components/notification-provider';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import ClientLayout from './ClientLayout';
import './globals.css';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | SportConnect Pro",
    default: "SportConnect Pro - Book Sports Venues Online",
  },
  description: "Find and book sports venues near you. Easy booking, instant confirmation.",
  keywords: ["sports", "booking", "futsal", "tennis", "basketball", "venues", "courts"],
  authors: [{ name: "SportConnect Pro Team" }],
  creator: "SportConnect Pro",
  publisher: "SportConnect Pro",
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000"),
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <NotificationProvider>
              <ClientLayout>{children}</ClientLayout>
              <Toaster position="top-right" richColors />
            </NotificationProvider>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
