import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, MapPin } from "lucide-react";

const reportSchema = z.object({
  type: z.enum(["human", "dog", "unknown"]),
  location: z.string().min(1, "Location is required"),
  neighborhood: z.string().min(1, "Neighborhood is required"),
  latitude: z.string().default("37.7749"),
  longitude: z.string().default("-122.4194"),
});

type ReportForm = z.infer<typeof reportSchema>;

export default function Report() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: "human",
      location: "",
      neighborhood: "",
      latitude: "37.7749",
      longitude: "-122.4194",
    },
  });

  const createIncidentMutation = useMutation({
    mutationFn: (data: ReportForm) => apiRequest("POST", "/api/incidents", data),
    onSuccess: () => {
      toast({
        title: "Report submitted successfully!",
        description: "Thank you for helping keep SF clean.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/neighborhoods"] });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to submit report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude.toString());
          form.setValue("longitude", position.coords.longitude.toString());
          setIsLocating(false);
          toast({
            title: "Location updated",
            description: "Your current location has been set.",
          });
        },
        (error) => {
          setIsLocating(false);
          toast({
            title: "Location error",
            description: "Could not get your location. Please enter manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLocating(false);
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: ReportForm) => {
    createIncidentMutation.mutate(data);
  };

  const neighborhoods = [
    "Tenderloin",
    "SOMA",
    "Mission",
    "Castro",
    "Financial District",
    "Union Square",
    "Nob Hill",
    "Chinatown",
    "North Beach",
    "Russian Hill",
    "Pacific Heights",
    "Haight-Ashbury",
  ];

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          className="text-orange-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Report Incident</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">💩</span>
            New Poop Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-3">
              <Label>Type of Incident</Label>
              <RadioGroup
                value={form.watch("type")}
                onValueChange={(value) => form.setValue("type", value as "human" | "dog" | "unknown")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="human" id="human" />
                  <Label htmlFor="human">Human Poop 💩</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dog" id="dog" />
                  <Label htmlFor="dog">Dog Poop 🐕</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="unknown" />
                  <Label htmlFor="unknown">Unknown ❓</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Street/Address)</Label>
              <Input
                id="location"
                placeholder="e.g., Market St & 5th St"
                {...form.register("location")}
              />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Select
                value={form.watch("neighborhood")}
                onValueChange={(value) => form.setValue("neighborhood", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select neighborhood" />
                </SelectTrigger>
                <SelectContent>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.neighborhood && (
                <p className="text-red-500 text-sm">{form.formState.errors.neighborhood.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Location Coordinates</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  {...form.register("latitude")}
                  readOnly
                />
                <Input
                  placeholder="Longitude"
                  {...form.register("longitude")}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isLocating}
                  className="flex-shrink-0"
                >
                  <MapPin className="w-4 h-4" />
                  {isLocating ? "..." : "GPS"}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={createIncidentMutation.isPending}
            >
              {createIncidentMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
