import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WaypointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, category: string) => void;
  categories: Array<{ id: string; name: string }>;
  onCategoryAdd: (name: string) => void;
  position: { x: number; y: number };
}

export const WaypointDialog: React.FC<WaypointDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  categories = [],
  onCategoryAdd,
  position,
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

  if (!open) return null;

  return (
    <div 
      className="fixed w-64 bg-background border rounded-lg shadow-lg z-50"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`
      }}
    >
      <form onSubmit={handleSubmit} className="p-3 space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name" className="text-xs">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Waypoint name"
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Category</Label>
          <div className="relative">
            <Input
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Type category"
              className="h-8 text-sm"
            />
            {showSuggestions && categories.length > 0 && (
              <div className="absolute w-full mt-1 bg-popover border rounded-md shadow-md z-50 max-h-[120px] overflow-y-auto">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="px-2 py-1 text-sm hover:bg-accent cursor-pointer"
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
        <div className="flex justify-end space-x-2 pt-1">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-7 text-xs px-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="h-7 text-xs px-2"
          >
            Add
          </Button>
        </div>
      </form>
    </div>
  );
};