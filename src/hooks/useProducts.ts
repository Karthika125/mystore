
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Product[];
    },
  });
}

export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) {
        toast({
          title: "Error loading product",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Product;
    },
    enabled: !!productId,
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
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
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
