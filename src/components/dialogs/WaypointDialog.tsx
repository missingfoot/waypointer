import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface WaypointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, category: string) => void;
  categories: Array<{ id: string; name: string }>;
  onCategoryAdd: (name: string) => void;
}

export const WaypointDialog: React.FC<WaypointDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  categories = [],
  onCategoryAdd,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && category) {
      onSubmit(name, category);
      setName('');
      setCategory('');
      onOpenChange(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (!categories.some(cat => cat.name.toLowerCase() === value.toLowerCase())) {
      setShowSuggestions(true);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(category.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Waypoint</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter waypoint name"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="relative">
              <Input
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Type or select category"
              />
              {showSuggestions && categories.length > 0 && (
                <div className="absolute w-full mt-1 bg-popover border rounded-md shadow-md z-50 max-h-[200px] overflow-y-auto">
                  {filteredCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="px-4 py-2 hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setCategory(cat.name);
                        setShowSuggestions(false);
                      }}
                    >
                      {cat.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Waypoint</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};