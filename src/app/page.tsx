"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { 
  QrCode, 
  MessageSquare, 
  LayoutDashboard, 
  Database, 
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  CheckCircle2,
  Tv,
  GraduationCap,
  Sparkles,
  X
} from "lucide-react";
import styles from "./page.module.css";

// Helper function to extract YouTube ID and build embed URL
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1` 
    : null;
}

// Client-side helper to read cookies
const getCookie = (name: string): string => {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  return '';
};


export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [featuredVideo, setFeaturedVideo] = useState({
    titulo: "Presentación del Dojo Shito-Ryu",
    descripcion: "Una demostración de nuestra práctica habitual, que combina katas tradicionales con técnicas de combate y defensa personal adaptadas para todas las edades.",
    url: "https://vjs.zencdn.net/v/oceans.mp4",
    thumbnail: "/karate-hero.png",
    instructor: "Sensei Carlos Martínez",
    nivel: "Todos los niveles"
  });

  const [demoVideos, setDemoVideos] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setIsLoggedIn(!!getCookie("dojoia_email"));
  }, []);

  const handleSignOutClient = async () => {
    try {
      document.cookie = "dojoia_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "dojoia_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "dojoia_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      
      await fetch("/auth/signout", { method: "POST" });
      window.location.reload();
    } catch (e) {
      console.error("Error signing out", e);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const fetchHomepageVideo = async () => {
      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .eq("tipo", "inicio")
          .order("created_at", { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          const vid = data[0];
          setFeaturedVideo({
            titulo: vid.titulo,
            descripcion: vid.descripcion || "",
            url: vid.url,
            thumbnail: vid.thumbnail || "/karate-hero.png",
            instructor: vid.instructor || "Sensei Carlos Martínez",
            nivel: vid.nivel || "Todos los niveles"
          });
          localStorage.setItem("dojo_homepage_video", JSON.stringify(vid));
        } else {
          const cached = localStorage.getItem("dojo_homepage_video");
          if (cached) {
            const vid = JSON.parse(cached);
            setFeaturedVideo({
              titulo: vid.titulo,
              descripcion: vid.descripcion || "",
              url: vid.url,
              thumbnail: vid.thumbnail || "/karate-hero.png",
              instructor: vid.instructor || "Sensei Carlos Martínez",
              nivel: vid.nivel || "Todos los niveles"
            });
          } else {
            const cachedVideos = localStorage.getItem("dojo_videos");
            if (cachedVideos) {
              const list = JSON.parse(cachedVideos);
              const homeVid = list.find((v: any) => v.tipo === 'inicio');
              if (homeVid) {
                setFeaturedVideo({
                  titulo: homeVid.titulo,
                  descripcion: homeVid.descripcion || "",
                  url: homeVid.url,
                  thumbnail: homeVid.thumbnail || "/karate-hero.png",
                  instructor: homeVid.instructor || "Sensei Carlos Martínez",
                  nivel: homeVid.nivel || "Todos los niveles"
                });
              }
            }
          }
        }
      } catch (err) {
        console.warn("Error fetching homepage video, checking localStorage fallback", err);
        const cached = localStorage.getItem("dojo_homepage_video");
        if (cached) {
          const vid = JSON.parse(cached);
          setFeaturedVideo({
            titulo: vid.titulo,
            descripcion: vid.descripcion || "",
            url: vid.url,
            thumbnail: vid.thumbnail || "/karate-hero.png",
            instructor: vid.instructor || "Sensei Carlos Martínez",
            nivel: vid.nivel || "Todos los niveles"
          });
        }
      }
    };

    const fetchDemoVideos = async () => {
      try {
        let dbVideos: any[] = [];
        try {
          const { data, error } = await supabase
            .from("videos")
            .select("*")
            .eq("tipo", "entrenamiento")
            .order("created_at", { ascending: false });

          if (!error && data) {
            dbVideos = data;
          }
        } catch (dbErr) {
          console.warn("Database fetch for training videos failed, using fallback", dbErr);
        }

        let localVideos: any[] = [];
        const cached = typeof window !== 'undefined' ? localStorage.getItem("dojo_videos") : null;
        if (cached) {
          try {
            localVideos = JSON.parse(cached).filter((v: any) => v.tipo === "entrenamiento");
          } catch (e) {
            console.error("Parsing cached videos failed", e);
          }
        }

        const defaults = [
          {
            id: "v1",
            titulo: "Pinan Shodan - Kata Completo y Detalles",
            descripcion: "Guía paso a paso del primer kata de la serie Pinan. Posiciones de cadera, Zenkutsu Dachi y bloqueos altos.",
            duracion: "05:12",
            instructor: "Sensei Carlos Martínez",
            nivel: "Principiantes",
            url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            tipo: "entrenamiento",
            thumbnail: "/karate-kata.png"
          },
          {
            id: "v2",
            titulo: "Bunkai Aplicado de Pinan Nidan",
            descripcion: "Aplicación práctica para la defensa personal de las técnicas de golpe y bloqueo contenidas en Pinan Nidan.",
            duracion: "07:45",
            instructor: "Sensei Carlos Martínez",
            nivel: "Intermedios",
            url: "https://vjs.zencdn.net/v/oceans.mp4",
            tipo: "entrenamiento",
            thumbnail: "/karate-hero.png"
          },
          {
            id: "v3",
            titulo: "Tácticas de Kumite WKF: Kizami Zuki",
            descripcion: "Perfecciona la velocidad y el alcance del golpe de puño adelantado en combate deportivo con reglamento oficial.",
            duracion: "04:30",
            instructor: "Sempai Carlos Ruiz",
            nivel: "Avanzados",
            url: "https://www.w3schools.com/html/movie.mp4",
            tipo: "entrenamiento",
            thumbnail: "/karate-kumite.png"
          }
        ];

        const merged: any[] = [...dbVideos];

        const isDuplicate = (vid: any, list: any[]) => {
          return list.some((item) => item.id === vid.id || item.titulo.toLowerCase() === vid.titulo.toLowerCase());
        };

        localVideos.forEach((lv) => {
          if (!isDuplicate(lv, merged)) {
            merged.push(lv);
          }
        });

        defaults.forEach((dv) => {
          if (!isDuplicate(dv, merged)) {
            merged.push(dv);
          }
        });

        setDemoVideos(merged);
      } catch (err) {
        console.warn("Error loading training videos for demo", err);
      }
    };

    fetchHomepageVideo();
    fetchDemoVideos();
  }, []);

  const handleOpenDemoVideo = (vid: any) => {
    setSelectedVideo(vid);
    setIsPlayerOpen(true);
    setShowTeaser(false);
    setVideoError(false);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.currentTime >= 30) { // Limit to 30 seconds
      video.pause();
      setShowTeaser(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let timer: any;
    if (isPlayerOpen && selectedVideo && getYouTubeEmbedUrl(selectedVideo.url)) {
      timer = setTimeout(() => {
        setShowTeaser(true);
      }, 30000); // 30 seconds
    }
    return () => clearTimeout(timer);
  }, [isPlayerOpen, selectedVideo]);

  const slides = [
    {
      src: "/karate-hero.png",
      tag: "🥋 Shito-Ryu Do",
      title: "Shito-Ryu Do",
      desc: "Entrenamiento de Katas tradicionales, Bunkai práctico y Kumite de competencia olímpica WKF."
    },
    {
      src: "/karate-kata.png",
      tag: "🥋 Katas Tradicionales",
      title: "Katas Tradicionales",
      desc: "Perfecciona formas clásicas de Shito-Ryu como Pinan, Anan y Seienchin con precisión técnica y marcialidad."
    },
    {
      src: "/karate-kumite.png",
      tag: "🥋 Kumite Olímpico",
      title: "Kumite Olímpico",
      desc: "Desarrolla velocidad, reflejos y tácticas de combate deportivo WKF bajo el monitoreo y cuidado de la academia."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const features = [
    { 
      icon: <QrCode />, 
      title: "Credenciales Digitales QR", 
      desc: "Generación automática de códigos QR únicos para cada karateka, listos para imprimir o llevar en celular.", 
      color: "#E11D48", 
      level: "Control de Acceso" 
    },
    { 
      icon: <MessageSquare />, 
      title: "WhatsApp Automatizado", 
      desc: "Envío instantáneo de notificaciones de Entrada/Salida a tutores indicando hora y fecha exacta con cortesía 'Oss'.", 
      color: "#10B981", 
      level: "Seguridad y Enlace" 
    },
    { 
      icon: <LayoutDashboard />, 
      title: "Panel en Tiempo Real", 
      desc: "Dashboard moderno para el Sensei con estadísticas de presentes, ausentes y análisis de asistencia por cinturones.", 
      color: "#00F0FF", 
      level: "Métricas del Dojo" 
    },
    { 
      icon: <Database />, 
      title: "Importador Inteligente", 
      desc: "Sube tu hoja de cálculo (Excel o CSV) y registra toda tu nómina de alumnos con mapeo de columnas dinámico.", 
      color: "#FBBF24", 
      level: "Migración Fácil" 
    }
  ];

  const plans = [
    {
      name: "Mensualidad Regular",
      price: "$500 MXN",
      desc: "Ideal para entrenamiento constante y monitoreo automatizado.",
      features: [
        "Entrenamientos entre semana",
        "Clases los Fines de Semana (Katas especiales)",
        "Videos cortos de entrenamiento exclusivos",
        "Registro de asistencia con código QR",
        "Monitoreo de asistencia y rendimiento",
        "WhatsApp Chatbot interactivo"
      ],
      popular: true
    },
    {
      name: "Trimestre Raion Kay",
      price: "$1,400 MXN",
      desc: "Ahorra pagando un trimestre completo de preparación marcial.",
      features: [
        "Todos los beneficios de Mensualidad Regular",
        "Clases los fines de semana incluidas",
        "Acceso ilimitado a biblioteca de videos",
        "Prioridad en exámenes de graduación",
        "Ahorro de $100 pesos de cuota"
      ],
      popular: false
    },
    {
      name: "Semestre Shito-Ryu",
      price: "$2,700 MXN",
      desc: "Compromiso absoluto en el tatami para aspirantes a cinta negra.",
      features: [
        "Todos los beneficios de Trimestre Raion Kay",
        "Acceso ilimitado a biblioteca de videos",
        "Soporte preferencial para competencias",
        "Descuento en seminarios especiales",
        "Ahorro de $300 pesos de cuota"
      ],
      popular: false
    }
  ];

  return (
    <main className={styles.main}>
      <header className={styles.header} style={{ background: scrolled ? 'rgba(11, 14, 20, 0.95)' : 'transparent', borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/lion-kai-logo.png" alt="Raion Kay Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            <span className="logo-script" style={{ fontSize: '2.4rem', color: 'var(--text-primary)', textTransform: 'none' }}>
              Raion <span style={{ color: 'var(--brand-red)' }}>Kay</span>
            </span>
          </div>
          <nav className={styles.nav}>
            <Link href="#como-funciona" className={styles.navLink}>Metodología</Link>
            <Link href="#funciones" className={styles.navLink}>Funciones</Link>
            <Link href="#planes" className={styles.navLink}>Tarifas</Link>
          </nav>
          {isLoggedIn ? (
            <div className={styles.nav}>
              <Link href="/dashboard" className={styles.btnSecondary}>Ir al Panel</Link>
              <button 
                onClick={handleSignOutClient} 
                className={styles.btnPrimary} 
                style={{ background: 'var(--brand-red)', border: 'none', cursor: 'pointer', outline: 'none' }}
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className={styles.nav}>
              <Link href="/login" className={styles.btnSecondary}>Iniciar Sesión</Link>
              <Link href="/register" className={styles.btnPrimary} style={{ background: 'var(--brand-red)' }}>Registrarse</Link>
            </div>
          )}
        </div>
      </header>

      <section className={styles.hero} style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.heroBackground}></div>
        <div className={`container ${styles.heroContent}`}>
          <div className={`${styles.heroVisual} animate-fade-in`} style={{ width: '100%', maxWidth: '960px' }}>
            <div className={styles.heroDecor1} style={{ background: 'var(--brand-red)', filter: 'blur(60px)' }}></div>
            <div className={styles.heroDecor2} style={{ background: 'var(--brand-accent)', filter: 'blur(70px)' }}></div>
            
            <div className={styles.heroCard} style={{ padding: '0', overflow: 'hidden', border: '2px solid var(--brand-red)', background: 'var(--bg-secondary)', width: '100%', maxWidth: '960px', position: 'relative' }}>
              
              {/* Carousel Image Container (Cinematic Wide Aspect Ratio) */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', overflow: 'hidden', background: '#000' }}>
                {slides.map((slide, idx) => (
                  <img 
                    key={idx}
                    src={slide.src} 
                    alt={slide.title} 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'opacity 0.8s ease-in-out, transform 1.2s ease-in-out',
                      opacity: idx === currentSlide ? 1 : 0,
                      transform: idx === currentSlide ? 'scale(1.02)' : 'scale(1.0)',
                      zIndex: idx === currentSlide ? 2 : 1
                    }}
                  />
                ))}

                {/* Left/Right Arrows */}
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                  style={{
                    position: 'absolute',
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(6px)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-red)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                >
                  <ChevronLeft size={24} />
                </button>

                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(6px)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--brand-red)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                >
                  <ChevronRight size={24} />
                </button>

                {/* Indicators inside image */}
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 10
                }}>
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      style={{
                        width: idx === currentSlide ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: idx === currentSlide ? 'var(--brand-red)' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Slide Text Details & Wide CTA Layout */}
              <div style={{ padding: '1.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--brand-red)', fontSize: '1.3rem' }}>
                      {slides[currentSlide].tag}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 10px', borderRadius: '4px' }}>
                      $500 MXN / mes
                    </span>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {slides[currentSlide].desc}
                  </p>
                </div>
                
                {/* Embedded Wide CTA buttons */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link href="/register" className={styles.btnPrimary} style={{ background: 'var(--brand-red)', padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
                    Registrarse Ahora <ChevronRight size={18} />
                  </Link>
                  <Link href="/login" className={styles.btnSecondary} style={{ padding: '0.8rem 1.75rem', fontSize: '1rem' }}>
                    Probar Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: DOJO EN ACCIÓN (Video Destacado) */}
      <section className={styles.dojoVideoSection}>
        <div className="container">
          <div className={styles.videoSectionHeader}>
            <h2>NUESTRO DOJO EN <span style={{ color: 'var(--brand-red)' }}>ACCIÓN</span></h2>
            <p>Mira una demostración del entrenamiento de Karate en nuestro dojo. Disciplina, técnica y valores en cada movimiento.</p>
          </div>
          
          <div className={styles.videoPlayerContainer}>
            <div className={styles.videoPlayerWrapper}>
              {getYouTubeEmbedUrl(featuredVideo.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(featuredVideo.url) || undefined}
                  title={featuredVideo.titulo}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  src={featuredVideo.url} 
                  className={styles.homeVideoElement}
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={featuredVideo.thumbnail || "/karate-hero.png"}
                />
              )}
            </div>
            
            <div className={styles.videoInfoCard}>
              <div className={styles.videoBadge}>VIDEO PRESENTACIÓN</div>
              <h3>{featuredVideo.titulo}</h3>
              <p>{featuredVideo.descripcion}</p>
              {featuredVideo.instructor && (
                <div className={styles.videoMetaDetails}>
                  <span><strong>Instructor:</strong> {featuredVideo.instructor}</span>
                  {featuredVideo.nivel && <span><strong>Nivel:</strong> {featuredVideo.nivel}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: GALERÍA DE DEMOSTRACIÓN (Videos Cortos) */}
      <section className={styles.demoGallerySection}>
        <div className="container">
          <div className={styles.videoSectionHeader}>
            <h2>VIDEOS CORTOS DE <span style={{ color: 'var(--brand-red)' }}>ENTRENAMIENTO</span></h2>
            <p>
              Explora una muestra del contenido técnico exclusivo que estudian nuestros alumnos antes de asistir a la clase presencial.
            </p>
          </div>

          <div className={styles.demoGrid}>
            {demoVideos.slice(0, 3).map((vid) => (
              <div 
                key={vid.id} 
                className={styles.demoCard}
                onClick={() => handleOpenDemoVideo(vid)}
              >
                <div className={styles.demoThumbnailContainer}>
                  <img 
                    src={vid.thumbnail || "/karate-hero.png"} 
                    alt={vid.titulo} 
                    className={styles.demoThumbnail} 
                  />
                  <div className={styles.demoPlayIcon}>
                    <PlayCircle size={28} />
                  </div>
                  <span className={styles.demoDuration}>{vid.duracion}</span>
                </div>
                
                <div className={styles.demoMeta}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--brand-red)', letterSpacing: '1px' }}>
                    {vid.nivel}
                  </span>
                  <h3>{vid.titulo}</h3>
                  <p>{vid.descripcion?.substring(0, 85)}...</p>
                  
                  <div className={styles.demoMetaFooter}>
                    <span>Sensei Carlos M.</span>
                    <span style={{ color: '#FFB800', fontWeight: 'bold' }}>Vista previa libre (30 seg)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="funciones" className={styles.modules}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Gestión Avanzada con <span style={{ color: 'var(--brand-red)' }}>Disciplina</span></h2>
            <p>Tecnologías de punta integradas para garantizar la seguridad de los alumnos y la tranquilidad de sus tutores.</p>
          </div>
          
          <div className={styles.modulesGrid}>
            {features.map((feat, i) => (
              <div key={i} className={`${styles.moduleCard} animate-fade-in`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.moduleIcon} style={{ background: `${feat.color}15`, color: feat.color }}>
                  {feat.icon}
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
                <div className={styles.moduleLevel}>
                  <div className={styles.levelDot} style={{ background: feat.color }}></div>
                  {feat.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className={styles.philosophy}>
        <div className={`container ${styles.philGrid}`}>
          <div className={styles.philImage}>
            <div className={styles.philImageCircle} style={{ borderColor: 'rgba(225, 29, 72, 0.3)' }}></div>
            <div className={styles.philImageCircleInner} style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}></div>
            <div className={styles.philLogo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <img src="/lion-kai-logo.png" alt="Raion Kay Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', animation: 'pulse-glow 3s infinite' }} />
              <span className="logo-script" style={{ fontSize: '5.5rem', color: 'var(--dojo-white)', textTransform: 'none' }}>
                Raion <span style={{ color: 'var(--brand-red)' }}>Kay</span>
              </span>
            </div>
          </div>
          
          <div className={styles.philContent}>
            <h2>Filosofía Marcial + <span style={{ color: 'var(--brand-accent)' }}>Control Digital</span></h2>
            <p>
              El estilo Shito-Ryu une fuerza física y paz mental. Raion Kay une la disciplina tradicional 
              del saludo y la puntualidad con la velocidad y exactitud de las notificaciones móviles.
            </p>
            
            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ background: 'rgba(225, 29, 72, 0.1)', color: 'var(--brand-red)' }}>
                  <Tv size={24} />
                </div>
                <div className={styles.featureText}>
                  <h4>Videos Cortos entre Semana</h4>
                  <p>Accede a videos educativos grabados por el Sensei para perfeccionar técnicas fundamentales desde tu casa durante los días de semana.</p>
                </div>
              </div>
              
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--brand-accent)' }}>
                  <GraduationCap size={24} />
                </div>
                <div className={styles.featureText}>
                  <h4>Clases los Fines de Semana</h4>
                  <p>Sábados y Domingos de entrenamiento presencial dedicados al temario de Katas oficiales y Kumite libre competitivo.</p>
                </div>
              </div>
              
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div className={styles.featureText}>
                  <h4>Chatbot Inteligente en WhatsApp</h4>
                  <p>Monitoreo diario de asistencia y reportes de rendimiento técnico directo al celular del tutor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className={styles.plans}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Tarifas del <span style={{ color: 'var(--brand-red)' }}>Dojo</span></h2>
            <p>Planes diseñados con cobros transparentes en pesos mexicanos para tu membresía.</p>
          </div>
          
          <div className={styles.plansGrid}>
            {plans.map((plan, i) => (
              <div key={i} className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`} style={{ borderColor: plan.popular ? 'var(--brand-red)' : 'var(--border-color)' }}>
                {plan.popular && <div className={styles.popularBadge} style={{ background: 'var(--brand-red)' }}>MÁS POPULAR</div>}
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  {plan.price}<span>/mes</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                  {plan.desc}
                </p>
                <ul className={styles.planFeatures}>
                  {plan.features.map((feat, j) => (
                    <li key={j}>
                      <CheckCircle2 size={20} style={{ color: 'var(--brand-red)' }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={plan.popular ? styles.btnPrimary : styles.btnSecondary} style={{ background: plan.popular ? 'var(--brand-red)' : 'transparent', border: plan.popular ? 'none' : '1px solid var(--border-color)', textAlign: 'center' }}>
                  Comenzar Entrenamiento
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerLogo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="/lion-kai-logo.png" alt="Raion Kay Logo" style={{ width: '35px', height: '35px', objectFit: 'contain' }} />
                <span className="logo-script" style={{ fontSize: '2.1rem', color: 'var(--text-primary)', textTransform: 'none' }}>
                  Raion <span style={{ color: 'var(--brand-red)' }}>Kay</span>
                </span>
              </div>
              <p>Tecnología y tradición unidas para el control inteligente de asistencia marcial.</p>
            </div>
            
            <div className={styles.footerCol}>
              <h4>Raion Kay</h4>
              <ul>
                <li><Link href="#funciones">Funciones</Link></li>
                <li><Link href="#como-funciona">Metodología</Link></li>
                <li><Link href="#planes">Tarifas</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerCol}>
              <h4>Recursos</h4>
              <ul>
                <li><Link href="/login">Portal Sensei</Link></li>
                <li><Link href="/register">Registro Dojo</Link></li>
                <li><Link href="#">Soporte Técnico</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerCol}>
              <h4>Legal</h4>
              <ul>
                <li><Link href="#">Privacidad</Link></li>
                <li><Link href="#">Términos</Link></li>
              </ul>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Raion Kay Shito-Ryu. Todos los derechos reservados.</p>
            <p>Oss! 🥋</p>
          </div>
        </div>
      </footer>

      {/* Popup Video Player Overlay for Demo Teaser */}
      {isPlayerOpen && selectedVideo && (
        <div 
          className={styles.modalOverlay}
          onClick={(e) => { if (e.target === e.currentTarget) { setIsPlayerOpen(false); setSelectedVideo(null); setShowTeaser(false); } }}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.playerCard} style={{ cursor: 'default' }}>
            <div className={styles.playerHeader}>
              <h2>{selectedVideo.titulo} (Vista Previa)</h2>
              <button 
                onClick={() => { setIsPlayerOpen(false); setSelectedVideo(null); setShowTeaser(false); }}
                style={{ color: 'var(--dojo-white-dim)', cursor: 'pointer', border: 'none', background: 'transparent' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.videoWrapper}>
              {videoError ? (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', color: '#ff4d4d', zIndex: 5 }}>
                  <span style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</span>
                  <h4 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Error al cargar el video</h4>
                  <p style={{ fontSize: '0.85rem', color: '#ccc', maxWidth: '320px', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {selectedVideo.url.startsWith('blob:') 
                      ? 'Este video se guardó temporalmente en la memoria de tu navegador y ya expiró. Por favor, ejecuta el script SQL en Supabase y vuelve a subirlo.' 
                      : 'El enlace de este video no está disponible o el formato no es compatible.'}
                  </p>
                  {selectedVideo.url.startsWith('blob:') && (
                    <button 
                      onClick={async () => {
                        // 1. Delete from Supabase if it is a database ID
                        if (selectedVideo.id && !selectedVideo.id.startsWith("v_")) {
                          try {
                            await supabase.from("videos").delete().eq("id", selectedVideo.id);
                          } catch (err) {
                            console.error("Error deleting video from database:", err);
                          }
                        }

                        // 2. Delete from local storage
                        const cached = localStorage.getItem("dojo_videos");
                        if (cached) {
                          const list = JSON.parse(cached);
                          const updated = list.filter((v: any) => v.id !== selectedVideo.id);
                          localStorage.setItem("dojo_videos", JSON.stringify(updated));
                        }
                        setIsPlayerOpen(false);
                        setSelectedVideo(null);
                        alert("Video expirado removido con éxito. La página se actualizará.");
                        window.location.reload();
                      }}
                      className="btn-primary"
                      style={{ background: 'var(--brand-red)', fontSize: '0.85rem', padding: '0.5rem 1.25rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Eliminar Video Expirado
                    </button>
                  )}
                </div>
              ) : showTeaser ? null : getYouTubeEmbedUrl(selectedVideo.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideo.url) || undefined}
                  title={selectedVideo.titulo}
                  style={{ width: '100%', height: '100%', border: 'none', aspectRatio: '16/9' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  src={selectedVideo.url} 
                  autoPlay 
                  controls={!showTeaser}
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  onTimeUpdate={handleTimeUpdate}
                  onError={() => setVideoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                />
              )}

              {showTeaser && (
                <div className={styles.teaserOverlay}>
                  <div className={styles.teaserContent}>
                    <span className={styles.teaserBadge}>🥋 TEASER DE LA ACADEMIA PREMIUM</span>
                    <h3 className={styles.teaserTitle}>Límite de Vista Previa Alcanzado</h3>
                    <p className={styles.teaserText}>
                      Has visto los primeros 30 segundos de este video de entrenamiento. 
                      Para tener acceso ilimitado a toda la videoteca técnica, registrar asistencias por QR, recibir el recordatorio del sábado por WhatsApp y competir en el ranking, únete a nuestra Academia Premium.
                    </p>
                    <div className={styles.teaserButtons}>
                      <Link href="/register" className={styles.btnPrimary} style={{ background: 'var(--brand-red)' }}>
                        Registrarse Ahora <ChevronRight size={16} />
                      </Link>
                      <button 
                        onClick={() => { setIsPlayerOpen(false); setSelectedVideo(null); setShowTeaser(false); }}
                        className={styles.btnSecondary}
                      >
                        Cerrar Vista Previa
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '1.25rem 1.5rem', background: '#1a1f26', fontSize: '0.85rem', color: 'var(--dojo-white-dim)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p>{selectedVideo.descripcion}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', opacity: 0.8, flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span><strong>Instructor:</strong> {selectedVideo.instructor}</span>
                  <span><strong>Nivel:</strong> {selectedVideo.nivel}</span>
                </div>
                <button 
                  onClick={() => { setIsPlayerOpen(false); setSelectedVideo(null); setShowTeaser(false); }} 
                  className={styles.btnSecondary}
                  style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Cerrar Video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
