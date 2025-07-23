"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Rocket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIModelTrainPage() {
  const router = useRouter();
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Get token from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        toast.error('Authentication required');
        router.push('/login');
        return;
      }
      setToken(storedToken);
    }
  }, [router]);

  const handleTrainModel = async () => {
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    try {
      setIsTraining(true);
      setError(null);
      
      const response = await fetch('http://127.0.0.1:8000/web/api/v1/adds/TrainModels', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Token ${token}`
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to train the model');
      }
      
      setIsTrained(true);
      toast.success('AI Model trained successfully!');
    } catch (err) {
      console.error('Error training model:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while training the model';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (errorMessage.includes('401')) {
        router.push('/login');
      }
    } finally {
      setIsTraining(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Model Training</h1>
              <p className="text-muted-foreground">
                Train the AI model with the latest data
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Model Training</h2>
              <p className="text-sm text-muted-foreground">
                Click the button below to start training the AI model with the latest data. 
                This process may take some time.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isTrained && (
              <Alert>
                <Rocket className="h-4 w-4" />
                <AlertTitle>Model Trained Successfully!</AlertTitle>
                <AlertDescription>
                  The AI model has been successfully trained with the latest data.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-end">
              <Button 
                onClick={handleTrainModel} 
                disabled={isTraining}
                className="gap-2"
              >
                {isTraining ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  'Train Model'
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold">Training Information</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Training the model will use the latest data available in the system.</p>
              <p>• The process may take several minutes to complete.</p>
              <p>• Avoid refreshing the page during training.</p>
              <p>• You will receive a notification once training is complete.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
