"use client";

import { useEffect, useState } from "react";
import styles from "../dashboard.module.css";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  ShieldAlert,
  Bell,
  Search,
  Brain,
  MessageCircle,
  FileText,
  UserCheck
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion, Variants } from 'framer-motion';
import { createClient } from "@/utils/supabase/client";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

interface Karateka {
  id: string;
  nombre: string;
  matricula: string;
  cinturon: string;
  grado: string;
}

interface Asistencia {
  id: string;
  tipo: string;
  hora: string;
  fecha: string;
  whatsapp_status: string;
  karatekas: {
    nombre: string;
    cinturon: string;
    grado: string;
  } | null;
}

export default function DashboardPage() {
  const [karatekas, setKaratekas] = useState<Karateka[]>([]);
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [beltChartData, setBeltChartData] = useState<any[]>([]);
  const [weeklyChartData, setWeeklyChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    presentes: 0,
    retardos: 0,
    alertas: 0
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Fetch Karatekas
        const { data: listKaratekas, error: kError } = await supabase
          .from("karatekas")
          .select("id, nombre, matricula, cinturon, grado")
          .eq("activo", true);

        // Fetch today's attendances
        const today = new Date().toISOString().split("T")[0];
        const { data: listAsistencias, error: aError } = await supabase
          .from("asistencias_karate")
          .select(`
            id, tipo, hora, fecha, whatsapp_status,
            karatekas(nombre, cinturon, grado)
          `)
          .order("created_at", { ascending: false });

        let finalKaratekas = listKaratekas || [];
        let finalAsistencias: any[] = listAsistencias || [];

        // FALLBACK MOCK DATA IF DATABASE IS EMPTY OR NOT CONNECTED
        if ((!listKaratekas || listKaratekas.length === 0) || kError) {
          console.log("Using fallback mock data for dashboard");
          finalKaratekas = [
            { id: "1", nombre: "Mateo García López", matricula: "KA-2026-001", cinturon: "verde", grado: "6° Kyu" },
            { id: "2", nombre: "Sofía Martínez Ruiz", matricula: "KA-2026-002", cinturon: "amarillo", grado: "8° Kyu" },
            { id: "3", nombre: "Diego Fernández Silva", matricula: "KA-2026-003", cinturon: "negro", grado: "1° Dan" },
            { id: "4", nombre: "Valentina Ruiz Castro", matricula: "KA-2026-004", cinturon: "azul", grado: "5° Kyu" },
            { id: "5", nombre: "Lucas Torres Mendoza", matricula: "KA-2026-005", cinturon: "marron", grado: "2° Kyu" }
          ];

          finalAsistencias = [
            {
              id: "a1",
              tipo: "entrada",
              hora: "17:12:00",
              fecha: today,
              whatsapp_status: "simulated",
              karatekas: { nombre: "Mateo García López", cinturon: "verde", grado: "6° Kyu" }
            },
            {
              id: "a2",
              tipo: "entrada",
              hora: "17:15:00",
              fecha: today,
              whatsapp_status: "simulated",
              karatekas: { nombre: "Sofía Martínez Ruiz", cinturon: "amarillo", grado: "8° Kyu" }
            },
            {
              id: "a3",
              tipo: "entrada",
              hora: "17:35:00",
              fecha: today,
              whatsapp_status: "simulated",
              karatekas: { nombre: "Lucas Torres Mendoza", cinturon: "marron", grado: "2° Kyu" }
            },
            {
              id: "a4",
              tipo: "salida",
              hora: "18:45:00",
              fecha: today,
              whatsapp_status: "simulated",
              karatekas: { nombre: "Sofía Martínez Ruiz", cinturon: "amarillo", grado: "8° Kyu" }
            }
          ];
        }

        setKaratekas(finalKaratekas);
        setAsistencias(finalAsistencias);

        // Calculate statistics
        const total = finalKaratekas.length;
        // Filter unique attendees today
        const uniqueToday = new Set();
        let retardosCount = 0;
        let alertCount = 0;

        finalAsistencias.forEach(a => {
          if (a.fecha === today) {
            uniqueToday.add(a.karatekas?.nombre);
            // Simulate late access (retardo) if entry is after 5:15 PM (17:15)
            if (a.tipo === "entrada") {
              const timeParts = a.hora.split(":");
              const hours = parseInt(timeParts[0]);
              const minutes = parseInt(timeParts[1]);
              if (hours > 17 || (hours === 17 && minutes > 15)) {
                retardosCount++;
              }
            }
          }
          if (a.whatsapp_status === "error") {
            alertCount++;
          }
        });

        setStats({
          total,
          presentes: uniqueToday.size,
          retardos: retardosCount,
          alertas: alertCount
        });

        // Belt Distribution calculations
        const belts: Record<string, number> = {
          blanco: 0,
          amarillo: 0,
          naranja: 0,
          verde: 0,
          azul: 0,
          marron: 0,
          negro: 0
        };

        finalKaratekas.forEach((k: any) => {
          const b = k.cinturon.toLowerCase();
          if (b in belts) belts[b]++;
        });

        setBeltChartData([
          { name: 'Blanco', value: belts.blanco, fill: '#CBD5E1' },
          { name: 'Amarillo', value: belts.amarillo, fill: '#FACC15' },
          { name: 'Naranja', value: belts.naranja, fill: '#FB923C' },
          { name: 'Verde', value: belts.verde, fill: '#22C55E' },
          { name: 'Azul', value: belts.azul, fill: '#3B82F6' },
          { name: 'Marrón', value: belts.marron, fill: '#8B4513' },
          { name: 'Negro', value: belts.negro, fill: '#1E293B' },
        ]);

        // Weekly attendance mock trend
        setWeeklyChartData([
          { name: 'Lun', presentes: 12, retardos: 2, ausentes: 1 },
          { name: 'Mar', presentes: 15, retardos: 1, ausentes: 0 },
          { name: 'Mié', presentes: 11, retardos: 4, ausentes: 2 },
          { name: 'Jue', presentes: 14, retardos: 2, ausentes: 1 },
          { name: 'Vie', presentes: 18, retardos: 3, ausentes: 0 },
        ]);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const getBeltColor = (belt: string) => {
    switch (belt?.toLowerCase()) {
      case "blanco": return styles.beltBlanco;
      case "amarillo": return styles.beltAmarillo;
      case "naranja": return styles.beltNaranja;
      case "verde": return styles.beltVerde;
      case "azul": return styles.beltAzul;
      case "marron": return styles.beltMarron;
      case "negro": return styles.beltNegro;
      default: return "";
    }
  };

  return (
    <motion.div 
      className="animate-fade-in"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className={styles.topbar}>
        <div className={styles.greeting}>
          <h1>Resumen del Dojo</h1>
          <p>Control de acceso escolar y estado del tatami en tiempo real.</p>
        </div>
        
        <div className={styles.topActions}>
          <div className={styles.actionBtn}>
            <Search size={20} />
          </div>
          <div className={styles.actionBtn}>
            <Bell size={20} />
          </div>
          <button className="btn-primary" style={{ background: 'var(--brand-red)' }} onClick={() => window.print()}>
            Exportar Ficha
          </button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div variants={itemVariants} className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Karatekas Activos</span>
            <div className={`${styles.metricIcon} ${styles.blue}`}>
              <Users size={24} color="var(--brand-red)" />
            </div>
          </div>
          <div className={styles.metricValue}>{stats.total}</div>
          <div className={`${styles.metricTrend} ${styles.up}`}>
            <TrendingUp size={16} />
            <span>Nómina oficial del Dojo</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Entrenando Hoy</span>
            <div className={`${styles.metricIcon} ${styles.green}`}>
              <UserCheck size={24} color="#10B981" />
            </div>
          </div>
          <div className={styles.metricValue}>{stats.presentes}</div>
          <div className={`${styles.metricTrend} ${styles.up}`}>
            <TrendingUp size={16} />
            <span>Activos en el tatami</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Retardos Hoy</span>
            <div className={`${styles.metricIcon} ${styles.gold}`}>
              <Clock size={24} color="#FBBF24" />
            </div>
          </div>
          <div className={styles.metricValue}>{stats.retardos}</div>
          <div className={`${styles.metricTrend} ${styles.down}`}>
            <span>Ingresos después del saludo</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Alertas WhatsApp</span>
            <div className={`${styles.metricIcon} ${styles.red}`}>
              <ShieldAlert size={24} color="#EF4444" />
            </div>
          </div>
          <div className={styles.metricValue}>{stats.alertas}</div>
          <div className={`${styles.metricTrend} ${styles.down}`}>
            <span>Errores de red en envíos</span>
          </div>
        </div>
      </motion.div>

      {/* Charts Panels */}
      <motion.div variants={itemVariants} className={styles.panelsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Asistencias de la Semana</h3>
          </div>
          <div className={styles.chartContainer} style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPresentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-red)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--brand-red)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="presentes" stroke="var(--brand-red)" strokeWidth={3} fillOpacity={1} fill="url(#colorPresentes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Distribución de Cinturones</h3>
          </div>
          <div className={styles.chartContainer} style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={beltChartData.filter(d => d.value > 0)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary)'}} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  cursor={{fill: 'var(--bg-tertiary)'}}
                />
                <Bar dataKey="value" name="Alumnos" radius={[4, 4, 0, 0]}>
                  {beltChartData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="#475569" strokeWidth={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* AI Assistant and Activity */}
      <motion.div variants={itemVariants} className={styles.panelsGrid}>
        <div className={styles.aiExecutiveWidget} style={{ borderLeft: '4px solid var(--brand-red)' }}>
          <div className={styles.aiWidgetHeader}>
            <Brain size={24} style={{ color: 'var(--brand-red)' }} />
            <span style={{ fontWeight: 600 }}>AI Sensei Coach</span>
          </div>
          <div className={styles.aiWidgetContent}>
            <p style={{ lineHeight: '1.5', fontSize: '0.95rem' }}>
              Oss, Sensei. Hoy la asistencia se mantiene alta en un 94%. He notado que el grupo de <strong>Cinturones Naranjas</strong> ha acumulado 3 retardos esta semana. Te sugiero reforzar el valor de la puntualidad (Reigi) al inicio de la sesión.
            </p>
          </div>
          <button className={styles.aiWidgetBtn} style={{ background: 'var(--brand-red-light)', color: 'var(--brand-red)' }}>
            Ver Recomendaciones Técnicas
          </button>
        </div>

        <div className={styles.chartCard} style={{ padding: '1.5rem' }}>
          <div className={styles.cardHeader}>
            <h3>Asistencias Recientes</h3>
          </div>
          <div className={styles.activityList}>
            {asistencias.slice(0, 3).map((a, i) => (
              <div key={a.id || i} className={styles.activityItem}>
                <div className={styles.activityIcon} style={{ 
                  background: a.tipo === 'entrada' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                  color: a.tipo === 'entrada' ? '#10B981' : '#EF4444' 
                }}>
                  <UserCheck size={20} />
                </div>
                <div className={styles.activityDetails}>
                  <h4>{a.karatekas?.nombre} ({a.karatekas?.grado})</h4>
                  <p>
                    {a.tipo === 'entrada' ? 'Entrada registrada' : 'Salida registrada'} • {a.hora.substring(0, 5)} 
                    {a.whatsapp_status === 'sent' || a.whatsapp_status === 'simulated' ? (
                      <span style={{ color: '#10B981', marginLeft: '8px' }}>💬 WhatsApp enviado</span>
                    ) : a.whatsapp_status === 'error' ? (
                      <span style={{ color: '#EF4444', marginLeft: '8px' }}>⚠️ Falla WhatsApp</span>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)', marginLeft: '8px' }}>💬 Pendiente</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            {asistencias.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No hay registros el día de hoy.</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
