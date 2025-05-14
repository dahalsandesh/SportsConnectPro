import Link from "next/link"
import { BusIcon as SoccerBall } from "lucide-react"

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <SoccerBall className="h-8 w-8 text-green-600 animate-spin-slow" />
        <div className="ml-2">
          <span className="text-2xl font-bold text-green-600">Futsal</span>
          <span className="text-2xl font-bold text-gray-800">Connect</span>
          <span className="text-2xl font-bold text-green-600">Pro</span>
        </div>
      </div>
    </Link>
  )
}
