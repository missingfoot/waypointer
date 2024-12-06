import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
  categories: Array<{ id: string; name: string }>;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  categories,
}) => {
  const [name, setName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // Focus the name input when dialog opens
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 0);
    } else {
      // Reset form when dialog closes
      setName('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    } else if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed w-64 bg-background border rounded-lg shadow-lg z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      onKeyDown={handleKeyDown}
    >
      <form onSubmit={handleSubmit} className="p-3 space-y-2">
        <Input
          ref={nameInputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="h-8 text-sm"
          autoComplete="off"
        />
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