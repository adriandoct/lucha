import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tknhvwwprrhpvbpnwzoe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbmh2d3dwcnJocHZicG53em9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MzM0MjUsImV4cCI6MjA5NDIwOTQyNX0.5EsNLfTD6XyMZeA5RHMnYdyq8WafLumoRrpvvZhOxns';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@admin.com',
    password: '12345678Cecyte',
    options: {
      data: {
        nombre: 'Admin General',
        rol: 'administrador'
      }
    }
  });

  if (error) {
    console.error('Error creando administrador:', error.message);
  } else {
    console.log('¡Administrador creado con éxito!', data.user.email);
  }
}

createAdmin();
