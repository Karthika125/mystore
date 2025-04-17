'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Category } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Fetching categories...');
      try {
        const { data, error, status } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        console.log('Categories response:', { data, error, status });
        
        if (error) {
          console.error('Error fetching categories:', error);
          toast({
            title: "Error loading categories",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        if (!data) {
          console.log('No categories found');
          return [];
        }
        
        console.log(`Found ${data.length} categories`);
        return data;
      } catch (error) {
        console.error('Unexpected error in useCategories:', error);
        throw error;
      }
    },
    retry: 1,
  });
}

export function useCategory(id: string | undefined) {
  return useQuery<Category>({
    queryKey: ['category', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Category ID is required');
      }
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        toast({
          title: "Error loading category",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: Omit<Category, 'id'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error creating category",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category created",
        description: "The category has been created successfully",
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<Category> & { id: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error updating category",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
      toast({
        title: "Category updated",
        description: "The category has been updated successfully",
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) {
        toast({
          title: "Error deleting category",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully",
      });
    },
  });
} 