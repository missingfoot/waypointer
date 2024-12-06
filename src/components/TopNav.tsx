import React from 'react';
import { Button } from '@/components/ui/button';

export const TopNav: React.FC = () => {
  return (
    <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-card">
      <Button variant="ghost">
        Dashboard
      </Button>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost">
          Profile
        </Button>
        <Button>
          Publish
        </Button>
      </div>
    </div>
  );
};