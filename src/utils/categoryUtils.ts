import { Category } from '../types';

export const categoryColors = [
  '#9b87f5', '#F97316', '#0EA5E9', '#D946EF', '#33C3F0', 
  '#FEC6A1', '#E5DEFF', '#D3E4FD', '#8B5CF6', '#1EAEDB'
];

export function createNewCategory(name: string, existingCategories: Category[]): Category {
  const color = categoryColors[existingCategories.length % categoryColors.length];
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    color,
  };
}

export function findCategoryByName(name: string, categories: Category[]): Category | undefined {
  return categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
}

export function isCategoryNameTaken(name: string, categories: Category[]): boolean {
  return categories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
} 