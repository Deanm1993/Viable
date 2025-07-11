// Company and authentication types
export interface Company {
  id: string
  name: string
  abn: string
  contact_details: ContactDetails
  created_at: string
  updated_at: string
}

export interface ContactDetails {
  email: string
  phone: string
  address: string
  contact_person?: string
}

// Customer types
export interface Customer {
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

// Job scoping types
export type JobType = 'mill_fill' | 'resheet' | 'overlay' | 'patching' | 'full_reconstruction'
export type ShiftType = 'day' | 'night'
export type JobStatus = 'quoted' | 'scheduled' | 'in_progress' | 'complete' | 'cancelled'
export type TruckType = 'truck_dog' | 'semi' | 'rigid'
export type MixType = 'AC10' | 'AC14' | 'AC20' | 'SMA' | 'custom'
export type SpecificationType = 'council' | 'rms' | 'custom'

export interface SiteRestrictions {
  truck_types: TruckType[]
  hazards: SiteHazard[]
  access_notes?: string
}

export interface SiteHazard {
  type: 'low_powerlines' | 'tight_access' | 'steep_grades' | 'underground_services'
  description?: string
}

export interface LocationMarkup {
  type: 'polygon' | 'line' | 'point'
  coordinates: number[][]
  description?: string
}

export interface EquipmentRequired {
  paver?: {
    required: boolean
    size_type?: string
  }
  rollers?: {
    multi_tyre: number
    steel_drum: number
  }
  milling_machine?: {
    required: boolean
    width?: string
  }
  sweeper?: boolean
  bobcat?: boolean
  hand_tools?: boolean
}

export interface ServicesRequired {
  traffic_controllers?: {
    positions: number
    hours: number
  }
  water_cart?: boolean
  line_marking?: boolean
  survey_setout?: boolean
  quality_testing?: boolean
}

export interface JobScope {
  id: string
  company_id: string
  customer_id: string
  job_number: string
  status: JobStatus
  
  // Location details
  location_address: string
  location_lat?: number
  location_lng?: number
  location_markup?: LocationMarkup[]
  
  // Job details
  job_type: JobType
  shift_type: ShiftType
  
  // Measurements
  milling_area?: number
  milling_depth?: number
  paving_area?: number
  paving_thickness?: number
  tonnage_required: number
  truck_loads: number
  
  // Materials
  mix_type: MixType
  specification: SpecificationType
  mix_supplier_id?: string
  tip_site_id?: string
  
  // Scheduling
  crew_name?: string
  scheduled_date?: string
  duration_hours: number
  
  // Requirements
  equipment_required: EquipmentRequired
  services_required: ServicesRequired
  site_restrictions: SiteRestrictions
  
  // Additional
  notes?: string
  photos?: string[]
  
  created_at: string
  updated_at: string
}

// Supplier types
export type SupplierType = 'mix' | 'tip'

export interface Supplier {
  id: string
  company_id: string
  name: string
  type: SupplierType
  address: string
  contact: ContactDetails
  rates?: {
    rate_per_tonne?: number
    delivery_fee?: number
  }
  created_at: string
  updated_at: string
}

// Calendar types
export interface CalendarEvent {
  id: string
  company_id: string
  job_scope_id: string
  start_date: string
  end_date: string
  crew_name: string
  status: JobStatus
  tonnage_scheduled: number
  created_at: string
  updated_at: string
}

// Form types for the multi-step job scoping form
export interface JobScopingFormData {
  // Step 1: Location & Site Details
  location: {
    address: string
    lat?: number
    lng?: number
    markup?: LocationMarkup[]
    site_restrictions: SiteRestrictions
    shift_type: ShiftType
  }
  
  // Step 2: Job Type & Measurements
  job_details: {
    job_type: JobType
    measurements: {
      milling_area?: number
      milling_depth?: number
      paving_area?: number
      paving_thickness?: number
    }
  }
  
  // Step 3: Materials & Specifications
  materials: {
    mix_type: MixType
    specification: SpecificationType
    mix_supplier_id?: string
    tip_site_id?: string
  }
  
  // Step 4: Resources Required
  resources: {
    equipment_required: EquipmentRequired
    services_required: ServicesRequired
  }
  
  // Step 5: Crew & Customer
  assignment: {
    customer_id: string
    crew_name?: string
    crew_size: number
    supervisor?: string
    scheduled_date?: string
  }
  
  notes?: string
  
  // Calculated fields
  tonnage_required?: number
  truck_loads?: number
}

// UI Component types
export interface FormStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
  isComplete: boolean
}

export interface ValidationWarning {
  type: 'warning' | 'error' | 'info'
  message: string
  field?: string
}