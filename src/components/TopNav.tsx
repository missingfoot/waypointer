import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, User, Share2 } from 'lucide-react';

export const TopNav: React.FC = () => {
  return (
    <div className="h-14 border-b border-border px-4 flex items-center justify-between bg-card">
      <Button variant="ghost" className="gap-2">
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Button>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="gap-2">
          <User className="w-4 h-4" />
          Profile
        </Button>
        <Button className="gap-2">
          <Share2 className="w-4 h-4" />
          Publish
        </Button>
      </div>
    </div>
  );
};