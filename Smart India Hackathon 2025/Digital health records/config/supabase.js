const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // For server-side operations

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey); // Client with service role key

// Database helper functions
const dbHelpers = {
  // Insert data into a table
  insert: async (table, data) => {
    try {
      // Try with regular client first
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) {
        // If RLS error, try with admin client if available
        if (error.message.includes('row-level security') && supabaseAdmin) {
          console.log('🔄 RLS error detected, trying with admin client...');
          const { data: adminResult, error: adminError } = await supabaseAdmin
            .from(table)
            .insert(data)
            .select()
            .single();
          
          if (adminError) throw adminError;
          return adminResult;
        }
        throw error;
      }
      return result;
    } catch (error) {
      throw new Error(`Error inserting into ${table}: ${error.message}`);
    }
  },

  // Find by email
  findByEmail: async (table, email) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      return data;
    } catch (error) {
      throw new Error(`Error finding ${table} by email: ${error.message}`);
    }
  },

  // Find by ID
  findById: async (table, id) => {
    try {
      const idColumn = `${table.slice(0, -1)}_id`;
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq(idColumn, id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw new Error(`Error finding ${table} by ID: ${error.message}`);
    }
  },

  // Update record
  update: async (table, id, data) => {
    try {
      const idColumn = `${table.slice(0, -1)}_id`;
      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq(idColumn, id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      throw new Error(`Error updating ${table}: ${error.message}`);
    }
  },

  // Find records by patient ID
  findByPatientId: async (table, patientId, limit = 50) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(`Error finding ${table} by patient ID: ${error.message}`);
    }
  },

  // Upload file to storage
  uploadFile: async (bucket, path, file, options = {}) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, options);
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  },

  // Get public URL for file
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete file from storage
  deleteFile: async (bucket, path) => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
};

module.exports = { supabase, supabaseAdmin, dbHelpers };
