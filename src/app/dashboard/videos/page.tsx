"use client";

import { useEffect, useState } from "react";
import styles from "./videos.module.css";
import { 
  Play, 
  Clock, 
  User, 
  X, 
  Video, 
  Lock, 
  ChevronRight,
  Maximize2,
  Volume2
} from "lucide-react";
import { redirect } from "next/navigation";

interface TrainingVideo {
  id: string;
  title: string;
  desc: string;
  duration: string;
  instructor: string;
  level: string;
  thumbnail: string;
  videoUrl?: string;
}

// Client-side helper to read cookies
const getCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  return '';
};

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  // Protection Check: Redirect to login if user cookie is missing (registered users only)
  useEffect(() => {
    const userEmail = getCookie("dojoia_email");
    if (!userEmail) {
      redirect("/login?error=Debes iniciar sesión para ver los videos exclusivos de entrenamiento.");
    }
  }, []);

  const videos: TrainingVideo[] = [
    {
      id: "v1",
      title: "Pinan Shodan - Kata Completo y Detalles",
      desc: "Guía paso a paso del primer kata de la serie Pinan. Posiciones de cadera, Zenkutsu Dachi y bloqueos altos.",
      duration: "05:12",
      instructor: "Sensei Carlos Martínez",
      level: "Principiantes",
      thumbnail: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "v2",
      title: "Bunkai Aplicado de Pinan Nidan",
      desc: "Aplicación práctica para la defensa personal de las técnicas de golpe y bloqueo contenidas en Pinan Nidan.",
      duration: "07:45",
      instructor: "Sensei Carlos Martínez",
      level: "Intermedios",
      thumbnail: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "v3",
      title: "Tácticas de Kumite WKF: Kizami Zuki",
      desc: "Perfecciona la velocidad y el alcance del golpe de puño adelantado en combate deportivo con reglamento oficial.",
      duration: "04:30",
      instructor: "Sempai Carlos Ruiz",
      level: "Avanzados",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "v4",
      title: "Kihon: Posición Moto Dachi y Zenkutsu Dachi",
      desc: "Estudio biomecánico de las bases fundamentales del estilo Shito-Ryu. Estabilidad del centro de gravedad.",
      duration: "03:55",
      instructor: "Sempai Carlos Ruiz",
      level: "Todos los niveles",
      thumbnail: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "v5",
      title: "Kata Seienchin - Ritmo y Respiración Ibuki",
      desc: "Detalle técnico del kata Seienchin. Enfoque en posiciones de Shiko Dachi y tracciones de fuerza muscular.",
      duration: "09:20",
      instructor: "Sensei Carlos Martínez",
      level: "Cintas Negras",
      thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: "v6",
      title: "Rutina de Flexibilidad y Patadas Altas",
      desc: "Ejercicios dinámicos de elasticidad para incrementar la velocidad y la altura de patadas como Mawashi Geri.",
      duration: "06:15",
      instructor: "Sempai Carlos Ruiz",
      level: "Preparación Física",
      thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    }
  ];

  // Simulate progress when video plays
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleOpenVideo = (video: TrainingVideo) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
    setIsPlaying(true);
    setPlayProgress(0);
  };

  const handleCloseVideo = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 style={{ background: 'linear-gradient(90deg, var(--brand-red), var(--brand-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Videos Cortos de Entrenamiento
          </h1>
          <p>Entrenamiento técnico entre semana exclusivo para karatekas registrados.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--success)', fontWeight: 'bold' }}>
          <Lock size={14} /> Acceso Premium Habilitado
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className={styles.grid}>
        {videos.map((vid) => (
          <div key={vid.id} className={styles.videoCard} onClick={() => handleOpenVideo(vid)}>
            <div className={styles.thumbnailContainer}>
              <img src={vid.thumbnail} alt={vid.title} className={styles.thumbnailImg} />
              <div className={styles.playIconWrapper}>
                <Play size={20} fill="#FFF" color="#FFF" style={{ marginLeft: '2px' }} />
              </div>
              <span className={styles.durationTag}>{vid.duration}</span>
            </div>
            
            <div className={styles.meta}>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--brand-red)', letterSpacing: '1px' }}>
                {vid.level}
              </span>
              <h3>{vid.title}</h3>
              <p>{vid.desc.substring(0, 85)}...</p>
              
              <div className={styles.metaFooter}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={12} /> {vid.instructor}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {vid.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Video Player Overlay */}
      {isPlayerOpen && selectedVideo && (
        <div className={styles.modalOverlay}>
          <div className={styles.playerCard}>
            <div className={styles.playerHeader}>
              <h2>{selectedVideo.title}</h2>
              <button onClick={handleCloseVideo} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.videoWrapper}>
              {/* Media Player Visual Casing */}
              <div className={styles.videoPlaceholder}>
                <Video size={48} className={isPlaying ? "animate-pulse" : ""} style={{ color: 'var(--brand-red)' }} />
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {isPlaying ? "Reproduciendo entrenamiento..." : "Video pausado"}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Instructor: {selectedVideo.instructor} | Nivel: {selectedVideo.level}
                  </p>
                </div>
              </div>

              {/* Player control HUD */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10 }}>
                {/* Timeline progress bar */}
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}>
                  <div style={{ width: `${playProgress}%`, height: '100%', background: 'var(--brand-red)', borderRadius: '2px', transition: 'width 0.1s linear' }}></div>
                </div>
                
                {/* HUD Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => setIsPlaying(!isPlaying)} style={{ color: 'white', cursor: 'pointer' }}>
                      {isPlaying ? (
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>PAUSE</span>
                      ) : (
                        <Play size={16} fill="#FFF" />
                      )}
                    </button>
                    <span style={{ fontSize: '0.75rem', color: '#ccc' }}>
                      {Math.floor((playProgress / 100) * 5)}:00 / {selectedVideo.duration}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ccc' }}>
                    <Volume2 size={16} />
                    <Maximize2 size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {selectedVideo.desc}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
