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
      name: "Dojo Básico",
      price: "$39",
      desc: "Perfecto para academias pequeñas que inician su digitalización.",
      features: [
        "Hasta 50 Karatekas",
        "Registro de asistencias con QR",
        "Dashboard con estadísticas",
        "Exportación a Excel / PDF",
        "Soporte estándar"
      ],
      popular: false
    },
    {
      name: "Dojo Profesional",
      price: "$89",
      desc: "La experiencia completa con notificaciones automáticas.",
      features: [
        "Hasta 200 Karatekas",
        "Registro QR + Soporte Offline",
        "Envío de WhatsApp Automático",
        "Importador Excel/CSV Dinámico",
        "Simulador de Chat Integrado",
        "Reportes mensuales automáticos"
      ],
      popular: true
    },
    {
      name: "Dojo Shito-Ryu Elite",
      price: "$179",
      desc: "Diseñado para franquicias, múltiples dojos o grandes academias.",
      features: [
        "Karatekas ilimitados",
        "Soporte multi-dojo/sucursales",
        "WhatsApp Business API Integrada",
        "Personalización de marca (Dogo White/Red)",
        "Soporte técnico preferente 24/7",
        "Integración con torniquetes mecánicos (próximamente)"
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
            <Link href="#planes" className={styles.navLink}>Planes</Link>
          </nav>
          <div className={styles.nav}>
            <Link href="/login" className={styles.btnSecondary}>Panel Administrativo</Link>
            <Link href="/register" className={styles.btnPrimary} style={{ background: 'var(--brand-red)' }}>Prueba Gratis</Link>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={`container ${styles.heroContent}`}>
          <div className={`${styles.heroText} animate-fade-in`}>
            <h1>Control Inteligente<br />para tu <span style={{ color: 'var(--brand-red)' }}>Dojo Shito-Ryu</span></h1>
            <p>
              Digitaliza la asistencia de tu academia de Karate Do. Escaneo QR en tiempo real, 
              alertas instantáneas a padres por WhatsApp y estadísticas automatizadas con el espíritu del Karate tradicional y tecnología del futuro.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/register" className={styles.btnPrimary} style={{ background: 'var(--brand-red)' }}>
                Registrar Academia <ChevronRight size={20} />
              </Link>
              <Link href="/login" className={styles.btnSecondary}>
                <PlayCircle size={20} className="mr-2" style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Ver Demo Panel
              </Link>
            </div>
          </div>
          
          <div className={`${styles.heroVisual} animate-float delay-200`}>
            <div className={styles.heroDecor1} style={{ background: 'var(--brand-red)' }}></div>
            <div className={styles.heroDecor2} style={{ background: 'var(--brand-accent)' }}></div>
            
            <div className={styles.heroCard}>
              <div className={styles.statsRow}>
                <div className={styles.stat}>
                  <div className={styles.statValue} style={{ color: 'var(--brand-red)' }}>🥋 Negro</div>
                  <div className={styles.statLabel}>Grado Máximo</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>142</div>
                  <div className={styles.statValue} style={{ fontSize: '0.8rem', color: 'var(--success)' }}>98.2% Presentes</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>Oss!</div>
                  <div className={styles.statLabel}>Filosofía</div>
                </div>
              </div>
              
              <div className={styles.aiCoach} style={{ background: 'rgba(225, 29, 72, 0.05)', borderColor: 'rgba(225, 29, 72, 0.2)' }}>
                <div className={styles.aiIcon} style={{ background: 'var(--brand-red)' }}>
                  <Sparkles size={24} color="#FFF" />
                </div>
                <div className={styles.aiText}>
                  <h4 style={{ color: 'var(--brand-red)' }}>Notificación WhatsApp:</h4>
                  <p style={{ fontStyle: 'italic' }}>
                    "Hola Adriana López. Le informamos que Mateo García López (Verde - 6° Kyu) ENTRÓ al entrenamiento a las 5:12 PM. ¡Oss!"
                  </p>
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
                  <h4>Escaneo Inteligente Kamiza</h4>
                  <p>Coloca una tablet o teléfono en el ingreso del Dojo y permite que los karatekas escaneen su QR de forma autónoma al saludar al Kamiza.</p>
                </div>
              </div>
              
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--brand-accent)' }}>
                  <GraduationCap size={24} />
                </div>
                <div className={styles.featureText}>
                  <h4>Monitoreo de Cinturones y Katas</h4>
                  <p>Filtra asistencias por nivel de cinturón y programa técnico, asegurando que tus competidores de Kata y Kumite tengan su asistencia al día para torneos.</p>
                </div>
              </div>
              
              <div className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div className={styles.featureText}>
                  <h4>Tranquilidad Familiar</h4>
                  <p>Los padres de familia reciben un mensaje instantáneo en su celular al iniciar y finalizar la clase, eliminando la incertidumbre del traslado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planes" className={styles.plans}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Optimiza tu <span style={{ color: 'var(--brand-red)' }}>Academia</span></h2>
            <p>Planes diseñados para adaptarse a la cantidad de tatamis y alumnos de tu Dojo.</p>
          </div>
          
          <div className={styles.plansGrid}>
            {plans.map((plan, i) => (
              <div key={i} className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`} style={{ borderColor: plan.popular ? 'var(--brand-red)' : 'var(--border-color)' }}>
                {plan.popular && <div className={styles.popularBadge} style={{ background: 'var(--brand-red)' }}>RECOMENDADO</div>}
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
                  Seleccionar Plan
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
                <li><Link href="#planes">Planes</Link></li>
              </ul>
            </div>
            
            <div className={styles.footerCol}>
              <h4>Recursos</h4>
              <ul>
                <li><Link href="/login">Panel Sensei</Link></li>
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
