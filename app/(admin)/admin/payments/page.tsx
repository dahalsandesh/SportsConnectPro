"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check, CreditCard, Building2, CreditCardIcon, ShieldCheck, ShieldOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useGetVenuePaymentMethodsQuery, useGetPaymentTypesQuery, useCreatePaymentTypeMutation, useDeletePaymentTypeMutation } from "@/redux/api/admin/paymentsApi";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPaymentsPage() {
  const { data: venuePayments = [], isLoading: isLoadingVenuePayments } = useGetVenuePaymentMethodsQuery();
  const { data: paymentTypes = [], isLoading: isLoadingPaymentTypes } = useGetPaymentTypesQuery();
  const [createPaymentType] = useCreatePaymentTypeMutation();
  const [deletePaymentType] = useDeletePaymentTypeMutation();

  const { register, handleSubmit, reset } = useForm<{ paymentTypeName: string }>();

  const onSubmit = async (data: { paymentTypeName: string }) => {
    try {
      await createPaymentType(data).unwrap();
      reset();
    } catch (error) {
      console.error("Failed to create payment type:", error);
    }
  };

  const handleDeletePaymentType = async (paymentTypeId: string) => {
    if (window.confirm("Are you sure you want to delete this payment type?")) {
      try {
        await deletePaymentType({ paymentTypeId });
      } catch (error) {
        console.error("Failed to delete payment type:", error);
      }
    }
  };

  if (isLoadingVenuePayments || isLoadingPaymentTypes) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Payment Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage payment methods and types for venues
        </p>
      </div>
      
      <Tabs defaultValue="venue-payments" className="space-y-6 w-full text-left">
        <div className="border-b">
          <TabsList className="w-full justify-start space-x-4 bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="venue-payments" 
              className="relative px-6 py-3 rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-card data-[state=active]:shadow-sm transition-colors"
            >
              <Building2 className="h-4 w-4 mr-2" /> 
              <span className="font-medium">Venue Methods</span>
            </TabsTrigger>
            <TabsTrigger 
              value="payment-types" 
              className="relative px-6 py-3 rounded-t-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-card data-[state=active]:shadow-sm transition-colors"
            >
              <CreditCardIcon className="h-4 w-4 mr-2" /> 
              <span className="font-medium">Payment Types</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="venue-payments" className="mt-6">
          <Card className="border-0 shadow-sm bg-transparent">
            <CardHeader className="pb-4 px-0">
              <CardTitle className="text-2xl font-semibold">Venue Payment Methods</CardTitle>
              <CardDescription>
                View the payment method status for each venue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {venuePayments.map((venue) => (
                  <div 
                    key={venue.venueId} 
                    className="flex items-center justify-between p-5 rounded-xl border hover:shadow-sm transition-all duration-200 bg-card"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${venue.status ? 'bg-green-50 dark:bg-green-900/20' : 'bg-muted'}`}>
                        {venue.status ? (
                          <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ShieldOff className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-foreground">{venue.venueName}</h3>
                        <p className={`text-sm mt-1 ${
                          venue.status ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                        }`}>
                          {venue.status ? 'Payment method is active' : 'Payment method is inactive'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      venue.status 
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {venue.status ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                ))}
                {venuePayments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No venue payment methods found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-types" className="mt-6">
          <Card className="border-0 shadow-sm bg-transparent">
            <CardHeader className="pb-4 px-0">
              <CardTitle className="text-2xl font-semibold">Payment Types</CardTitle>
              <CardDescription>
                Manage available payment methods for the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="bg-card p-6 rounded-xl border border-border shadow-sm"
              >
                <div className="space-y-2">
                  <Label htmlFor="paymentTypeName" className="text-sm font-medium text-foreground">
                    Add New Payment Type
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      id="paymentTypeName"
                      placeholder="e.g., Credit Card, PayPal"
                      className="flex-1 h-11 text-base"
                      {...register("paymentTypeName", { 
                        required: "Payment type name is required" 
                      })}
                    />
                    <Button 
                      type="submit" 
                      className="gap-2 bg-primary hover:bg-primary/90 transition-colors h-11 px-6"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Payment Type</span>
                    </Button>
                  </div>
                </div>
              </form>

              <div className="space-y-4 mt-8">
                <h3 className="text-base font-medium text-foreground text-left">Available Payment Types</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {paymentTypes.map((type) => (
                    <div 
                      key={type.paymentTypeId} 
                      className="group relative p-4 rounded-xl border bg-card hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <CreditCard className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-foreground">{type.paymentTypeName}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeletePaymentType(type.paymentTypeId)}
                          title="Delete payment type"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {paymentTypes.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      No payment types found. Add a new payment type above.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
