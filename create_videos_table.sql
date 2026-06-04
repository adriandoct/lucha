-- ==========================================================
-- DOJOIA - Tabla de Videos (Entrenamiento e Inicio)
-- ==========================================================

-- Crear la tabla de videos si no existe
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    url TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'entrenamiento', -- 'inicio' (Página de Inicio), 'entrenamiento' (Portal del Alumno)
    instructor TEXT DEFAULT 'Sensei Carlos Martínez',
    nivel VARCHAR(30) DEFAULT 'Todos los niveles',
    duracion VARCHAR(10) DEFAULT '05:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad
-- 1. Lectura libre para cualquier usuario (incluso no registrados para ver el video de inicio)
DROP POLICY IF EXISTS "Lectura pública de videos" ON public.videos;
CREATE POLICY "Lectura pública de videos" ON public.videos
    FOR SELECT USING (true);

-- 2. Permiso total de gestión sólo para usuarios con rol 'sensei'
DROP POLICY IF EXISTS "Senseis pueden gestionar videos" ON public.videos;
CREATE POLICY "Senseis pueden gestionar videos" ON public.videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'sensei'
        )
    );
