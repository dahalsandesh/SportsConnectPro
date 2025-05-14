import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function MainFooter() {
  return (
    <footer className="bg-secondary dark:bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-primary">Sport</span>
              <span className="text-xl font-bold">Connect</span>
              <span className="text-xl font-bold text-primary">Pro</span>
            </div>
            <p className="text-muted-foreground mb-4">
              The easiest way to find and book sports venues near you. Play more, worry less.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-full p-1"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-full p-1"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-full p-1"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/venues"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  Find Venues
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  Events & Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/register-venue"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  List Your Venue
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-muted-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1 inline-block dark:text-muted-foreground/90 dark:hover:text-primary"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">Subscribe to get updates on new venues and special offers.</p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-background dark:border-input/80 focus:dark:border-primary"
              />
              <Button>Subscribe</Button>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center text-muted-foreground dark:text-muted-foreground/90">
                <Mail className="h-5 w-5 mr-2" />
                <span>support@sportconnectpro.com</span>
              </div>
              <div className="flex items-center text-muted-foreground dark:text-muted-foreground/90">
                <Phone className="h-5 w-5 mr-2" />
                <span>+977 9812345678</span>
              </div>
              <div className="flex items-start text-muted-foreground dark:text-muted-foreground/90">
                <MapPin className="h-5 w-5 mr-2 mt-1" />
                <span>123 Sports Avenue, Kathmandu, Nepal</span>
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
