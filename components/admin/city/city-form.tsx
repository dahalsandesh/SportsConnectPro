"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCityMutation, useUpdateCityMutation } from "@/redux/api/admin/citiesApi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  cityName: z.string().min(2, {
    message: "City name must be at least 2 characters.",
  }),
  cityId: z.string().optional(),
});

type CityFormProps = {
  initialData?: { cityId: string; cityName: string };
  onSuccess: () => void;
};

export function CityForm({ initialData, onSuccess }: CityFormProps) {
  const [createCity, { isLoading: isCreating }] = useCreateCityMutation();
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();
  const { toast } = useToast();
  const isEditing = !!initialData?.cityId;
  const isLoading = isCreating || isUpdating;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityId: initialData?.cityId || "",
      cityName: initialData?.cityName || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEditing && initialData?.cityId) {
        await updateCity({
          cityId: initialData.cityId,
          cityName: values.cityName,
        }).unwrap();
      } else {
        await createCity({ cityName: values.cityName }).unwrap();
      }
      
      toast({
        title: isEditing ? "City updated" : "City created",
        description: isEditing
          ? "The city has been updated successfully."
          : "The city has been created successfully.",
        variant: "success",
      });
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the city. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isEditing && (
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="cityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter city name" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update" : "Create"} City
          </Button>
        </div>
      </form>
    </Form>
  );
}
