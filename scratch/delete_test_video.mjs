const url = 'https://fmnyegcmketaweksyqpt.supabase.co/rest/v1/videos?titulo=eq.Test%20RLS%20Video';
const apikey = 'sb_publishable_jt3qJ1U1j0NiPGHOvn9t3w_XDWZ8ZDY';

console.log('Deleting test video from database...');
try {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'apikey': apikey,
      'Authorization': `Bearer ${apikey}`
    }
  });
  console.log('Status:', res.status);
} catch (err) {
  console.error('Error:', err);
}
