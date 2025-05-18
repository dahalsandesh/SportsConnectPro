"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCreateCityMutation } from "@/redux/api/cityApi"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  cityName: z.string().min(2, {
    message: "City name must be at least 2 characters.",
  }),
})

type CityFormProps = {
  initialData?: { cityId: string; cityName: string }
  onSuccess: () => void
}

export function CityForm({ initialData, onSuccess }: CityFormProps) {
  const [createCity, { isLoading }] = useCreateCityMutation()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityName: initialData?.cityName || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createCity({ cityName: values.cityName }).unwrap()
      toast({
        title: initialData ? "City updated" : "City created",
        description: initialData
          ? "The city has been updated successfully."
          : "The city has been created successfully.",
        variant: "success",
      })
      form.reset()
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the city. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cityName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter city name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData ? "Updating..." : "Creating..."}
            </>
          ) : initialData ? (
            "Update City"
          ) : (
            "Create City"
          )}
        </Button>
      </form>
    </Form>
  )
}
