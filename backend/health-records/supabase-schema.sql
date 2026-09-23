-- Supabase Database Schema for Rural Healthcare System
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  patient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  specialization TEXT,
  hospital TEXT,
  contact TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pharmacists table
CREATE TABLE IF NOT EXISTS pharmacists (
  pharmacist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  pharmacy_name TEXT,
  license_number TEXT,
  contact TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
  record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(doctor_id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT,
  vital_signs TEXT,
  file_url TEXT, -- URL to uploaded file in Supabase Storage
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_records_patient_id ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_records_doctor_id ON health_records(doctor_id);
CREATE INDEX IF NOT EXISTS idx_health_records_created_at ON health_records(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pharmacists_updated_at BEFORE UPDATE ON pharmacists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacists ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create policies for patients
CREATE POLICY "Patients can view own data" ON patients
  FOR SELECT USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Patients can update own data" ON patients
  FOR UPDATE USING (auth.uid()::text = patient_id::text);

-- Create policies for doctors
CREATE POLICY "Doctors can view own data" ON doctors
  FOR SELECT USING (auth.uid()::text = doctor_id::text);

CREATE POLICY "Doctors can update own data" ON doctors
  FOR UPDATE USING (auth.uid()::text = doctor_id::text);

-- Create policies for pharmacists
CREATE POLICY "Pharmacists can view own data" ON pharmacists
  FOR SELECT USING (auth.uid()::text = pharmacist_id::text);

CREATE POLICY "Pharmacists can update own data" ON pharmacists
  FOR UPDATE USING (auth.uid()::text = pharmacist_id::text);

-- Create policies for health records
CREATE POLICY "Patients can view own health records" ON health_records
  FOR SELECT USING (auth.uid()::text = patient_id::text);

CREATE POLICY "Doctors can view health records they created" ON health_records
  FOR SELECT USING (auth.uid()::text = doctor_id::text);

CREATE POLICY "Patients can create health records" ON health_records
  FOR INSERT WITH CHECK (auth.uid()::text = patient_id::text);

CREATE POLICY "Doctors can create health records" ON health_records
  FOR INSERT WITH CHECK (auth.uid()::text = doctor_id::text);

-- Create storage bucket for health documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('health-documents', 'health-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Authenticated users can upload health documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'health-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own health documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'health-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own health documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'health-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert demo data
INSERT INTO patients (patient_id, name, email, password, phone, age, gender, address) VALUES
  ('5dc0346d-8ef1-4faa-ac4b-078f213187f4', 'Ishank Pandey', 'pandeyishank1611@gmail.com', '$2a$12$FW1gGiuxc4LL1J3lqxfrO.wIbbKVqnUvZ8B3xIV0uPpof7wXapzzW', '7455800399', 18, 'male', 'Bennett University')
ON CONFLICT (email) DO NOTHING;

INSERT INTO doctors (doctor_id, name, email, password, specialization, hospital, contact, license_number) VALUES
  ('demo-doctor-1', 'Ishank', 'pandeyishank123@gmail.com', '$2a$12$demo.hash.for.testing', 'General Medicine', 'AIIMS', '7455800398', '12345')
ON CONFLICT (email) DO NOTHING;
