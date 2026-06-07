import { createClient } from '@supabase/supabase-js';

const url = 'https://fmnyegcmketaweksyqpt.supabase.co';
const apikey = 'sb_publishable_jt3qJ1U1j0NiPGHOvn9t3w_XDWZ8ZDY';

const supabase = createClient(url, apikey);

console.log('Testing upload to "videos" bucket...');
const dummyContent = 'Hello World';
const fileBody = new Blob([dummyContent], { type: 'text/plain' });

try {
  const { data, error } = await supabase.storage
    .from('videos')
    .upload('test_dummy.txt', fileBody, {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error('Upload failed with error object:', JSON.stringify(error, null, 2));
    console.error('Error message:', error.message);
  } else {
    console.log('Upload succeeded!', data);
  }
} catch (err) {
  console.error('Unexpected exception during upload:', err);
}
