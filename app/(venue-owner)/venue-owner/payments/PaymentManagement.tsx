"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { CreditCard, Copy, Eye, EyeOff, Key, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useGetSecretKeyQuery, useCreateSecretKeyMutation, useUpdateSecretKeyMutation } from "@/redux/api/venue-owner/venueApi";
import { getUserId } from "@/utils/auth";

export default function PaymentManagement() {
  const userId = getUserId() || '';
  const { toast } = useToast();
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  
  // RTK Query hooks
  const { data: secretKeyData, isLoading, refetch } = useGetSecretKeyQuery(userId, {
    skip: !userId,
  });
  
  const [createSecretKey] = useCreateSecretKeyMutation();
  const [updateSecretKey] = useUpdateSecretKeyMutation();

  // Update local state when secret key data changes
  useEffect(() => {
    if (secretKeyData?.PrivateSecretKey) {
      setSecretKey(secretKeyData.PrivateSecretKey);
    }
  }, [secretKeyData]);

  const handleCopyToClipboard = () => {
    if (!secretKey) return;
    
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Secret key copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomKey = () => {
    const randomKey = Array(32)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join('');
    setSecretKey(randomKey);
  };

  const handleSaveKey = async () => {
    if (!secretKey || secretKey.length < 16) {
      toast({
        title: "Invalid Key",
        description: "Secret key must be at least 16 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (secretKeyData?.id) {
        // Update existing key
        await updateSecretKey({
          secretkeyId: secretKeyData.id,
          secretKey: secretKey,
        }).unwrap();
      } else {
        // Create new key
        await createSecretKey({
          secretKey,
          userId,
        }).unwrap();
      }
      
      await refetch();
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: secretKeyData?.id ? "Updated Successfully" : "Secret key created successfully.",
      });
    } catch (error) {
      console.error("Error saving secret key:", error);
      toast({
        title: "Error",
        description: "Failed to save secret key. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Settings</h2>
          <p className="text-muted-foreground">
            Manage your payment integration settings
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Payment Secret Key
          </CardTitle>
          <CardDescription>
            Your secret key is used to authenticate payment requests. Keep it secure and never share it publicly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey">Secret Key</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    id="secretKey"
                    type={showKey ? "text" : "password"}
                    value={secretKey || ""}
                    onChange={(e) => setSecretKey(e.target.value)}
                    readOnly={!isEditing}
                    className="font-mono"
                    placeholder={isLoading ? "Loading..." : "No secret key configured"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={!secretKey}
                  >
                    {showKey ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyToClipboard}
                  disabled={!secretKey}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateRandomKey}
                  className="gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Generate Random Key
                </Button>
                <p className="text-xs text-muted-foreground">
                  Key must be at least 16 characters long
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  // Reset to original key
                  setSecretKey(secretKeyData?.PrivateSecretKey || '');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveKey}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              {secretKeyData?.id ? "Update Secret Key" : "Create Secret Key"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">How to use your secret key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-1">1. Include in API Requests</h4>
            <p className="text-muted-foreground">
              Add your secret key to the <code className="bg-muted px-1.5 py-0.5 rounded">Authorization</code> header of your payment requests.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">2. Keep it secure</h4>
            <p className="text-muted-foreground">
              Never commit your secret key in client-side code or version control. Store it securely in your backend environment variables.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">3. Rotate regularly</h4>
            <p className="text-muted-foreground">
              For security best practices, rotate your secret key periodically by generating a new one.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
