"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Clock, Info, Check, FileText, MapPin, CreditCard } from "lucide-react"

export default function VenueRegistrationForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    venueName: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    description: "",
    openingTime: "",
    closingTime: "",
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
  }

  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    nextStep()
  }

  const steps = [
    { number: 1, title: "Basic Info", icon: Info, description: "Venue details" },
    { number: 2, title: "Documents", icon: FileText, description: "Upload files" },
    { number: 3, title: "Setup", icon: Clock, description: "Court & timing" },
    { number: 4, title: "Complete", icon: Check, description: "Confirmation" },
  ]

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 bg-muted/30 p-4 rounded-lg">
        {steps.map((stepItem, index) => (
          <div key={stepItem.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`rounded-full h-12 w-12 flex items-center justify-center transition-all duration-300 ${
                  step >= stepItem.number
                    ? "bg-green-600 text-white shadow-lg"
                    : "bg-muted text-muted-foreground border-2 border-muted-foreground/20"
                }`}
              >
                <stepItem.icon className="h-5 w-5" />
              </div>
              <div className="text-center mt-2">
                <div
                  className={`text-sm font-medium ${step >= stepItem.number ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {stepItem.title}
                </div>
                <div className="text-xs text-muted-foreground">{stepItem.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-16 mx-4 transition-all duration-300 ${step > stepItem.number ? "bg-green-600" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            nextStep()
          }}
          className="space-y-6"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MapPin className="h-5 w-5 text-green-600" />
                Venue Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">Tell us about your futsal venue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="venueName" className="text-foreground">
                  Venue Name *
                </Label>
                <Input
                  id="venueName"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  placeholder="Enter your venue name"
                  className="bg-background text-foreground border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-foreground">
                  Address *
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter venue address"
                  className="bg-background text-foreground border-border"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-foreground">
                    City *
                  </Label>
                  <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                    <SelectTrigger className="bg-background text-foreground border-border">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="kathmandu">Kathmandu</SelectItem>
                      <SelectItem value="lalitpur">Lalitpur</SelectItem>
                      <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                      <SelectItem value="pokhara">Pokhara</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="bg-background text-foreground border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="bg-background text-foreground border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your venue, facilities, etc."
                  rows={4}
                  className="bg-background text-foreground border-border"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Next Step
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            nextStep()
          }}
          className="space-y-6"
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-blue-600" />
                Upload Documents
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Please upload the required legal documents for verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground font-medium mb-2">PAN Card</p>
                <p className="text-sm text-muted-foreground mb-4">Drag and drop your PAN Card or click to browse</p>
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                  Browse Files
                </Button>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground font-medium mb-2">Business License</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your Business License or click to browse
                </p>
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                  Browse Files
                </Button>
              </div>

              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-foreground font-medium mb-2">Government Approvals</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop Government Approvals or click to browse
                </p>
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} className="border-border text-foreground hover:bg-muted">
              Previous Step
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
              Next Step
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5 text-purple-600" />
                Operating Hours
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Set your venue's operating hours and court details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingTime" className="text-foreground">
                    Opening Time *
                  </Label>
                  <Select
                    value={formData.openingTime}
                    onValueChange={(value) => handleSelectChange("openingTime", value)}
                  >
                    <SelectTrigger className="bg-background text-foreground border-border">
                      <SelectValue placeholder="Select opening time" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                      <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                      <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closingTime" className="text-foreground">
                    Closing Time *
                  </Label>
                  <Select
                    value={formData.closingTime}
                    onValueChange={(value) => handleSelectChange("closingTime", value)}
                  >
                    <SelectTrigger className="bg-background text-foreground border-border">
                      <SelectValue placeholder="Select closing time" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border">
                      <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                      <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                      <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                      <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-amber-600" />
                Court Details
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Add information about the courts in your venue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border border-border rounded-lg p-6 bg-muted/20">
                <h3 className="font-medium mb-4 text-foreground">Court 1</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="court1Name" className="text-foreground">
                      Court Name
                    </Label>
                    <Input
                      id="court1Name"
                      placeholder="e.g., Main Court"
                      className="bg-background text-foreground border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court1Surface" className="text-foreground">
                      Surface Type
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue placeholder="Select surface type" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="artificial-grass">Artificial Grass</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="wood">Wood</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court1Capacity" className="text-foreground">
                      Capacity
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-background text-foreground border-border">
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="5v5">5v5</SelectItem>
                        <SelectItem value="6v6">6v6</SelectItem>
                        <SelectItem value="7v7">7v7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court1Price" className="text-foreground">
                      Hourly Price (Rs.)
                    </Label>
                    <Input
                      id="court1Price"
                      type="number"
                      placeholder="e.g., 1200"
                      className="bg-background text-foreground border-border"
                    />
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                + Add Another Court
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2 p-4 bg-muted/20 rounded-lg border border-border">
            <Checkbox
              id="agreeTerms"
              checked={formData.agreeTerms}
              onCheckedChange={handleCheckboxChange}
              className="border-border"
            />
            <Label htmlFor="agreeTerms" className="text-sm text-foreground">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep} className="border-border text-foreground hover:bg-muted">
              Previous Step
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!formData.agreeTerms}
            >
              Submit Application
            </Button>
          </div>
        </form>
      )}

      {step === 4 && (
        <div className="text-center py-12">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full p-6 inline-flex mb-8">
            <Check className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Application Submitted Successfully!</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Thank you for registering your venue with FutsalConnectPro. Our team will review your application and get
            back to you within 2-3 business days via email.
          </p>
          <div className="bg-muted/30 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <h3 className="font-semibold mb-3 text-foreground">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ Document verification (1-2 days)</li>
              <li>✓ Venue approval process (1 day)</li>
              <li>✓ Account setup and training</li>
              <li>✓ Go live and start receiving bookings!</li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Back to Home</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
