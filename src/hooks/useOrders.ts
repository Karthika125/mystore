
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { Order } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast({
          title: "Error loading orders",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Order[];
    },
  });
}

export function useUserOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        toast({
          title: "Error loading orders",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Order[];
    },
    enabled: !!userId,
  });
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('id', orderId)
        .single();
        
      if (error) {
        toast({
          title: "Error loading order",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Order;
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Error updating order",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
      toast({
        title: "Order updated",
        description: `Order status updated to ${variables.status}`,
      });
    },
  });
}
