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
import { Upload, Clock, Info, Check } from "lucide-react"

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
    // In a real application, this would send the data to the server
    console.log("Form submitted:", formData)
    nextStep()
  }

  return (
    <div>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 1 ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            <Info className="h-5 w-5" />
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`}></div>
        </div>
        <div className="flex items-center">
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 2 ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            <Upload className="h-5 w-5" />
          </div>
          <div className={`h-1 w-16 ${step >= 3 ? "bg-green-600" : "bg-gray-200"}`}></div>
        </div>
        <div className="flex items-center">
          <div
            className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 3 ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            <Clock className="h-5 w-5" />
          </div>
          <div className={`h-1 w-16 ${step >= 4 ? "bg-green-600" : "bg-gray-200"}`}></div>
        </div>
        <div
          className={`rounded-full h-10 w-10 flex items-center justify-center ${step >= 4 ? "bg-green-600 text-white" : "bg-gray-200"}`}
        >
          <Check className="h-5 w-5" />
        </div>
      </div>

      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            nextStep()
          }}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name *</Label>
              <Input
                id="venueName"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="Enter your venue name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter venue address"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kathmandu">Kathmandu</SelectItem>
                    <SelectItem value="lalitpur">Lalitpur</SelectItem>
                    <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                    <SelectItem value="pokhara">Pokhara</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your venue, facilities, etc."
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Next Step
              </Button>
            </div>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            nextStep()
          }}
        >
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Please upload the required legal documents for verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your PAN Card or click to browse</p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your Business License or click to browse</p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop Government Approvals or click to browse</p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Previous Step
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Next Step
              </Button>
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            nextStep()
          }}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openingTime">Opening Time *</Label>
                <Select
                  value={formData.openingTime}
                  onValueChange={(value) => handleSelectChange("openingTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select opening time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                    <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                    <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingTime">Closing Time *</Label>
                <Select
                  value={formData.closingTime}
                  onValueChange={(value) => handleSelectChange("closingTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select closing time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                    <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                    <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                    <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Court Details</CardTitle>
                <CardDescription>Add information about the courts in your venue.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Court 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="court1Name">Court Name</Label>
                      <Input id="court1Name" placeholder="e.g., Main Court" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="court1Surface">Surface Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select surface type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="artificial-grass">Artificial Grass</SelectItem>
                          <SelectItem value="concrete">Concrete</SelectItem>
                          <SelectItem value="wood">Wood</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="court1Capacity">Capacity</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select capacity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5v5">5v5</SelectItem>
                          <SelectItem value="6v6">6v6</SelectItem>
                          <SelectItem value="7v7">7v7</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="court1Price">Hourly Price (Rs.)</Label>
                      <Input id="court1Price" type="number" placeholder="e.g., 1200" />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  + Add Another Court
                </Button>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox id="agreeTerms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="agreeTerms" className="text-sm">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Previous Step
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={!formData.agreeTerms}>
                Submit Application
              </Button>
            </div>
          </div>
        </form>
      )}

      {step === 4 && (
        <div className="text-center py-8">
          <div className="bg-green-100 text-green-800 rounded-full p-4 inline-flex mb-6">
            <Check className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering your venue. Our team will review your application and get back to you within 2-3
            business days.
          </p>
          <div className="flex justify-center">
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">Back to Home</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
