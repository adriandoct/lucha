import { createClient } from '@supabase/supabase-js';

const url = 'https://fmnyegcmketaweksyqpt.supabase.co';
const apikey = 'sb_publishable_jt3qJ1U1j0NiPGHOvn9t3w_XDWZ8ZDY';

const supabase = createClient(url, apikey);

console.log('Listing files in "videos" bucket...');
try {
  const { data, error } = await supabase.storage
    .from('videos')
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (error) {
    console.error('Failed to list files:', error);
  } else {
    console.log('Files in bucket:', data);
  }
} catch (err) {
  console.error('Unexpected error:', err);
}
