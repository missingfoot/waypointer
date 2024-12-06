import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

export const SettingsTab: React.FC = () => {
  return (
    <TabsContent value="settings" className="flex-1 p-4">
      <p className="text-muted-foreground">Additional settings coming soon...</p>
    </TabsContent>
  );
};