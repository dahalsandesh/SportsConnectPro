"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Key, Eye, EyeOff, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetSecretKeyQuery, useCreateSecretKeyMutation, useUpdateSecretKeyMutation } from "@/redux/api/venue-owner/venueApi";
import { getUserId } from "@/utils/auth";

const secretKeySchema = z.object({
  secretKey: z.string().min(16, {
    message: "Secret key must be at least 16 characters long",
  }),
});

type SecretKeyFormValues = z.infer<typeof secretKeySchema>;

interface SecretKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SecretKeyDialog({ open, onOpenChange }: SecretKeyDialogProps) {
  const { toast } = useToast();
  const userId = getUserId();
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: secretKeyData, isLoading, refetch } = useGetSecretKeyQuery(userId || "", {
    skip: !open || !userId,
  });
  
  const [createSecretKey] = useCreateSecretKeyMutation();
  const [updateSecretKey] = useUpdateSecretKeyMutation();

  const form = useForm<SecretKeyFormValues>({
    resolver: zodResolver(secretKeySchema),
    defaultValues: {
      secretKey: "",
    },
  });

  useEffect(() => {
    if (secretKeyData?.PrivateSecretKey) {
      form.reset({
        secretKey: secretKeyData.PrivateSecretKey,
      });
    } else {
      form.reset({
        secretKey: "",
      });
    }
  }, [secretKeyData, form]);

  const handleCopyToClipboard = () => {
    if (form.getValues("secretKey")) {
      navigator.clipboard.writeText(form.getValues("secretKey"));
      toast({
        title: "Copied to clipboard",
        description: "The secret key has been copied to your clipboard.",
      });
    }
  };

  const generateRandomKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("secretKey", result, { shouldValidate: true });
  };

  const onSubmit = async (data: SecretKeyFormValues) => {
    if (!userId) return;

    try {
      setIsSubmitting(true);
      
      if (secretKeyData?.id) {
        // Update existing key
        await updateSecretKey({
          secretKeyId: secretKeyData.id,
          secretKey: data.secretKey,
        }).unwrap();
        
        toast({
          title: "Success",
          description: "Secret key updated successfully.",
        });
      } else {
        // Create new key
        await createSecretKey({
          userId,
          secretKey: data.secretKey,
        }).unwrap();
        
        toast({
          title: "Success",
          description: "Secret key created successfully.",
        });
      }
      
      refetch();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving secret key:", error);
      toast({
        title: "Error",
        description: "Failed to save secret key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              {secretKeyData?.id ? "Update Secret Key" : "Create Secret Key"}
            </DialogTitle>
            <DialogDescription>
              {secretKeyData?.id
                ? "Update your payment secret key. This key is used for secure payment processing."
                : "Create a secure secret key for payment processing. This key will be used to verify transactions."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={generateRandomKey}
                  className="text-xs h-7 px-2"
                >
                  Generate Random Key
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="secretKey"
                  type={showKey ? "text" : "password"}
                  placeholder="Enter a strong secret key"
                  className="pr-20"
                  {...form.register("secretKey")}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setShowKey(!showKey)}
                        >
                          {showKey ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showKey ? "Hide key" : "Show key"}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{showKey ? "Hide key" : "Show key"}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleCopyToClipboard}
                          disabled={!form.watch("secretKey")}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy to clipboard</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {form.formState.errors.secretKey && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.secretKey.message}
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 16 characters. Keep this key secure and never share it with anyone.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {secretKeyData?.id ? "Update Key" : "Create Key"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
