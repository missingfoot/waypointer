import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WaypointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string, category: string) => void;
  categories: Array<{ id: string; name: string; color: string }>;
  onCategoryAdd: (name: string, color: string) => void;
  position: { x: number; y: number };
  editMode?: boolean;
  initialData?: {
    name: string;
    category: string;
  };
  waypoint?: {
    x: number;
    y: number;
  };
  imageRef?: React.RefObject<HTMLImageElement>;
}

export const WaypointDialog: React.FC<WaypointDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  categories = [],
  onCategoryAdd,
  position,
  editMode = false,
  initialData,
  waypoint,
  imageRef,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const [dialogPosition, setDialogPosition] = useState(position);

  // Update position when waypoint coordinates or image transform changes
  useEffect(() => {
    if (open && waypoint && imageRef?.current) {
      const updatePosition = () => {
        const rect = imageRef.current?.getBoundingClientRect();
        if (rect) {
          setDialogPosition({
            x: rect.left + (waypoint.x / 100) * rect.width,
            y: rect.top + (waypoint.y / 100) * rect.height
          });
        }
      };

      // Update position immediately
      updatePosition();

      // Update position on scroll or resize
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setDialogPosition(position);
    }
  }, [open, waypoint, imageRef, position]);

  useEffect(() => {
    if (open) {
      if (editMode && initialData) {
        setName(initialData.name);
        setCategory(initialData.category);
      }
      setTimeout(() => {
        descriptionInputRef.current?.focus();
      }, 0);
    } else {
      setName('');
      setCategory('');
      setShowSuggestions(false);
    }
  }, [open, editMode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && category) {
      onSubmit(name, category);
      setName('');
      setCategory('');
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(category.toLowerCase())
  );

  if (!open) return null;

  return (
    <div 
      className="fixed w-64 bg-background border rounded-lg shadow-lg z-50"
      style={{ 
        left: `${dialogPosition.x}px`, 
        top: `${dialogPosition.y}px`
      }}
      onKeyDown={handleKeyDown}
    >
      <form onSubmit={handleSubmit} className="p-3 space-y-2">
        <Input
          ref={descriptionInputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Description"
          className="h-8 text-sm"
          autoComplete="off"
        />
        <div className="relative">
          <Input
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Type category"
            className="h-8 text-sm"
            autoComplete="off"
          />
          {showSuggestions && categories.length > 0 && (
            <div className="absolute w-full mt-1 bg-popover border rounded-md shadow-md z-50 max-h-[120px] overflow-y-auto">
              {filteredCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-2 py-1 text-sm hover:bg-accent cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    setCategory(cat.name);
                    setShowSuggestions(false);
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </div>
              ))}
            </div>
          )}
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
            {editMode ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </div>
  );
};