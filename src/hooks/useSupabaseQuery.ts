import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase-client'
import { PostgrestFilterBuilder } from '@supabase/postgrest-js'

interface QueryOptions {
  key: string[]
  query: () => PostgrestFilterBuilder<any>
  enabled?: boolean
}

export function useSupabaseQuery<T>({ key, query, enabled = true }: QueryOptions) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await query()
      if (error) throw error
      return data as T
    },
    enabled,
  })
} 