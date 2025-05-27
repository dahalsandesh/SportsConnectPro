import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function MainFooter() {
  return (
    <footer
      className="bg-secondary/30 border-t border-border/40 mt-auto"
      style={{
        visibility: "visible",
        opacity: 1,
        display: "block",
        minHeight: "200px",
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-primary">Sport</span>
              <span className="text-xl font-bold text-foreground">Connect</span>
              <span className="text-xl font-bold text-primary">Pro</span>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              The easiest way to find and book sports venues near you. Play more, worry less.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-full p-2"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-full p-2"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-full p-2"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/venues"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  Find Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  Events & Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/register-venue"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  List Your Venue
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Newsletter</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Subscribe to get updates on new venues and special offers.
            </p>
            <div className="flex flex-col space-y-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button className="w-full">Subscribe</Button>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sm">support@sportconnectpro.com</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="text-sm">+977 9812345678</span>
              </div>
              <div className="flex items-start text-muted-foreground">
                <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Sports Avenue, Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} SportConnect Pro. All rights reserved.</p>
          <p className="mt-2">Designed with ❤️ for sports enthusiasts</p>
        </div>
      </div>
    </footer>
  )
}
