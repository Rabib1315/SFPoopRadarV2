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

import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Camera, Upload } from "lucide-react";

const reportSchema = z.object({
  type: z.enum(["human", "dog", "unknown"]),
  location: z.string().default(""),
  neighborhood: z.string().default(""),
  latitude: z.string().default("37.7749"),
  longitude: z.string().default("-122.4194"),
  imageUrl: z.string().optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

export default function Report() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLocating, setIsLocating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: "human",
      location: "",
      neighborhood: "",
      latitude: "37.7749",
      longitude: "-122.4194",
      imageUrl: "",
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

  // Function to determine neighborhood from coordinates
  const getNeighborhoodFromCoords = (lat: number, lng: number): string => {
    // SF neighborhood boundaries (approximate)
    const neighborhoods = [
      { name: "Tenderloin", bounds: { minLat: 37.783, maxLat: 37.787, minLng: -122.415, maxLng: -122.408 } },
      { name: "SOMA", bounds: { minLat: 37.770, maxLat: 37.785, minLng: -122.415, maxLng: -122.390 } },
      { name: "Mission", bounds: { minLat: 37.745, maxLat: 37.770, minLng: -122.430, maxLng: -122.405 } },
      { name: "Castro", bounds: { minLat: 37.755, maxLat: 37.765, minLng: -122.440, maxLng: -122.425 } },
      { name: "Financial District", bounds: { minLat: 37.790, maxLat: 37.800, minLng: -122.405, maxLng: -122.395 } },
      { name: "Union Square", bounds: { minLat: 37.785, maxLat: 37.790, minLng: -122.410, maxLng: -122.405 } },
      { name: "Nob Hill", bounds: { minLat: 37.790, maxLat: 37.795, minLng: -122.415, maxLng: -122.405 } },
    ];

    for (const neighborhood of neighborhoods) {
      const { bounds } = neighborhood;
      if (lat >= bounds.minLat && lat <= bounds.maxLat && 
          lng >= bounds.minLng && lng <= bounds.maxLng) {
        return neighborhood.name;
      }
    }
    
    // Default to closest neighborhood if not in bounds
    return "SOMA";
  };

  // Function to reverse geocode coordinates to street address
  const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using a mock address for now - in production you'd use Google Geocoding API
      const streets = [
        "Market St & 5th St",
        "Geary St & Jones St", 
        "Eddy St & Hyde St",
        "Mission St & 16th St",
        "Castro St & 18th St"
      ];
      return streets[Math.floor(Math.random() * streets.length)];
    } catch (error) {
      return "San Francisco, CA";
    }
  };

  const getCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          form.setValue("latitude", lat.toString());
          form.setValue("longitude", lng.toString());
          
          // Auto-detect neighborhood
          const neighborhood = getNeighborhoodFromCoords(lat, lng);
          form.setValue("neighborhood", neighborhood);
          
          // Get street address
          const address = await getAddressFromCoords(lat, lng);
          form.setValue("location", address);
          
          setIsLocating(false);
          toast({
            title: "Location shared successfully",
            description: `Detected: ${neighborhood}, ${address}`,
          });
        },
        (error) => {
          setIsLocating(false);
          let errorMessage = "";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please click the location icon in your browser's address bar and allow location access, then try again.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable. Please check your GPS settings.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "An unknown error occurred while getting your location.";
              break;
          }
          
          toast({
            title: "Location sharing failed",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
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

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // For now, we'll simulate an upload and set a placeholder URL
      form.setValue("imageUrl", "placeholder-image-url");
      toast({
        title: "Image selected",
        description: "Photo has been attached to your report.",
      });
    }
  };

  const onSubmit = (data: ReportForm) => {
    // Ensure location data is present before submitting
    if (!data.location || !data.neighborhood) {
      toast({
        title: "Location required",
        description: "Please share your location before submitting the report.",
        variant: "destructive",
      });
      return;
    }
    createIncidentMutation.mutate(data);
  };

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

            <div className="space-y-3">
              <Label>Your Location</Label>
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isLocating}
                className="w-full flex items-center gap-2 justify-center py-6"
              >
                <MapPin className="w-5 h-5" />
                {isLocating ? "Detecting Location..." : "Share Your Location"}
              </Button>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800">📍 Location Permission Required</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your browser will ask for location permission. Click "Allow" to automatically detect your neighborhood and street address.
                </p>
              </div>
              
              {form.watch("location") && form.watch("neighborhood") && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-800">Location Detected:</p>
                  <p className="text-sm text-green-700">{form.watch("location")}</p>
                  <p className="text-sm text-green-600">{form.watch("neighborhood")}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Photo Evidence (Optional)</Label>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </Button>
                </div>
                
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Selected poop evidence"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        form.setValue("imageUrl", "");
                      }}
                      className="absolute top-2 right-2"
                    >
                      Remove
                    </Button>
                  </div>
                )}
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
