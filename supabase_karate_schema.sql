-- ==========================================
-- DOJOIA ACCESS - Esquema de Base de Datos para Dojo Shito-Ryu
-- ==========================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. ENUMS (Tipos de datos de Karate)
-- ==========================================
CREATE TYPE user_role AS ENUM ('sensei', 'sempai', 'tutor', 'karateka');
CREATE TYPE belt_level AS ENUM (
  'blanco',        -- 10 Kyu y 9 Kyu
  'amarillo',      -- 8 Kyu
  'naranja',       -- 7 Kyu
  'verde',         -- 6 Kyu
  'azul',          -- 5 Kyu
  'marron',        -- 4 Kyu a 1 Kyu
  'negro'          -- 1 Dan en adelante
);

-- ==========================================
-- 2. TABLAS PRINCIPALES
-- ==========================================

-- PERFILES DE USUARIOS DEL SISTEMA (Sensei, Sempai, etc.)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'tutor',
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REPOSITORIO DE KARATEKAS (Alumnos de la academia)
CREATE TABLE IF NOT EXISTS public.karatekas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    matricula VARCHAR(50) UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    cinturon belt_level NOT NULL DEFAULT 'blanco',
    grado VARCHAR(30) NOT NULL DEFAULT '10° Kyu', -- e.g. "10° Kyu", "6° Kyu", "1° Dan"
    tutor TEXT NOT NULL,
    telefono VARCHAR(20) NOT NULL, -- Número de celular del tutor para enviar WhatsApp
    foto_url TEXT, -- Almacenamiento de fotografía
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- REGISTRO DE ASISTENCIAS (Entradas y Salidas con QR)
CREATE TABLE IF NOT EXISTS public.asistencias_karate (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    karateka_id UUID REFERENCES public.karatekas(id) ON DELETE CASCADE NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    hora TIME NOT NULL DEFAULT CURRENT_TIME,
    dispositivo TEXT, -- Información del dispositivo que escaneó
    whatsapp_sent BOOLEAN DEFAULT false,
    whatsapp_status TEXT DEFAULT 'pending', -- pending, sent, error, simulated
    whatsapp_error TEXT,
    escaneado_por UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CONFIGURACIÓN DEL DOJO Y WHATSAPP
CREATE TABLE IF NOT EXISTS public.configuracion_dojo (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dojo_name TEXT NOT NULL DEFAULT 'Dojo Dojoia Shito-Ryu',
    sensei_principal TEXT NOT NULL DEFAULT 'Sensei Carlos Martínez',
    estilo VARCHAR(50) NOT NULL DEFAULT 'Shito-Ryu',
    whatsapp_provider VARCHAR(20) NOT NULL DEFAULT 'mock', -- mock, meta, twilio
    whatsapp_token TEXT,
    whatsapp_phone_number_id TEXT,
    template_entrada TEXT NOT NULL DEFAULT '🥋 *{dojo_name}*\n\nHola *{tutor}*,\n\nLe informamos que el karateka:\n👦 *{nombre}* ({cinturon} - {grado})\n\n✅ *ENTRÓ* a entrenar.\n\n🕒 Hora: {hora}\n📅 Fecha: {fecha}\n\n🥋 ¡Oss!',
    template_salida TEXT NOT NULL DEFAULT '🥋 *{dojo_name}*\n\nHola *{tutor}*,\n\nLe informamos que el karateka:\n👦 *{nombre}* ({cinturon} - {grado})\n\n✅ *SALIÓ* del Dojo.\n\n🕒 Hora: {hora}\n📅 Fecha: {fecha}\n\n🥋 ¡Oss!',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROGRAMA TÉCNICO Y CLASES (Opcional - Estructura Dojo)
CREATE TABLE IF NOT EXISTS public.horarios_clases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nombre_clase TEXT NOT NULL, -- e.g. "Infantil Principiantes", "Avanzados Kata", "Kumite Adultos"
    dia_semana VARCHAR(15) NOT NULL, -- e.g. "Lunes", "Martes"
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    sensei_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. TRIGGERS Y FUNCIONES DE SEGURIDAD
-- ==========================================

-- Trigger para auto-actualizar timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_karatekas_updated_at BEFORE UPDATE ON public.karatekas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_configuracion_dojo_updated_at BEFORE UPDATE ON public.configuracion_dojo FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Función para insertar perfil automático al crear cuenta en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Sensei Invitado'),
    NEW.email,
    'sensei'::user_role
  );
  RETURN NEW;
END;
$$;

-- Vincular trigger a auth.users (si ya existía, lo actualiza)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 4. SEGURIDAD (RLS - Row Level Security)
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.karatekas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias_karate ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion_dojo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horarios_clases ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Permitir lectura general de perfiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Permitir actualizar propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Senseis y Sempais pueden gestionar karatekas" ON public.karatekas 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('sensei', 'sempai')
        )
    );

CREATE POLICY "Lectura pública de karatekas" ON public.karatekas FOR SELECT USING (true);

CREATE POLICY "Lectura y escritura general de asistencias" ON public.asistencias_karate FOR ALL USING (true);

CREATE POLICY "Lectura pública de configuración dojo" ON public.configuracion_dojo FOR SELECT USING (true);
CREATE POLICY "Solo Sensei puede modificar configuración" ON public.configuracion_dojo FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sensei')
);

CREATE POLICY "Lectura de clases para todos" ON public.horarios_clases FOR SELECT USING (true);
CREATE POLICY "Gestión de clases para Sensei" ON public.horarios_clases FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'sensei')
);

-- ==========================================
-- 5. SEMILLA DE DATOS (Configuración y Demo Inicial)
-- ==========================================
INSERT INTO public.configuracion_dojo (dojo_name, sensei_principal, estilo) 
VALUES ('Dojo Dojoia Shito-Ryu', 'Sensei Carlos Martínez', 'Shito-Ryu')
ON CONFLICT DO NOTHING;

-- Insertar Karatekas de Prueba
INSERT INTO public.karatekas (matricula, nombre, cinturon, grado, tutor, telefono, foto_url) VALUES
('KA-2026-001', 'Mateo García López', 'verde', '6° Kyu', 'Adriana López', '+5215512345678', 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=200'),
('KA-2026-002', 'Sofía Martínez Ruiz', 'amarillo', '8° Kyu', 'Carlos Martínez', '+5215587654321', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'),
('KA-2026-003', 'Diego Fernández Silva', 'negro', '1° Dan', 'Juan Fernández', '+5215545678901', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'),
('KA-2026-004', 'Valentina Ruiz Castro', 'azul', '5° Kyu', 'Patricia Castro', '+5215598765432', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200'),
('KA-2026-005', 'Lucas Torres Mendoza', 'marron', '2° Kyu', 'Fernando Torres', '+5215565432109', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200')
ON CONFLICT (matricula) DO NOTHING;
