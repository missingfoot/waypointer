import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

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
    if (value && !categories.some(cat => cat.name === value)) {
      onCategoryAdd(value);
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
                <div className="absolute w-full mt-1 bg-popover border rounded-md shadow-md z-50">
                  <Command>
                    <CommandGroup>
                      {filteredCategories.map((cat) => (
                        <CommandItem
                          key={cat.id}
                          value={cat.name}
                          onSelect={(value) => {
                            setCategory(value);
                            setShowSuggestions(false);
                          }}
                          className="flex items-center px-2 py-1.5 cursor-pointer hover:bg-accent"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              category === cat.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {cat.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
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