"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, CheckCircle, AlertCircle, Loader2, Upload, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type FormData = {
  venueName: string;
  address: string;
  cityId: string;
  phoneNumber: string;
  email: string;
  panNumber: string;
  agreeTerms: boolean;
};

type FileType = 'panFile' | 'govFile' | 'businessFile';

export default function VenueRegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    venueName: "",
    address: "",
    cityId: "",
    phoneNumber: "",
    email: "",
    panNumber: "",
    agreeTerms: false,
  });
  const [cities, setCities] = useState<{ cityId: string; cityName: string }[]>([]);
  const [files, setFiles] = useState<{ 
    panFile: File | null; 
    govFile: File | null; 
    businessFile: File | null 
  }>({ 
    panFile: null, 
    govFile: null, 
    businessFile: null 
  });
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fileInputs = {
    panFile: useRef<HTMLInputElement>(null),
    govFile: useRef<HTMLInputElement>(null),
    businessFile: useRef<HTMLInputElement>(null)
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/api/v1/user/GetCity`, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((responseData) => {
        // The API returns the array directly, not wrapped in a data property
        const citiesData = Array.isArray(responseData) ? responseData : [];
        
        if (citiesData.length === 0) {
          // Set default cities if API returns empty
          setCities([
            { cityId: '097aa0d1-1075-43f7-a485-6a98f58e7d46', cityName: 'Biratnagar' },
            { cityId: '92b03f2a-c890-486c-a02a-2388271bf17b', cityName: 'Lalitpur' },
            { cityId: 'fcecde6b-b765-4fb5-add2-04f21a710985', cityName: 'Kathmandu' },
          ])
          return;
        }
        
        // Map the response to match the expected format
        const formattedCities = citiesData.map((city: any) => ({
          cityId: city.CityID || city.cityId || '',
          cityName: city.CityName || city.cityName || ''
        })).filter((city: any) => city.cityId && city.cityName)
        
        setCities(formattedCities)
      })
      .catch(() => {
        // Set some default cities if the API fails
        setCities([
          { cityId: '097aa0d1-1075-43f7-a485-6a98f58e7d46', cityName: 'Biratnagar' },
          { cityId: '92b03f2a-c890-486c-a02a-2388271bf17b', cityName: 'Lalitpur' },
          { cityId: 'fcecde6b-b765-4fb5-add2-04f21a710985', cityName: 'Kathmandu' },
        ])
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));  
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: FileType) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [fileType]: e.target.files![0] }));
    }
  };

  const removeFile = (fileType: FileType) => {
    setFiles(prev => ({ ...prev, [fileType]: null }));
    if (fileInputs[fileType].current) {
      fileInputs[fileType].current!.value = '';
    }
  };

  const validateStep1 = () => {
    const { venueName, address, cityId, phoneNumber, email, panNumber } = formData;
    if (!venueName || !address || !cityId || !phoneNumber || !email || !panNumber) {
      setError('All fields are required');
      return false;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Phone number must be 10 digits');
      return false;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!files.panFile || !files.govFile) {
      setError('Please upload all required documents (PAN Card and Government ID)');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    setError(null);
    return true;
  };

  const nextStep = async () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    
    if (step === 1) {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get user ID from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) throw new Error('User not authenticated');
        const user = JSON.parse(userStr);
        
        // Submit basic info
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/api/v1/user/CreateVenueApplication`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: user.userId,
            venueName: formData.venueName,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            cityId: formData.cityId,
            email: formData.email,
            panNumber: formData.panNumber
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit application');
        }
        
        const responseData = await response.json();
        if (responseData.status === "Success" && responseData.applicationId) {
          setApplicationId(responseData.applicationId);
          setStep(2);
        } else {
          throw new Error('Failed to get application ID from response');
        }
        
      } catch (err: any) {
        setError(err.message || 'An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2) {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!applicationId) {
          throw new Error('Application ID not found. Please go back and try again.');
        }
        
        const formDataUpload = new FormData();
        formDataUpload.append('applicationId', applicationId);
        
        // Ensure required files are present
        if (!files.panFile) throw new Error('PAN Card is required');
        if (!files.govFile) throw new Error('Government ID is required');
        
        // Append all files
        formDataUpload.append('panFile', files.panFile);
        formDataUpload.append('govFile', files.govFile);
        
        // Business file is optional
        if (files.businessFile) {
          formDataUpload.append('businessFile', files.businessFile);
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/api/v1/user/UploadVenueApplicationDoc`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${localStorage.getItem('token')}`
          },
          body: formDataUpload
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload documents');
        }
        
        setStep(3);
        
      } catch (err: any) {
        setError(err.message || 'An error occurred while uploading documents. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step === 3) {
      // Final submission
      setStep(4);
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
    setError(null);
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: FileText, description: "Venue details" },
    { number: 2, title: "Documents", icon: FileText, description: "Upload files" },
    { number: 3, title: "Review", icon: CheckCircle, description: "Final review" },
    { number: 4, title: "Complete", icon: CheckCircle, description: "Confirmation" },
  ];

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Venue Information</CardTitle>
              <CardDescription>Please provide your venue details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venueName">Venue Name *</Label>
                  <Input
                    id="venueName"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleChange}
                    placeholder="Enter venue name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cityId">City *</Label>
                  <Select 
                    value={formData.cityId} 
                    onValueChange={(value) => handleSelectChange('cityId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.cityId} value={city.cityId}>
                          {city.cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input
                  id="panNumber"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="Enter PAN number"
                  className="uppercase"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Upload Documents</CardTitle>
              <CardDescription>Please upload the required documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <DocumentUpload
                  label="PAN Card"
                  file={files.panFile}
                  inputRef={fileInputs.panFile}
                  onChange={(e) => handleFileChange(e, 'panFile')}
                  onRemove={() => removeFile('panFile')}
                  accept="image/*,.pdf,.doc,.docx"
                />
                
                <DocumentUpload
                  label="Government ID (Citizenship/License/Passport)"
                  file={files.govFile}
                  inputRef={fileInputs.govFile}
                  onChange={(e) => handleFileChange(e, 'govFile')}
                  onRemove={() => removeFile('govFile')}
                  accept="image/*,.pdf"
                />
                
                <div className="pt-2">
                  <DocumentUpload
                    label="Business Registration Certificate (Optional)"
                    file={files.businessFile}
                    inputRef={fileInputs.businessFile}
                    onChange={(e) => handleFileChange(e, 'businessFile')}
                    onRemove={() => removeFile('businessFile')}
                    accept="image/*,.pdf,.doc,.docx"
                    optional
                  />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Supported formats: JPG, PNG, PDF, DOC, DOCX</p>
                <p>Max file size: 5MB per file</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Review & Submit</CardTitle>
              <CardDescription>Please review your information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Venue Information</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Name:</strong> {formData.venueName}</p>
                    <p><strong>Address:</strong> {formData.address}</p>
                    <p><strong>City:</strong> {cities.find(c => c.cityId === formData.cityId)?.cityName}</p>
                    <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>PAN:</strong> {formData.panNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-2">Uploaded Documents</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>✓ PAN Card: {files.panFile?.name}</p>
                    <p>✓ Government ID: {files.govFile?.name}</p>
                    {files.businessFile && <p>✓ Business Certificate: {files.businessFile.name}</p>}
                  </div>
                </div>
              </div>

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
            </CardContent>
          </Card>
        </div>
      );
    }

    if (step === 4) {
      return (
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
      );
    }
  };

  const DocumentUpload = ({
    label,
    file,
    inputRef,
    onChange,
    onRemove,
    accept,
    optional = false
  }: {
    label: string;
    file: File | null;
    inputRef: React.RefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    accept: string;
    optional?: boolean;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()}>
          {label} {optional && <span className="text-muted-foreground">(Optional)</span>}
        </Label>
        {file && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Remove
          </Button>
        )}
      </div>
      
      {!file ? (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={label.replace(/\s+/g, '-').toLowerCase()}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {accept.includes('image/') ? 'Image, ' : ''}
                {accept.includes('.pdf') ? 'PDF' : ''}
                {accept.includes('.doc') ? (accept.includes('.pdf') ? ', DOC' : 'DOC') : ''}
                {accept.includes('.docx') ? (accept.includes('.doc') ? '/DOCX' : 'DOCX') : ''}
              </p>
            </div>
            <input
              id={label.replace(/\s+/g, '-').toLowerCase()}
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={onChange}
              accept={accept}
            />
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB • {file.type}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
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
                <div className={`text-sm font-medium ${step >= stepItem.number ? "text-foreground" : "text-muted-foreground"}`}>
                  {stepItem.title}
                </div>
                <div className="text-xs text-muted-foreground">{stepItem.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 w-16 mx-4 transition-all duration-300 ${step > stepItem.number ? "bg-green-600" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      {/* Form Content */}
      {renderStepContent()}
      
      {/* Navigation Buttons */}
      {step < 4 && (
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={step === 1 || isLoading}
            className={step === 1 ? 'invisible' : ''}
          >
            Previous
          </Button>
          
          <Button
            type="button"
            onClick={nextStep}
            disabled={isLoading || (step === 3 && !formData.agreeTerms)}
            className="ml-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step === 1 ? 'Submitting...' : step === 2 ? 'Uploading...' : 'Processing...'}
              </>
            ) : step === 3 ? (
              'Submit Application'
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}