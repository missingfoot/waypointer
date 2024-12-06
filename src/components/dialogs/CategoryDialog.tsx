import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, color: string) => void;
  categories: Array<{ id: string; name: string; color: string }>;
  position: { x: number; y: number };
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  categories,
  position,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#9b87f5');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 0);
    } else {
      setName('');
      setColor('#9b87f5');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), color);
      setName('');
      setColor('#9b87f5');
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
      className="fixed w-64 bg-background border rounded-lg shadow-lg z-50"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translateX(-90%)' // This shifts the dialog to appear from the right
      }}
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
        <div className="flex gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-16 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 text-sm flex-1"
            placeholder="#000000"
          />
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