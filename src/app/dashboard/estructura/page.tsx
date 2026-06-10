"use client";

import { useState } from "react";
import styles from "./estructura.module.css";
import { 
  Calendar, 
  Award, 
  Clock, 
  BookOpen, 
  BookOpenCheck,
  User
} from "lucide-react";

interface Schedule {
  id: string;
  name: string;
  days: string;
  time: string;
  instructor: string;
  group: string;
}

interface BeltProgram {
  belt: string;
  kyu: string;
  colorHex: string;
  textColor: string;
  katas: string[];
  kumite: string[];
  requirements: string;
}

export default function EstructuraPage() {
  const [activeTab, setActiveTab] = useState<'horarios' | 'programa'>('horarios');

  const schedules: Schedule[] = [
    { id: "s1", name: "Infantil Principiantes (Lonas Blanca y Amarilla - Novatos)", days: "Lunes y Miércoles", time: "16:00 - 17:00", instructor: "Entrenador Carlos Ruiz", group: "Niños 5-10 años" },
    { id: "s2", name: "Infantil Intermedios (Lonas Naranja y Verde - Especiales)", days: "Lunes y Miércoles", time: "17:00 - 18:00", instructor: "Maestro Carlos Martínez", group: "Niños 8-12 años" },
    { id: "s3", name: "Juvenil y Adultos Avanzados (Lonas Azul a Negra - Semifinal, Estelar y Leyenda)", days: "Martes y Jueves", time: "18:00 - 19:30", instructor: "Maestro Carlos Martínez", group: "13 años en adelante" },
    { id: "s4", name: "Combate y Lucha Libre (Todos los niveles)", days: "Viernes", time: "17:00 - 19:00", instructor: "Maestro Carlos Martínez", group: "Selectivo de la Arena" },
    { id: "s5", name: "Clase de Llaves y Acrobacia (Fin de Semana)", days: "Sábados y Domingos", time: "10:00 - 12:00", instructor: "Maestro Carlos Martínez", group: "Todos los niveles (Entrenamiento Especial)" },
    { id: "s6", name: "Videos de Llaves y Sumisiones", days: "Entre Semana", time: "Disponible 24/7 (Online)", instructor: "Maestro AI / Chatbot", group: "Solo Luchadores Registrados" },
  ];

  const beltPrograms: BeltProgram[] = [
    { 
      belt: "Blanco", 
      kyu: "Lona Inicial (Novato)", 
      colorHex: "#FFFFFF", 
      textColor: "#1E293B", 
      katas: ["Rodada al frente", "Rodada hacia atrás", "Toma de Fuerza"], 
      kumite: ["Resistencia en lona (30s) y amarre"],
      requirements: "Caídas básicas (de espaldas, lateral), paradas técnicas, llave de candado simple y derribe de hombro."
    },
    { 
      belt: "Amarillo", 
      kyu: "Lona Básica (Preliminar)", 
      colorHex: "#FACC15", 
      textColor: "#000000", 
      katas: ["Tijeras al cuerpo", "Derribe de Bombero"], 
      kumite: ["Llaveo simple y escape de candado"],
      requirements: "Rodada de resorte, derribe de brazo, candado al cuello y sumisión de medio cangrejo."
    },
    { 
      belt: "Naranja", 
      kyu: "Lona Intermedia (Especial)", 
      colorHex: "#FB923C", 
      textColor: "#000000", 
      katas: ["Suplex de bandera", "Cruceta a las piernas"], 
      kumite: ["Combate semi-libre a ras de lona"],
      requirements: "Lanzamiento por encima del hombro, quebradora clásica y llave de tirabuzón básica."
    },
    { 
      belt: "Verde", 
      kyu: "Lona Avanzada (Semifinal)", 
      colorHex: "#22C55E", 
      textColor: "#FFFFFF", 
      katas: ["Palanca al brazo (Fujiwara)", "Tope suicida"], 
      kumite: ["Combate libre a ras de lona con conteo de 3"],
      requirements: "Resorte desde las cuerdas, salida de bandera, llave de a caballo (camello) y plancha simple."
    },
    { 
      belt: "Azul", 
      kyu: "Lona Profesional (Especial Avanzado)", 
      colorHex: "#3B82F6", 
      textColor: "#FFFFFF", 
      katas: ["Suplex Alemán", "Tijeras voladoras"], 
      kumite: ["Lucha a ras de lona avanzada"],
      requirements: "Dominio de lances fuera del ring, contrallave de tirabuzón y llave de la tapatía."
    },
    { 
      belt: "Marrón", 
      kyu: "Pre-Estelar (Estelar)", 
      colorHex: "#8B4513", 
      textColor: "#FFFFFF", 
      katas: ["Piledriver (Tombstone)", "La de a caballo (Completa)", "Huracarrana"], 
      kumite: ["Combate estelar libre (Lucha de exhibición)"],
      requirements: "Dominio absoluto de la lucha olímpica, llaves de rendición complejas y lances de alto riesgo."
    },
    { 
      belt: "Negro", 
      kyu: "Lona Leyenda (Leyenda)", 
      colorHex: "#0F1216", 
      textColor: "#E11D48", 
      katas: ["La campana clásica", "Estrella voladora", "Tapatía con puente", "Lanza con giro"], 
      kumite: ["Lucha de Campeonato (3 caídas)", "Arbitraje de lucha libre"],
      requirements: "Consagración profesional, mentoría de luchadores (Maestro), diseño de coreografías seguras de combate y llaves de autoría propia."
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Horarios y Temario Técnico</h1>
          <p>Planificación de entrenamientos y requisitos de evaluaciones Arena Raion.</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('horarios')}
          className="btn-secondary"
          style={{ 
            background: activeTab === 'horarios' ? 'var(--brand-red)' : 'transparent',
            border: activeTab === 'horarios' ? 'none' : '1px solid var(--border-color)',
            color: activeTab === 'horarios' ? 'white' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Calendar size={18} /> Horarios de Clases
        </button>
        <button 
          onClick={() => setActiveTab('programa')}
          className="btn-secondary"
          style={{ 
            background: activeTab === 'programa' ? 'var(--brand-red)' : 'transparent',
            border: activeTab === 'programa' ? 'none' : '1px solid var(--border-color)',
            color: activeTab === 'programa' ? 'white' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Award size={18} /> Temario de Rangos / Lonas
        </button>
      </div>

      {/* Content Rendering */}
      {activeTab === 'horarios' ? (
        <div className={styles.card} style={{ borderLeft: '4px solid var(--brand-red)' }}>
          <h2>
            <Clock size={20} style={{ color: 'var(--brand-red)' }} />
            Calendario Semanal de Entrenamientos
          </h2>
          
          <div className={styles.scheduleList}>
            {schedules.map((s) => (
              <div key={s.id} className={styles.scheduleItem}>
                <div className={styles.scheduleInfo}>
                  <h4>{s.name}</h4>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                    <User size={14} /> <strong>Instructor:</strong> {s.instructor}
                  </p>
                  <p>Grupo: {s.group}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={styles.scheduleTime}>{s.time}</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{s.days}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.card} style={{ borderLeft: '4px solid var(--brand-gold)' }}>
          <h2>
            <BookOpenCheck size={20} style={{ color: 'var(--brand-gold)' }} />
            Programa Oficial de Lonas y Categorías (Lucha Libre Arena Raion)
          </h2>
          
          <div className={styles.programList}>
            {beltPrograms.map((p, idx) => (
              <div key={idx} className={styles.programItem}>
                <div className={styles.programHeader}>
                  <span 
                    className="belt-badge" 
                    style={{ 
                      backgroundColor: p.colorHex, 
                      color: p.textColor, 
                      borderColor: '#475569',
                      fontSize: '0.9rem',
                      padding: '0.35rem 1rem'
                    }}
                  >
                    Lona {p.belt} ({p.kyu})
                  </span>
                </div>
                
                <div className={styles.programContent}>
                  <p style={{ marginBottom: '0.4rem' }}>
                    <strong>Llaves y Movimientos:</strong> {p.katas.join(" | ")}
                  </p>
                  <p style={{ marginBottom: '0.4rem' }}>
                    <strong>Combate en el Ring:</strong> {p.kumite.join(" | ")}
                  </p>
                  <p>
                    <strong>Fundamentos y Acrobacia:</strong> {p.requirements}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
