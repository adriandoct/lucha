import { createClient } from '@supabase/supabase-js';

const url = 'https://fmnyegcmketaweksyqpt.supabase.co';
const apikey = 'sb_publishable_jt3qJ1U1j0NiPGHOvn9t3w_XDWZ8ZDY';

const supabase = createClient(url, apikey);

console.log('Testing upload error structure for non-existent bucket...');
const dummyContent = 'Hello World';
const fileBody = new Blob([dummyContent], { type: 'text/plain' });

try {
  const { data, error } = await supabase.storage
    .from('nonexistent_bucket_xyz')
    .upload('test_dummy.txt', fileBody, {
      contentType: 'text/plain',
      upsert: true
    });

  console.log('Error object:', error);
  console.log('Error type:', typeof error);
  console.log('Error stringified:', JSON.stringify(error));
  if (error) {
    console.log('error.message:', error.message);
    console.log('error.error:', error.error);
    console.log('keys of error:', Object.keys(error));
  }
} catch (err) {
  console.error('Unexpected exception:', err);
}
