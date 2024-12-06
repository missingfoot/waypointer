import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapUploadInterfaceProps {
  onMapUpload: (file: File) => void;
}

export const MapUploadInterface: React.FC<MapUploadInterfaceProps> = ({ onMapUpload }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground p-4">
      <Upload className="w-12 h-12" />
      <p className="text-center">Drag and drop your map image here or click to upload</p>
      <Button
        variant="outline"
        onClick={() => document.getElementById('map-upload')?.click()}
      >
        Upload Map
      </Button>
      <input
        id="map-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onMapUpload(file);
        }}
      />
    </div>
  );
};