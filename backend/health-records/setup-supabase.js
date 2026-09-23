const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Supabase database...');
    
    // Test connection
    const { data, error } = await supabase.from('patients').select('count').limit(1);
    if (error) {
      console.log('⚠️  Database tables not found. Creating them...');
      
      // Create tables using SQL
      const createTablesSQL = `
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
          file_url TEXT,
          file_name TEXT,
          file_type TEXT,
          file_size BIGINT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create storage bucket for health documents
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('health-documents', 'health-documents', true)
        ON CONFLICT (id) DO NOTHING;
      `;

      const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTablesSQL });
      
      if (sqlError) {
        console.log('⚠️  Could not create tables via RPC. Please run the SQL manually in Supabase dashboard.');
        console.log('📋 Go to: https://supabase.com/dashboard');
        console.log('📋 Select your project');
        console.log('📋 Go to SQL Editor');
        console.log('📋 Copy and paste the contents of supabase-schema.sql');
        console.log('📋 Click "Run"');
        return;
      }
    }

    // Insert demo data
    console.log('📝 Inserting demo data...');
    
    const { error: patientError } = await supabase
      .from('patients')
      .upsert({
        patient_id: '5dc0346d-8ef1-4faa-ac4b-078f213187f4',
        name: 'Ishank Pandey',
        email: 'pandeyishank1611@gmail.com',
        password: '$2a$12$FW1gGiuxc4LL1J3lqxfrO.wIbbKVqnUvZ8B3xIV0uPpof7wXapzzW',
        phone: '7455800399',
        age: 18,
        gender: 'male',
        address: 'Bennett University'
      });

    if (patientError) {
      console.log('⚠️  Could not insert demo patient:', patientError.message);
    } else {
      console.log('✅ Demo patient created');
    }

    const { error: doctorError } = await supabase
      .from('doctors')
      .upsert({
        doctor_id: 'demo-doctor-1',
        name: 'Ishank',
        email: 'pandeyishank123@gmail.com',
        password: '$2a$12$demo.hash.for.testing',
        specialization: 'General Medicine',
        hospital: 'AIIMS',
        contact: '7455800398',
        license_number: '12345'
      });

    if (doctorError) {
      console.log('⚠️  Could not insert demo doctor:', doctorError.message);
    } else {
      console.log('✅ Demo doctor created');
    }

    console.log('🎉 Supabase setup complete!');
    console.log('🌐 Your app is now ready with file uploads!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('📋 Please run the SQL manually in Supabase dashboard:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy and paste the contents of supabase-schema.sql');
    console.log('5. Click "Run"');
  }
}

setupDatabase();
