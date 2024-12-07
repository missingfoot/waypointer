import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SettingsTabProps {
  mapImage: { width: number; height: number } | null;
  hasWaypoints: boolean;
  onReplaceImage: (file: File) => void;
  onDeleteImage: () => void;
  onClearWaypoints: () => void;
  onClearCategories: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  mapImage,
  hasWaypoints,
  onReplaceImage,
  onDeleteImage,
  onClearWaypoints,
  onClearCategories,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onReplaceImage(file);
    }
  };

  const DimensionsText = ({ width, height }: { width: number; height: number }) => (
    <code className="relative rounded bg-background px-[0.3rem] py-[0.2rem] font-mono text-xs border">
      {width} × {height} pixels
    </code>
  );

  return (
    <div className="absolute inset-0 overflow-y-auto">
      <div className="space-y-8">
        {/* Map Management Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Map Image</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Replace Map Image</div>
                <div className="text-sm text-muted-foreground">Upload a new image to replace the current map</div>
                {mapImage && (
                  <div className="mt-2 p-3 bg-muted rounded-md space-y-2">
                    <div className="text-sm text-muted-foreground">Please upload an image of the same size to maintain waypoint alignment</div>
                    <DimensionsText width={mapImage.width} height={mapImage.height} />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <ImagePlus className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Replace Map Image</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                      Are you sure you want to replace the current map image?
                      {mapImage && (
                        <div className="mt-4 p-3 bg-muted rounded-md space-y-2">
                          <div className="text-sm text-muted-foreground">Please upload an image of the same size to maintain waypoint alignment</div>
                          <DimensionsText width={mapImage.width} height={mapImage.height} />
                        </div>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => fileInputRef.current?.click()}>
                      Choose Image
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-1">
                <div className="text-sm font-medium">Delete Map Image</div>
                <div className="text-sm text-muted-foreground">Remove the current map image</div>
                {hasWaypoints && (
                  <div className="text-sm text-muted-foreground">
                    Remove all waypoints before deleting the map image
                  </div>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    disabled={hasWaypoints}
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Map Image</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the map image? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDeleteImage}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="border-t pt-6" />

        {/* Data Management Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Data Management</h2>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Clear All Waypoints</div>
                <div className="text-sm text-muted-foreground">Delete all waypoints from the map</div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full">
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Waypoints</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all waypoints? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClearWaypoints}>Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-1">
                <div className="text-sm font-medium">Clear All Categories</div>
                <div className="text-sm text-muted-foreground">Delete all categories and their colors</div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full">
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Categories</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete all categories? This will also remove category assignments from all waypoints.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClearCategories}>Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};