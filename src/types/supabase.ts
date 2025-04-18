export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          images: string[]
          category_id: string | null
          created_at: string
          inventory_count: number
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          images: string[]
          category_id?: string | null
          created_at?: string
          inventory_count: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          images?: string[]
          category_id?: string | null
          created_at?: string
          inventory_count?: number
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          total: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total?: number
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
