import { createClient } from '@supabase/supabase-js';

const url = 'https://fmnyegcmketaweksyqpt.supabase.co';
const apikey = 'sb_publishable_jt3qJ1U1j0NiPGHOvn9t3w_XDWZ8ZDY';

const supabase = createClient(url, apikey);

const record = {
  titulo: 'Test Inicio Video',
  descripcion: 'Testing if thumbnail column exists',
  url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
  tipo: 'inicio',
  instructor: 'Sensei Carlos Martínez',
  nivel: 'Todos los niveles',
  duracion: '05:00',
  categoria_id: null,
  thumbnail: '/karate-hero.png'
};

console.log('Inserting homepage video with thumbnail...');
try {
  const { data, error } = await supabase
    .from('videos')
    .insert([record])
    .select();

  if (error) {
    console.error('Insert failed:', error);
    console.error('Error message:', error.message);
  } else {
    console.log('Insert succeeded!', data);
    // Cleanup
    if (data && data.length > 0) {
      await supabase.from('videos').delete().eq('id', data[0].id);
      console.log('Cleaned up test record');
    }
  }
} catch (err) {
  console.error('Unexpected error:', err);
}
