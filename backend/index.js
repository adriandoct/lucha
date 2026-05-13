const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Dummy Database
let usuarios = [
  { id: 1, nombre: 'Admin', correo: 'admin', contrasena: '12345678', rol: 'admin', foto: null },
  { id: 2, nombre: 'Juan Pérez', correo: 'juan@correo.com', contrasena: '1234', rol: 'estudiante', foto: null },
  { id: 3, nombre: 'Prof. Atlantis', correo: 'atlantis@correo.com', contrasena: '1234', rol: 'maestro', foto: null }
];

let asistencias = [];
let pagos = [];

// Ruta de Inicio (Para evitar error "Not Found" al abrir la URL base)
app.get('/', (req, res) => {
  res.send('¡Backend de Lucha Libre funcionando correctamente! 🚀 Visita /api/usuarios para ver los datos.');
});

// Rutas de Usuarios
app.post('/api/usuarios', (req, res) => {
  const { nombre, correo, contrasena, rol, foto } = req.body;
  const nuevoUsuario = { id: Date.now(), nombre, correo, contrasena, rol, foto };
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

app.get('/api/usuarios', (req, res) => {
  res.json(usuarios);
});

// Ruta de Login (Simulado para demostración)
app.post('/api/login', (req, res) => {
  const { correo, contrasena } = req.body;
  const usuario = usuarios.find(u => (u.correo === correo || u.nombre === correo) && u.contrasena === contrasena);
  if (usuario) {
    res.json({ exito: true, usuario });
  } else {
    res.status(401).json({ exito: false, mensaje: 'Credenciales inválidas' });
  }
});

// Rutas de Asistencia
app.post('/api/asistencia', (req, res) => {
  const { usuario_id, qr_code } = req.body;
  const nuevaAsistencia = { id: Date.now(), usuario_id, qr_code, fecha: new Date() };
  asistencias.push(nuevaAsistencia);
  res.status(201).json(nuevaAsistencia);
});

app.get('/api/asistencia', (req, res) => {
  res.json(asistencias);
});

// Rutas de Pagos
app.post('/api/pagos', (req, res) => {
  const { usuario_id, monto } = req.body;
  const nuevoPago = { id: Date.now(), usuario_id, monto, estado: 'pagado', fecha_pago: new Date() };
  pagos.push(nuevoPago);
  res.status(201).json(nuevoPago);
});

app.get('/api/pagos', (req, res) => {
  res.json(pagos);
});

app.listen(PORT, () => {
  console.log(`Backend de Lucha Libre corriendo en puerto ${PORT}`);
});
