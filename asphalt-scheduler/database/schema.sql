-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table (main tenant table)
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  abn TEXT NOT NULL UNIQUE,
  contact_details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mix', 'tip')),
  address TEXT NOT NULL,
  contact JSONB NOT NULL,
  rates JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job scopes table (main jobs table)
CREATE TABLE IF NOT EXISTS job_scopes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  job_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'quoted' CHECK (status IN ('quoted', 'scheduled', 'in_progress', 'complete', 'cancelled')),
  
  -- Location details
  location_address TEXT NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_markup JSONB,
  
  -- Job details
  job_type TEXT NOT NULL CHECK (job_type IN ('mill_fill', 'resheet', 'overlay', 'patching', 'full_reconstruction')),
  shift_type TEXT NOT NULL DEFAULT 'day' CHECK (shift_type IN ('day', 'night')),
  
  -- Measurements
  milling_area DECIMAL(10, 2),
  milling_depth INTEGER, -- in mm
  paving_area DECIMAL(10, 2),
  paving_thickness INTEGER, -- in mm
  tonnage_required DECIMAL(10, 2) NOT NULL,
  truck_loads INTEGER NOT NULL,
  
  -- Materials
  mix_type TEXT NOT NULL CHECK (mix_type IN ('AC10', 'AC14', 'AC20', 'SMA', 'custom')),
  specification TEXT NOT NULL CHECK (specification IN ('council', 'rms', 'custom')),
  mix_supplier_id UUID REFERENCES suppliers(id),
  tip_site_id UUID REFERENCES suppliers(id),
  
  -- Scheduling
  crew_name TEXT,
  scheduled_date DATE,
  duration_hours INTEGER NOT NULL,
  
  -- Requirements (stored as JSONB for flexibility)
  equipment_required JSONB NOT NULL DEFAULT '{}',
  services_required JSONB NOT NULL DEFAULT '{}',
  site_restrictions JSONB NOT NULL DEFAULT '{}',
  
  -- Additional
  notes TEXT,
  photos TEXT[], -- Array of image URLs
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique job number per company
  UNIQUE(company_id, job_number)
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  job_scope_id UUID NOT NULL REFERENCES job_scopes(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  crew_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('quoted', 'scheduled', 'in_progress', 'complete', 'cancelled')),
  tonnage_scheduled DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS customers_company_id_idx ON customers(company_id);
CREATE INDEX IF NOT EXISTS suppliers_company_id_idx ON suppliers(company_id);
CREATE INDEX IF NOT EXISTS job_scopes_company_id_idx ON job_scopes(company_id);
CREATE INDEX IF NOT EXISTS job_scopes_customer_id_idx ON job_scopes(customer_id);
CREATE INDEX IF NOT EXISTS job_scopes_status_idx ON job_scopes(status);
CREATE INDEX IF NOT EXISTS job_scopes_scheduled_date_idx ON job_scopes(scheduled_date);
CREATE INDEX IF NOT EXISTS calendar_events_company_id_idx ON calendar_events(company_id);
CREATE INDEX IF NOT EXISTS calendar_events_job_scope_id_idx ON calendar_events(job_scope_id);
CREATE INDEX IF NOT EXISTS calendar_events_start_date_idx ON calendar_events(start_date);

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_scopes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Companies: Users can only see their own company
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own company" ON companies
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Customers: Users can only see customers from their company
CREATE POLICY "Users can view customers from their company" ON customers
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can insert customers for their company" ON customers
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can update customers from their company" ON customers
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can delete customers from their company" ON customers
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

-- Suppliers: Users can only see suppliers from their company
CREATE POLICY "Users can view suppliers from their company" ON suppliers
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can insert suppliers for their company" ON suppliers
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can update suppliers from their company" ON suppliers
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can delete suppliers from their company" ON suppliers
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

-- Job scopes: Users can only see job scopes from their company
CREATE POLICY "Users can view job scopes from their company" ON job_scopes
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can insert job scopes for their company" ON job_scopes
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can update job scopes from their company" ON job_scopes
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can delete job scopes from their company" ON job_scopes
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

-- Calendar events: Users can only see events from their company
CREATE POLICY "Users can view calendar events from their company" ON calendar_events
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can insert calendar events for their company" ON calendar_events
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can update calendar events from their company" ON calendar_events
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

CREATE POLICY "Users can delete calendar events from their company" ON calendar_events
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM companies WHERE auth.uid()::text = id::text
    )
  );

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_scopes_updated_at BEFORE UPDATE ON job_scopes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate job numbers automatically
CREATE OR REPLACE FUNCTION generate_job_number(company_id UUID)
RETURNS TEXT AS $$
DECLARE
  current_year TEXT := EXTRACT(year FROM NOW())::TEXT;
  company_prefix TEXT;
  next_number INTEGER;
  job_number TEXT;
BEGIN
  -- Get company prefix (first 3 letters of company name)
  SELECT UPPER(LEFT(name, 3)) INTO company_prefix
  FROM companies WHERE id = company_id;
  
  -- Get next sequential number for this year
  SELECT COALESCE(MAX(
    CASE 
      WHEN job_number ~ ('^' || company_prefix || current_year || '[0-9]+$')
      THEN CAST(SUBSTRING(job_number FROM LENGTH(company_prefix || current_year) + 1) AS INTEGER)
      ELSE 0
    END
  ), 0) + 1
  INTO next_number
  FROM job_scopes 
  WHERE company_id = generate_job_number.company_id;
  
  -- Format: ABC2024001
  job_number := company_prefix || current_year || LPAD(next_number::TEXT, 3, '0');
  
  RETURN job_number;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for development
INSERT INTO companies (id, name, abn, contact_details) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Sydney Asphalt Solutions', '12345678901', '{"email": "admin@sydneyasphalt.com.au", "phone": "02 9876 5432", "address": "123 Industrial Rd, Sydney NSW 2000"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (company_id, name, contact_name, mobile, email, address) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'City of Sydney', 'John Smith', '0412 345 678', 'john.smith@cityofsydney.nsw.gov.au', 'Town Hall, 483 George Street, Sydney NSW 2000'),
('550e8400-e29b-41d4-a716-446655440000', 'Westfield Shopping Centre', 'Mary Johnson', '0423 456 789', 'mary.johnson@westfield.com', '188 Pitt Street Mall, Sydney NSW 2000')
ON CONFLICT DO NOTHING;

INSERT INTO suppliers (company_id, name, type, address, contact, rates) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Boral Asphalt', 'mix', '45 Quarry Road, Erskine Park NSW 2759', '{"email": "sales@boral.com.au", "phone": "02 9876 1234"}', '{"rate_per_tonne": 145, "delivery_fee": 250}'),
('550e8400-e29b-41d4-a716-446655440000', 'Cleanaway Waste', 'tip', '12 Waste Drive, Eastern Creek NSW 2766', '{"email": "bookings@cleanaway.com.au", "phone": "02 9875 4321"}', '{"rate_per_tonne": 35}')
ON CONFLICT DO NOTHING;