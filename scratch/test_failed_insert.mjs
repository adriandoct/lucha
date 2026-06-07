import { createClient } from '@supabase/supabase-js';

const url = 'https://fmnyegcmketaweksyqpt.supabase.co';
const apikey = 'sb_publishable_jt3qJ1U1j0NiPGHOvn9t3w_XDWZ8ZDY';

const supabase = createClient(url, apikey);

const record = {
  titulo: 'tecnica de codos',
  descripcion: '',
  url: 'https://fmnyegcmketaweksyqpt.supabase.co/storage/v1/object/public/videos/1780792551683-day5q.mp4',
  tipo: 'entrenamiento',
  instructor: 'Sensei Carlos Martínez',
  nivel: 'Todos los niveles',
  duracion: '05:00',
  categoria_id: null
};

console.log('Inserting training video to Supabase...');
try {
  const { data, error } = await supabase
    .from('videos')
    .insert([record])
    .select();

  if (error) {
    console.error('Insert failed with error:', error);
    console.error('Error message:', error.message);
  } else {
    console.log('Insert succeeded!', data);
  }
} catch (err) {
  console.error('Unexpected error:', err);
}
