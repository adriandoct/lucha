-- ==========================================
-- LUCHA LIBRE + QR ASSIST PRO - SUPABASE UNIFIED SCHEMA
-- ==========================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Limpiar tipos anteriores (por si vuelves a correr el script)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;

-- Creación de Tipos (Enums)
CREATE TYPE user_role AS ENUM ('estudiante', 'maestro', 'administrador', 'padre');
CREATE TYPE payment_status AS ENUM ('pagado', 'pendiente');
CREATE TYPE attendance_status AS ENUM ('presente', 'retardo', 'falta', 'justificado');

-- 1. Tabla de Usuarios (Extiende auth.users de Supabase)
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    rol user_role DEFAULT 'estudiante'::user_role NOT NULL,
    foto_url TEXT,
    telefono TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Maestros (Detalles específicos para maestros)
CREATE TABLE public.maestros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    especialidad TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Grupos (QR Assist Pro)
CREATE TABLE public.grupos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    maestro_id UUID REFERENCES public.maestros(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabla Intermedia Usuario-Grupo
CREATE TABLE public.usuario_grupos (
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    grupo_id UUID REFERENCES public.grupos(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, grupo_id)
);

-- 4. Tabla de Horarios (Mejorada)
CREATE TABLE public.horarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maestro_id UUID REFERENCES public.maestros(id) ON DELETE CASCADE,
    grupo_id UUID REFERENCES public.grupos(id) ON DELETE CASCADE,
    dia TEXT NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tolerancia_minutos INTEGER DEFAULT 15,
    nombre_clase TEXT NOT NULL DEFAULT 'Clase de Lucha',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla de Pagos
CREATE TABLE public.pagos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,
    estado payment_status DEFAULT 'pendiente'::payment_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabla de Códigos QR Dinámicos (QR Assist Pro)
CREATE TABLE public.codigos_qr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabla de Asistencia (Mejorada para QR Assist Pro)
CREATE TABLE public.asistencia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    scanned_by UUID REFERENCES public.usuarios(id),
    grupo_id UUID REFERENCES public.grupos(id),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    estado attendance_status DEFAULT 'presente'::attendance_status NOT NULL,
    scan_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    device_info TEXT,
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabla de Notificaciones (QR Assist Pro)
CREATE TABLE public.notificaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    tipo VARCHAR(50), 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configuración de Seguridad (Row Level Security - RLS)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maestros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad (Modo Desarrollo: Todos pueden leer por ahora)
CREATE POLICY "Lectura pública de usuarios" ON public.usuarios FOR SELECT USING (true);
CREATE POLICY "Lectura pública de maestros" ON public.maestros FOR SELECT USING (true);
CREATE POLICY "Lectura pública de horarios" ON public.horarios FOR SELECT USING (true);
CREATE POLICY "Usuarios ven sus pagos" ON public.pagos FOR SELECT USING (auth.uid() = usuario_id OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'administrador');
CREATE POLICY "Usuarios ven su asistencia" ON public.asistencia FOR SELECT USING (auth.uid() = usuario_id OR (SELECT rol FROM public.usuarios WHERE id = auth.uid()) = 'administrador');

-- Trigger para crear usuario automáticamente en public.usuarios al registrarse en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, nombre, correo, rol)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'nombre', 
    new.email, 
    COALESCE((new.raw_user_meta_data->>'rol')::user_role, 'estudiante'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
