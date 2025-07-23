import { Mail, Phone, MessageCircle, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our support team is here to help you with any questions or issues you might have. 
          Reach out to us through any of the following channels.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Contact Card 1 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle>Email Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Send us an email and we'll get back to you as soon as possible.</p>
            <a href="mailto:support@sportsconnectpro.com" className="text-blue-600 hover:underline">
              support@sportsconnectpro.com
            </a>
          </CardContent>
        </Card>

        {/* Contact Card 2 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Phone className="h-6 w-6" />
            </div>
            <CardTitle>Call Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Available Monday to Friday, 9:00 AM to 6:00 PM</p>
            <a href="tel:+1234567890" className="text-green-600 hover:underline">
              +1 (234) 567-890
            </a>
          </CardContent>
        </Card>

        {/* Contact Card 3 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <MessageCircle className="h-6 w-6" />
            </div>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Chat with our support team in real-time.</p>
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Send us a message</CardTitle>
          <p className="text-muted-foreground">We'll get back to you as soon as possible</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Tell us about your issue or question..." 
                rows={5}
                className="resize-none"
              />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <MapPin className="h-4 w-4" />
          <span>123 Sports Ave, City, Country</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
        </div>
      </div>
    </div>
  );
}
