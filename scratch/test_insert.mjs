const url = 'https://fmnyegcmketaweksyqpt.supabase.co/rest/v1/videos';
const apikey = 'sb_publishable_jt3qJ1U1j0NiPGHOvn9t3w_XDWZ8ZDY';

const payload = {
  titulo: 'Test RLS Video',
  descripcion: 'Testing if RLS allows inserts',
  url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
  tipo: 'entrenamiento'
};

console.log('Attempting anonymous insert into videos table...');
try {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': apikey,
      'Authorization': `Bearer ${apikey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(payload)
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
} catch (err) {
  console.error('Error:', err);
}
