import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types for better type safety
export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          abn: string
          contact_details: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          abn: string
          contact_details: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          abn?: string
          contact_details?: any
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          company_id: string
          name: string
          contact_name: string
          mobile: string
          email: string
          address: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          contact_name: string
          mobile: string
          email: string
          address: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          contact_name?: string
          mobile?: string
          email?: string
          address?: string
          created_at?: string
          updated_at?: string
        }
      }
      job_scopes: {
        Row: {
          id: string
          company_id: string
          customer_id: string
          job_number: string
          status: string
          location_address: string
          location_lat: number | null
          location_lng: number | null
          location_markup: any | null
          job_type: string
          shift_type: string
          milling_area: number | null
          milling_depth: number | null
          paving_area: number | null
          paving_thickness: number | null
          tonnage_required: number
          truck_loads: number
          mix_type: string
          specification: string
          mix_supplier_id: string | null
          tip_site_id: string | null
          crew_name: string | null
          scheduled_date: string | null
          duration_hours: number
          equipment_required: any
          services_required: any
          site_restrictions: any
          notes: string | null
          photos: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          customer_id: string
          job_number: string
          status: string
          location_address: string
          location_lat?: number | null
          location_lng?: number | null
          location_markup?: any | null
          job_type: string
          shift_type: string
          milling_area?: number | null
          milling_depth?: number | null
          paving_area?: number | null
          paving_thickness?: number | null
          tonnage_required: number
          truck_loads: number
          mix_type: string
          specification: string
          mix_supplier_id?: string | null
          tip_site_id?: string | null
          crew_name?: string | null
          scheduled_date?: string | null
          duration_hours: number
          equipment_required: any
          services_required: any
          site_restrictions: any
          notes?: string | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          customer_id?: string
          job_number?: string
          status?: string
          location_address?: string
          location_lat?: number | null
          location_lng?: number | null
          location_markup?: any | null
          job_type?: string
          shift_type?: string
          milling_area?: number | null
          milling_depth?: number | null
          paving_area?: number | null
          paving_thickness?: number | null
          tonnage_required?: number
          truck_loads?: number
          mix_type?: string
          specification?: string
          mix_supplier_id?: string | null
          tip_site_id?: string | null
          crew_name?: string | null
          scheduled_date?: string | null
          duration_hours?: number
          equipment_required?: any
          services_required?: any
          site_restrictions?: any
          notes?: string | null
          photos?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          company_id: string
          name: string
          type: string
          address: string
          contact: any
          rates: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          name: string
          type: string
          address: string
          contact: any
          rates?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          name?: string
          type?: string
          address?: string
          contact?: any
          rates?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          company_id: string
          job_scope_id: string
          start_date: string
          end_date: string
          crew_name: string
          status: string
          tonnage_scheduled: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          job_scope_id: string
          start_date: string
          end_date: string
          crew_name: string
          status: string
          tonnage_scheduled: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          job_scope_id?: string
          start_date?: string
          end_date?: string
          crew_name?: string
          status?: string
          tonnage_scheduled?: number
          created_at?: string
          updated_at?: string
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