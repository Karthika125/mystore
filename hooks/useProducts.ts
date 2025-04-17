'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Fetching products...');
      try {
        const { data, error, status } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        console.log('Products response:', { data, error, status });
        
        if (error) {
          console.error('Error fetching products:', error);
          toast({
            title: "Error loading products",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        
        if (!data) {
          console.log('No products found');
          return [];
        }
        
        console.log(`Found ${data.length} products`);
        return data;
      } catch (error) {
        console.error('Unexpected error in useProducts:', error);
        throw error;
      }
    },
    retry: 1,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Product ID is required');
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        toast({
          title: "Error loading product",
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

export function useProductsByCategory(categoryId: string | undefined) {
  return useQuery<Product[]>({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!categoryId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error creating product",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product created",
        description: "The product has been created successfully",
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error updating product",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        toast({
          title: "Error deleting product",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      });
    },
  });
} 