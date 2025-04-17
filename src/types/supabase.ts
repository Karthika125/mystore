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
          images: string[] | null
          category_id: string | null
          created_at: string
          inventory_count: number
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          images?: string[] | null
          category_id?: string | null
          created_at?: string
          inventory_count?: number
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          images?: string[] | null
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
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_price: number
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_price?: number
          quantity?: number
        }
      }
      orders: {
        Row: {
          created_at: string
          id: string
          status: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          total?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          total?: number
          user_id?: string
        }
      }
      profiles: {
        Row: {
          email: string
          id: string
          role: string
        }
        Insert: {
          email: string
          id: string
          role?: string
        }
        Update: {
          email?: string
          id?: string
          role?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
