
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Category } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) {
        toast({
          title: "Error loading categories",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Category[];
    },
  });
}

export function useCategory(categoryId: string | undefined) {
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
        
      if (error) {
        toast({
          title: "Error loading category",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Category;
    },
    enabled: !!categoryId,
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
