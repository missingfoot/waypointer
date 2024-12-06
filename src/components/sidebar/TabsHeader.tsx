import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export const TabsHeader: React.FC = () => {
  return (
    <TabsList className="justify-start px-4 pt-4 pb-2 h-auto bg-transparent border-0 gap-4">
      <TabsTrigger 
        value="waypoints" 
        className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=inactive]:text-muted-foreground bg-transparent relative after:absolute after:inset-0 after:-m-2 after:cursor-pointer"
      >
        Waypoints
      </TabsTrigger>
      <TabsTrigger 
        value="categories" 
        className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=inactive]:text-muted-foreground bg-transparent relative after:absolute after:inset-0 after:-m-2 after:cursor-pointer"
      >
        Categories
      </TabsTrigger>
      <TabsTrigger 
        value="settings" 
        className="data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=inactive]:text-muted-foreground bg-transparent relative after:absolute after:inset-0 after:-m-2 after:cursor-pointer"
      >
        Settings
      </TabsTrigger>
    </TabsList>
  );
};