"use client";

import { useGetPaymentsQuery } from "@/redux/api/user/paymentsApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard, Calendar, User, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function PaymentManagement() {
  const {
    data: payments,
    isLoading,
    error,
  } = useGetPaymentsQuery
    ? useGetPaymentsQuery()
    : { data: [], isLoading: false, error: null };

  if (isLoading) return <div>Loading payments...</div>;
  if (error) return <div>Error loading payments.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payments</h2>
          <p className="text-muted-foreground">
            View and manage payment transactions
          </p>
        </div>
      </div>
      <div className="grid gap-4">
        {(payments || []).map((payment: any) => (
          <Card key={payment.paymentId}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment #{payment.paymentId}
                </span>
                <span
                  className={`text-sm font-medium ${
                    payment.status === "completed"
                      ? "text-green-500"
                      : payment.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}>
                  {payment.status?.charAt(0).toUpperCase() +
                    payment.status?.slice(1)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Customer:</span>
                    <span>{payment.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Date:</span>
                    <span>
                      {payment.paymentDate
                        ? format(new Date(payment.paymentDate), "yyyy-MM-dd")
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Amount:</span>
                    <span>${payment.amount}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
