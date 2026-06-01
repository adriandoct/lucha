"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  QrCode, 
  MessageSquare, 
  LayoutDashboard, 
  Database, 
  WifiOff, 
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  CheckCircle2,
  Tv,
  GraduationCap,
  Sparkles
} from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    },
    { 
      icon: <WifiOff />, 
      title: "Modo Offline local", 
      desc: "Registra entradas y salidas incluso si el Dojo pierde conexión a internet. Los datos se sincronizan al volver a estar online.", 
      color: "#8B5CF6", 
      level: "Resiliencia Digital" 
    },
    { 
      icon: <ShieldAlert />, 
      title: "Antiduplicados e IA", 
      desc: "Detección inteligente de accesos repetidos en lapsos cortos y alertas ante escaneos sospechosos o credenciales inválidas.", 
      color: "#E11D48", 
      level: "Seguridad Dojo" 
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
      name: "Trimestre Dojoia",
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
        "Todos los beneficios de Trimestre Dojoia",
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
          <div className={styles.logo}>
            <span>DOJOIA</span><span style={{ color: 'var(--brand-red)' }}>ACCESS</span>
          </div>
          <nav className={styles.nav}>
            <Link href="#como-funciona" className={styles.navLink}>Metodología</Link>
            <Link href="#funciones" className={styles.navLink}>Funciones</Link>
            <Link href="#planes" className={styles.navLink}>Tarifas</Link>
          </nav>
          <div className={styles.nav}>
            <Link href="/login" className={styles.btnSecondary}>Iniciar Sesión</Link>
            <Link href="/register" className={styles.btnPrimary} style={{ background: 'var(--brand-red)' }}>Registrarse</Link>
          </div>
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
            <div className={styles.philLogo}>
              SHITO<span style={{color: 'var(--brand-red)'}}>RYU</span>
            </div>
          </div>
          
          <div className={styles.philContent}>
            <h2>Filosofía Marcial + <span style={{ color: 'var(--brand-accent)' }}>Control Digital</span></h2>
            <p>
              El estilo Shito-Ryu une fuerza física y paz mental. DOJOIA ACCESS une la disciplina tradicional 
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
              <div className={styles.footerLogo}>
                <span>DOJOIA</span><span style={{ color: 'var(--brand-red)' }}>ACCESS</span>
              </div>
              <p>Tecnología y tradición unidas para el control inteligente de asistencia marcial.</p>
            </div>
            
            <div className={styles.footerCol}>
              <h4>Dojoia Access</h4>
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
            <p>&copy; {new Date().getFullYear()} DOJOIA ACCESS Shito-Ryu. Todos los derechos reservados.</p>
            <p>Oss! 🥋</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
