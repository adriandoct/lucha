"use client";

import { useEffect, useState } from "react";
import styles from "./settings.module.css";
import { 
  Settings, 
  MessageSquare, 
  Shield, 
  Smartphone,
  Save,
  RefreshCw,
  Info
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface DojoConfig {
  id?: string;
  dojo_name: string;
  sensei_principal: string;
  estilo: string;
  whatsapp_provider: 'mock' | 'meta' | 'twilio';
  whatsapp_token: string;
  whatsapp_phone_number_id: string;
  template_entrada: string;
  template_salida: string;
}

interface SimulatedMessage {
  id: string;
  tutor: string;
  telefono: string;
  nombre: string;
  message: string;
  timestamp: string;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<DojoConfig>({
    dojo_name: "Lion Kai",
    sensei_principal: "Sensei Carlos Martínez",
    estilo: "Shito-Ryu",
    whatsapp_provider: "mock",
    whatsapp_token: "",
    whatsapp_phone_number_id: "",
    template_entrada: "🥋 *{dojo_name}*\n\nHola *{tutor}*,\n\nLe informamos que el karateka:\n👦 *{nombre}* ({cinturon} - {grado})\n\n✅ *ENTRÓ* a entrenar.\n\n🕒 Hora: {hora}\n📅 Fecha: {fecha}\n\n🥋 ¡Oss!",
    template_salida: "🥋 *{dojo_name}*\n\nHola *{tutor}*,\n\nLe informamos que el karateka:\n👦 *{nombre}* ({cinturon} - {grado})\n\n✅ *SALIÓ* del Dojo.\n\n🕒 Hora: {hora}\n📅 Fecha: {fecha}\n\n🥋 ¡Oss!"
  });

  const [simulatedMessages, setSimulatedMessages] = useState<SimulatedMessage[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  // Load configuration and message history
  const loadConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("configuracion_dojo")
        .select("*")
        .limit(1);

      if (data && data.length > 0) {
        setConfig(data[0]);
        localStorage.setItem("dojo_config", JSON.stringify(data[0]));
      } else {
        const cached = localStorage.getItem("dojo_config");
        if (cached) {
          setConfig(JSON.parse(cached));
        } else {
          localStorage.setItem("dojo_config", JSON.stringify(config));
        }
      }
    } catch (e) {
      console.warn("Could not load database configuration. Using local storage.", e);
    } finally {
      setLoading(false);
    }
  };

  const loadSimulatedMessages = () => {
    const list = localStorage.getItem("simulated_whatsapp_messages");
    if (list) {
      setSimulatedMessages(JSON.parse(list));
    } else {
      setSimulatedMessages([
        {
          id: "m1",
          tutor: "Adriana López",
          telefono: "+5215512345678",
          nombre: "Mateo García López",
          message: "🥋 *Lion Kai*\n\nHola *Adriana López*,\n\nLe informamos que el karateka:\n👦 *Mateo García López* (VERDE - 6° Kyu)\n\n✅ *ENTRÓ* a entrenar.\n\n🕒 Hora: 17:12\n📅 Fecha: 2026-05-31\n\n🥋 ¡Oss!",
          timestamp: "17:12"
        }
      ]);
    }
  };

  useEffect(() => {
    loadConfig();
    loadSimulatedMessages();

    // Set up polling for simulated messages so scans are shown in real-time
    const interval = setInterval(loadSimulatedMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (key: keyof DojoConfig, val: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { data: check } = await supabase.from("configuracion_dojo").select("id").limit(1);
      
      if (check && check.length > 0) {
        // Update
        await supabase
          .from("configuracion_dojo")
          .update(config)
          .eq("id", check[0].id);
      } else {
        // Insert
        await supabase
          .from("configuracion_dojo")
          .insert(config);
      }

      localStorage.setItem("dojo_config", JSON.stringify(config));
      alert("Configuración guardada correctamente.");
    } catch (err) {
      console.error(err);
      localStorage.setItem("dojo_config", JSON.stringify(config));
      alert("Se guardó localmente en memoria.");
    } finally {
      setSaving(false);
    }
  };

  const clearChatHistory = () => {
    localStorage.removeItem("simulated_whatsapp_messages");
    setSimulatedMessages([]);
  };

  return (
    <div className={styles.container}>
      {/* Left side: Config fields */}
      <div className={styles.settingsPanel}>
        <div className={styles.card}>
          <h2>
            <Shield size={22} style={{ color: 'var(--brand-red)' }} />
            Perfil del Dojo
          </h2>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre del Dojo</label>
              <input 
                type="text" 
                className={styles.input} 
                value={config.dojo_name} 
                onChange={(e) => handleInputChange("dojo_name", e.target.value)} 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Estilo de Karate</label>
              <input 
                type="text" 
                className={styles.input} 
                value={config.estilo} 
                onChange={(e) => handleInputChange("estilo", e.target.value)} 
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Sensei Principal (Director/Administrador)</label>
              <input 
                type="text" 
                className={styles.input} 
                value={config.sensei_principal} 
                onChange={(e) => handleInputChange("sensei_principal", e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>
            <MessageSquare size={22} style={{ color: 'var(--brand-red)' }} />
            Configuración de WhatsApp API
          </h2>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Proveedor de Envío</label>
              <select 
                className={styles.selectInput}
                value={config.whatsapp_provider}
                onChange={(e) => handleInputChange("whatsapp_provider", e.target.value as any)}
              >
                <option value="mock">Simulador en Pantalla (Ideal para demos)</option>
                <option value="meta">Meta Cloud API (Oficial)</option>
                <option value="twilio">Twilio WhatsApp API</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ID del Número de Teléfono (Meta)</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="e.g. 1098273645271" 
                disabled={config.whatsapp_provider === 'mock'}
                value={config.whatsapp_phone_number_id}
                onChange={(e) => handleInputChange("whatsapp_phone_number_id", e.target.value)}
              />
            </div>

            <div className={styles.formGroupFull}>
              <label className={styles.label}>Token de Acceso / API Key</label>
              <input 
                type="password" 
                className={styles.input} 
                placeholder={config.whatsapp_provider === 'mock' ? "Bajo modo simulación (no requiere clave)" : "EAAGy..."}
                disabled={config.whatsapp_provider === 'mock'}
                value={config.whatsapp_token}
                onChange={(e) => handleInputChange("whatsapp_token", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>
            <Settings size={22} style={{ color: 'var(--brand-red)' }} />
            Plantillas de Mensajes
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Info size={14} /> Variables disponibles: <code>{"{dojo_name}, {nombre}, {cinturon}, {grado}, {tutor}, {hora}, {fecha}"}</code>
          </p>

          <div className={styles.formGroup}>
            <label className={styles.label}>Plantilla: Entrada del Alumno</label>
            <textarea 
              className={styles.textarea}
              value={config.template_entrada}
              onChange={(e) => handleInputChange("template_entrada", e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Plantilla: Salida del Alumno</label>
            <textarea 
              className={styles.textarea}
              value={config.template_salida}
              onChange={(e) => handleInputChange("template_salida", e.target.value)}
            />
          </div>

          <button 
            className="btn-primary" 
            style={{ background: 'var(--brand-red)', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
            disabled={saving}
            onClick={handleSave}
          >
            <Save size={18} /> {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>

      {/* Right side: Live Simulator Frame */}
      <div className={styles.simulatorWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '300px', alignItems: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem' }}>
            <Smartphone size={18} /> Celular del Tutor
          </h3>
          <button 
            onClick={clearChatHistory}
            style={{ fontSize: '0.75rem', color: 'var(--brand-red)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
          >
            <RefreshCw size={12} /> Limpiar Chat
          </button>
        </div>

        <div className={styles.phoneFrame}>
          <div className={styles.phoneNotch}></div>
          
          <div className={styles.phoneHeader}>
            <div className={styles.phoneUserAvatar}>🥋</div>
            <div className={styles.phoneUserInfo}>
              <h4>Dojo {config.dojo_name.split(" ").pop()}</h4>
              <p>Online (Sensei Bot)</p>
            </div>
          </div>

          <div className={styles.phoneChatArea}>
            {simulatedMessages.map((msg) => (
              <div key={msg.id} className={styles.chatBubble}>
                <div>{msg.message}</div>
                <span className={styles.bubbleTime}>
                  {msg.timestamp} <span className={styles.bubbleCheck}>✓✓</span>
                </span>
              </div>
            ))}
            {simulatedMessages.length === 0 && (
              <p style={{ color: '#707070', fontSize: '0.75rem', textAlign: 'center', margin: 'auto', padding: '1rem', fontFamily: 'sans-serif' }}>
                Esperando escaneos... Al realizar asistencia con QR verás los mensajes simulados aquí.
              </p>
            )}
          </div>

          <div className={styles.phoneFooter}>
            <div className={styles.phoneInputMock}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
