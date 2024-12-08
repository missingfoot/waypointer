import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Home, ChevronDown, Sun, Moon, Laptop, Bug, Check, LayoutGrid, UserRound, Wrench, LogOut, Download, Upload } from 'lucide-react';
import { MapPinIcon, HandRaisedIcon } from '@heroicons/react/24/solid';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { exportWorkspace, importWorkspace } from '@/lib/workspace-utils';

interface TopNavProps {
  isAddingWaypoint: boolean;
  onToggleAddWaypoint: () => void;
  theme: 'light' | 'dark' | 'system';
  onToggleTheme: (theme: 'light' | 'dark' | 'system') => void;
  isDebugMode: boolean;
  setIsDebugMode: (enabled: boolean) => void;
  projectName: string;
  onProjectNameChange?: (name: string) => void;
  mapUrl: string | null;
  waypoints: Array<any>;
  categories: Array<any>;
  onImport: (imageUrl: string, waypoints: Array<any>, categories: Array<any>) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  isAddingWaypoint,
  onToggleAddWaypoint,
  theme,
  onToggleTheme,
  isDebugMode,
  setIsDebugMode,
  projectName,
  onProjectNameChange,
  mapUrl,
  waypoints,
  categories,
  onImport,
}) => {
  const [isMoving, setIsMoving] = React.useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempProjectName, setTempProjectName] = useState(projectName);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleWaypointClick = () => {
    if (isMoving) setIsMoving(false);
    onToggleAddWaypoint();
  };

  const handleMoveClick = () => {
    if (isAddingWaypoint) onToggleAddWaypoint();
    setIsMoving(!isMoving);
  };

  const startRename = () => {
    setIsDropdownOpen(false);
    setTimeout(() => {
      setIsEditingName(true);
      setTempProjectName(projectName);
    }, 0);
  };

  const handleRename = () => {
    const newName = tempProjectName.trim();
    if (newName && newName !== projectName) {
      if (/^[a-zA-Z0-9\s]+$/.test(newName)) {
        onProjectNameChange?.(newName);
        toast.success('Project renamed successfully', {
          position: 'top-right'
        });
      } else {
        toast.error('Project name can only contain letters and numbers', {
          position: 'top-right'
        });
      }
    }
    setIsEditingName(false);
  };

  const cancelRename = () => {
    setIsEditingName(false);
    setTempProjectName(projectName);
  };

  const truncateText = (text: string, limit: number = 24) => {
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === 'w') {
        handleWaypointClick();
      } else if (e.key.toLowerCase() === 'm') {
        handleMoveClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMoving, isAddingWaypoint]);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingName) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          handleRename();
        } else if (e.key === 'Escape') {
          cancelRename();
        }
      };

      const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          cancelRename();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('mousedown', handleClickOutside);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isEditingName, tempProjectName]);

  const handleExport = async () => {
    try {
      if (!mapUrl) {
        toast.error('No map to export. Please add a map first.');
        return;
      }
      await exportWorkspace(projectName, mapUrl, waypoints, categories);
      toast.success('Workspace exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export workspace');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change detected');
    const file = event.target.files?.[0];
    console.log('Selected file:', file);
    if (!file) {
      console.log('No file selected');
      return;
    }

    try {
      console.log('Starting import process...', file.name, file.type);
      const { workspaceData, imageUrl } = await importWorkspace(file);
      console.log('Import successful:', { workspaceData, imageUrl });
      
      onImport(imageUrl, workspaceData.waypoints, workspaceData.categories);
      console.log('onImport called with data');
      
      toast.success('Workspace imported successfully');
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import workspace');
    } finally {
      // Reset file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="h-14 border-t sm:border-t-0 sm:border-b border-border px-4 grid grid-cols-3 items-center bg-card">
      <div className="flex items-center gap-2 order-last sm:order-first justify-end sm:justify-start">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem className="py-3 px-4 text-sm cursor-pointer">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Go to Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-3 px-4 text-sm cursor-pointer">
              <UserRound className="h-4 w-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="py-3 px-4 text-sm cursor-pointer">
                <Wrench className="h-4 w-4 mr-2" />
                Developer Tools
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem 
                    className="py-3 px-4 text-sm cursor-pointer"
                    onClick={() => setIsDebugMode(!isDebugMode)}
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    {isDebugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="py-3 px-4 text-sm cursor-pointer"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Workspace
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="py-3 px-4 text-sm cursor-pointer"
                    onClick={() => {
                      console.log('Import button clicked');
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Workspace
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="py-3 px-4 text-sm cursor-pointer">
                {theme === 'light' && <Sun className="h-4 w-4 mr-2" />}
                {theme === 'dark' && <Moon className="h-4 w-4 mr-2" />}
                {theme === 'system' && <Laptop className="h-4 w-4 mr-2" />}
                <span className="capitalize">{theme} Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="min-w-[200px]">
                  <DropdownMenuItem 
                    className="py-3 px-4 text-sm cursor-pointer relative flex items-center justify-between"
                    onClick={() => onToggleTheme('light')}
                  >
                    <div className="flex items-center">
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </div>
                    {theme === 'light' && (
                      <Check className="h-4 w-4 ml-8" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="py-3 px-4 text-sm cursor-pointer relative flex items-center justify-between"
                    onClick={() => onToggleTheme('dark')}
                  >
                    <div className="flex items-center">
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </div>
                    {theme === 'dark' && (
                      <Check className="h-4 w-4 ml-8" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="py-3 px-4 text-sm cursor-pointer relative flex items-center justify-between"
                    onClick={() => onToggleTheme('system')}
                  >
                    <div className="flex items-center">
                      <Laptop className="h-4 w-4 mr-2" />
                      System
                    </div>
                    {theme === 'system' && (
                      <Check className="h-4 w-4 ml-8" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="py-3 px-4 text-sm cursor-pointer text-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {isEditingName ? (
          <div className="hidden sm:flex items-center h-10 px-3 min-w-[100px] max-w-[600px]">
            <Input
              ref={inputRef}
              value={tempProjectName}
              onChange={(e) => {
                const text = e.target.value;
                if (/^[a-zA-Z0-9\s]*$/.test(text) && text.length <= 250) {
                  setTempProjectName(text);
                }
              }}
              className="h-full w-full bg-transparent border-0 shadow-none focus:border-0 focus:ring-0 focus-visible:ring-0 p-0 font-medium"
            />
          </div>
        ) : (
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden sm:flex gap-2 h-10 px-3">
                {truncateText(projectName)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem className="py-3 px-4 text-sm cursor-pointer">
                Project Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="py-3 px-4 text-sm cursor-pointer"
                onClick={startRename}
              >
                Rename Project
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 px-4 text-sm cursor-pointer">
                Duplicate Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex justify-center col-start-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isAddingWaypoint ? "default" : "ghost"} 
                onClick={handleWaypointClick}
                className={`aspect-square h-14 w-14 flex-none rounded-none p-0 flex items-center justify-center focus:outline-none ${isAddingWaypoint ? 'bg-blue-500 hover:bg-blue-600 [&>svg]:text-white dark:[&>svg]:text-white' : ''}`}
              >
                <MapPinIcon className="!h-[24px] !w-[24px] min-h-[24px] min-w-[24px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Waypoint tool (W)</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isMoving ? "default" : "ghost"}
                onClick={handleMoveClick}
                className={`aspect-square h-14 w-14 flex-none rounded-none p-0 flex items-center justify-center border-l border-border focus:outline-none ${isMoving ? 'bg-blue-500 hover:bg-blue-600 [&>svg]:text-white dark:[&>svg]:text-white' : ''}`}
              >
                <HandRaisedIcon className="!h-[24px] !w-[24px] min-h-[24px] min-w-[24px]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Move tool (M)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="hidden sm:flex justify-end">
        <Button>
          Publish
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".zip"
        onChange={handleImport}
        onClick={(e) => console.log('File input clicked')}
      />
    </div>
  );
};