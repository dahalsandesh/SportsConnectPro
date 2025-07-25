import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register Your Venue | FutsalConnectPro",
  description:
    "Register your futsal venue on our platform and increase your bookings",
}

export default function RegisterVenueLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
