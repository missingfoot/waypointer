import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
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
  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && category) {
      onSubmit(name, category);
      setName('');
      setCategory('');
      onOpenChange(false);
    }
  };

  const handleSelect = (currentValue: string) => {
    setCategory(currentValue);
    setOpenCombobox(false);
  };

  const handleCreateCategory = () => {
    if (searchValue && !categories.some(cat => cat.name === searchValue)) {
      onCategoryAdd(searchValue);
      setCategory(searchValue);
      setSearchValue('');
      setOpenCombobox(false);
    }
  };

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
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {category || "Select category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput 
                    placeholder="Search or create category..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandEmpty>
                    <Button 
                      type="button"
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={handleCreateCategory}
                    >
                      Create "{searchValue}"
                    </Button>
                  </CommandEmpty>
                  <CommandGroup>
                    {categories.map((cat) => (
                      <CommandItem
                        key={cat.id}
                        value={cat.name}
                        onSelect={handleSelect}
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
              </PopoverContent>
            </Popover>
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