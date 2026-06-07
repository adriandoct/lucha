const url = 'https://fmnyegcmketaweksyqpt.supabase.co/storage/v1/bucket';
const apikey = 'sb_publishable_jt3qJ1U1j0NiPGHOvn9t3w_XDWZ8ZDY';

console.log('Fetching buckets from Supabase storage...');
try {
  const res = await fetch(url, {
    headers: {
      'apikey': apikey,
      'Authorization': `Bearer ${apikey}`
    }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
} catch (err) {
  console.error('Error:', err);
}
