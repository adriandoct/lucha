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
    { id: "s1", name: "Infantil Principiantes (Cintas Blancas y Amarillas)", days: "Lunes y Miércoles", time: "16:00 - 17:00", instructor: "Sempai Carlos Ruiz", group: "Niños 5-10 años" },
    { id: "s2", name: "Infantil Intermedios (Cintas Naranjas y Verdes)", days: "Lunes y Miércoles", time: "17:00 - 18:00", instructor: "Sensei Carlos Martínez", group: "Niños 8-12 años" },
    { id: "s3", name: "Juvenil y Adultos Avanzados (Cintas Azules a Negras)", days: "Martes y Jueves", time: "18:00 - 19:30", instructor: "Sensei Carlos Martínez", group: "13 años en adelante" },
    { id: "s4", name: "Kumite Competitivo (Todos los niveles)", days: "Viernes", time: "17:00 - 19:00", instructor: "Sensei Carlos Martínez", group: "Selectivo del Dojo" },
    { id: "s5", name: "Clase Especial de Cinturones Negros y Katas Avanzados", days: "Sábado", time: "09:00 - 11:00", instructor: "Sensei Carlos Martínez", group: "Avanzados / Profesores" },
  ];

  const beltPrograms: BeltProgram[] = [
    { 
      belt: "Blanco", 
      kyu: "10° y 9° Kyu", 
      colorHex: "#FFFFFF", 
      textColor: "#1E293B", 
      katas: ["Kihon Kata I", "Kihon Kata II", "Pinan Nidan (Koryu)"], 
      kumite: ["Gohon Kumite (Ataque/Defensa a 5 pasos)"],
      requirements: "Posiciones básicas (Zenkutsu Dachi, Moto Dachi), defensas altas (Jodan Uke) y golpes directos (Oi Zuki)."
    },
    { 
      belt: "Amarillo", 
      kyu: "8° Kyu", 
      colorHex: "#FACC15", 
      textColor: "#000000", 
      katas: ["Pinan Shodan"], 
      kumite: ["Kihon Kumite I (Defensas básicas en contraataque)"],
      requirements: "Posición Kokutsu Dachi, golpes de tajo (Shuto Uke) y patadas frontales (Mae Geri)."
    },
    { 
      belt: "Naranja", 
      kyu: "7° Kyu", 
      colorHex: "#FB923C", 
      textColor: "#000000", 
      katas: ["Pinan Sandan"], 
      kumite: ["Kihon Kumite II"],
      requirements: "Defensa media (Uchi Uke), golpes de codo (Empi Uchi) y patada lateral (Yoko Geri)."
    },
    { 
      belt: "Verde", 
      kyu: "6° Kyu", 
      colorHex: "#22C55E", 
      textColor: "#FFFFFF", 
      katas: ["Pinan Yondan"], 
      kumite: ["Jiyu Ippon Kumite (Combate semi-libre a un paso)"],
      requirements: "Patada semicircular (Mawashi Geri), barridos ligeros y defensa a mano abierta."
    },
    { 
      belt: "Azul", 
      kyu: "5° Kyu", 
      colorHex: "#3B82F6", 
      textColor: "#FFFFFF", 
      katas: ["Pinan Godan"], 
      kumite: ["Jiyu Ippon Kumite Avanzado"],
      requirements: "Esquivas laterales (Sabaki), contragolpes fluidos y combinación de patadas."
    },
    { 
      belt: "Marrón", 
      kyu: "4° a 1° Kyu", 
      colorHex: "#8B4513", 
      textColor: "#FFFFFF", 
      katas: ["Bassai Dai", "Kosokun Dai", "Seienchin"], 
      kumite: ["Jiyu Kumite (Combate libre de práctica)"],
      requirements: "Dominio absoluto del Kihon general, Katas Shitei oficiales y velocidad en combate libre."
    },
    { 
      belt: "Negro", 
      kyu: "1° Dan en adelante", 
      colorHex: "#0F1216", 
      textColor: "#E11D48", 
      katas: ["Nipaipo", "Tensho", "Suparinpei", "Kuru runfa"], 
      kumite: ["Combate de Competencia WKF", "Arbitraje oficial"],
      requirements: "Madurez marcial, liderazgo de clases (Sensei/Sempai), examen de tesis marcial y Katas superiores."
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Horarios y Programa Técnico</h1>
          <p>Planificación de entrenamientos y requisitos de exámenes Shito-Ryu.</p>
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
          <Award size={18} /> Temario de Cinturones
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
            Programa Oficial de Cintas (Shito-Ryu Karate Do)
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
                    Cinturón {p.belt} ({p.kyu})
                  </span>
                </div>
                
                <div className={styles.programContent}>
                  <p style={{ marginBottom: '0.4rem' }}>
                    <strong>Katas Requeridos:</strong> {p.katas.join(" | ")}
                  </p>
                  <p style={{ marginBottom: '0.4rem' }}>
                    <strong>Kumite (Defensa y Combate):</strong> {p.kumite.join(" | ")}
                  </p>
                  <p>
                    <strong>Fundamentos Técnicos:</strong> {p.requirements}
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
