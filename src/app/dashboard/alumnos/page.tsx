"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./alumnos.module.css";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Award, 
  Printer, 
  X,
  Check,
  AlertCircle,
  FileSpreadsheet
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Karateka {
  id: string;
  matricula: string;
  nombre: string;
  cinturon: string;
  grado: string;
  tutor: string;
  telefono: string;
  foto_url: string;
  activo: boolean;
}

export default function AlumnosPage() {
  const [karatekas, setKaratekas] = useState<Karateka[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [beltFilter, setBeltFilter] = useState("");

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  
  // Selected Karateka for License or Edit
  const [selectedKarateka, setSelectedKarateka] = useState<Karateka | null>(null);

  // Form inputs
  const [formId, setFormId] = useState("");
  const [formMatricula, setFormMatricula] = useState("");
  const [formNombre, setFormNombre] = useState("");
  const [formCinturon, setFormCinturon] = useState("blanco");
  const [formGrado, setFormGrado] = useState("10° Kyu");
  const [formTutor, setFormTutor] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formFotoUrl, setFormFotoUrl] = useState("");

  // Importer states
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, number>>({});
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  // Load Karatekas list
  const fetchKaratekas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("karatekas")
        .select("*")
        .eq("activo", true)
        .order("nombre", { ascending: true });

      if (error || !data || data.length === 0) {
        // Fallback mock data
        const mockData: Karateka[] = [
          { id: "1", matricula: "KA-2026-001", nombre: "Mateo García López", cinturon: "verde", grado: "6° Kyu", tutor: "Adriana López", telefono: "+5215512345678", foto_url: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=200", activo: true },
          { id: "2", matricula: "KA-2026-002", nombre: "Sofía Martínez Ruiz", cinturon: "amarillo", grado: "8° Kyu", tutor: "Carlos Martínez", telefono: "+5215587654321", foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", activo: true },
          { id: "3", matricula: "KA-2026-003", nombre: "Diego Fernández Silva", cinturon: "negro", grado: "1° Dan", tutor: "Juan Fernández", telefono: "+5215545678901", foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", activo: true },
          { id: "4", matricula: "KA-2026-004", nombre: "Valentina Ruiz Castro", cinturon: "azul", grado: "5° Kyu", tutor: "Patricia Castro", telefono: "+5215598765432", foto_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", activo: true },
          { id: "5", matricula: "KA-2026-005", nombre: "Lucas Torres Mendoza", cinturon: "marron", grado: "2° Kyu", tutor: "Fernando Torres", telefono: "+5215565432109", foto_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200", activo: true }
        ];
        
        // Cache mock to local storage so edits are saved in dev mode
        const cached = localStorage.getItem("local_karatekas");
        if (cached) {
          setKaratekas(JSON.parse(cached));
        } else {
          setKaratekas(mockData);
          localStorage.setItem("local_karatekas", JSON.stringify(mockData));
        }
      } else {
        setKaratekas(data);
        localStorage.setItem("local_karatekas", JSON.stringify(data));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaratekas();
  }, []);

  const getBeltColor = (belt: string) => {
    switch (belt?.toLowerCase()) {
      case "blanco": return "belt-blanco";
      case "amarillo": return "belt-amarillo";
      case "naranja": return "belt-naranja";
      case "verde": return "belt-verde";
      case "azul": return "belt-azul";
      case "marron": return "belt-marron";
      case "negro": return "belt-negro";
      default: return "";
    }
  };

  // Open Form for Create
  const handleCreateOpen = () => {
    setFormId("");
    // Generate simple matricula
    const nextNum = String(karatekas.length + 1).padStart(3, '0');
    setFormMatricula(`KA-2026-${nextNum}`);
    setFormNombre("");
    setFormCinturon("blanco");
    setFormGrado("10° Kyu");
    setFormTutor("");
    setFormTelefono("");
    setFormFotoUrl("");
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleEditOpen = (k: Karateka) => {
    setFormId(k.id);
    setFormMatricula(k.matricula);
    setFormNombre(k.nombre);
    setFormCinturon(k.cinturon);
    setFormGrado(k.grado);
    setFormTutor(k.tutor);
    setFormTelefono(k.telefono);
    setFormFotoUrl(k.foto_url || "");
    setIsFormOpen(true);
  };

  // Submit manual registration
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNombre || !formMatricula || !formTutor || !formTelefono) {
      alert("Por favor rellena todos los campos obligatorios.");
      return;
    }

    const payload = {
      matricula: formMatricula.trim(),
      nombre: formNombre.trim(),
      cinturon: formCinturon,
      grado: formGrado.trim(),
      tutor: formTutor.trim(),
      telefono: formTelefono.trim(),
      foto_url: formFotoUrl.trim() || "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=200",
      activo: true
    };

    try {
      if (formId) {
        // Update in Supabase
        await supabase.from("karatekas").update(payload).eq("id", formId);
        
        // Update in local state
        const updatedList = karatekas.map(k => k.id === formId ? { ...k, ...payload } : k);
        setKaratekas(updatedList);
        localStorage.setItem("local_karatekas", JSON.stringify(updatedList));
      } else {
        // Insert in Supabase
        const { data, error } = await supabase.from("karatekas").insert(payload).select();
        
        // Update in local state
        const newKarateka = (data && data[0]) || { id: Math.random().toString(), ...payload };
        const updatedList = [...karatekas, newKarateka];
        setKaratekas(updatedList);
        localStorage.setItem("local_karatekas", JSON.stringify(updatedList));
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Drag-and-drop Parsing
  const handleCsvFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/);
      const rows: string[][] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const row = [];
        let inQuotes = false;
        let currentField = "";
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(currentField.trim());
            currentField = "";
          } else {
            currentField += char;
          }
        }
        row.push(currentField.trim());
        rows.push(row);
      }

      if (rows.length > 0) {
        const headers = rows[0];
        setCsvHeaders(headers);
        setCsvRows(rows.slice(1));
        
        // Auto-match headers if common names found
        const initialMapping: Record<string, number> = {};
        const databaseKeys = ["nombre", "matricula", "cinturon", "grado", "tutor", "telefono", "foto"];
        
        headers.forEach((h, idx) => {
          const cleanHeader = h.toLowerCase().replace(/[^a-z]/g, "");
          if (cleanHeader.includes("nombre") || cleanHeader.includes("name")) initialMapping["nombre"] = idx;
          if (cleanHeader.includes("matricula") || cleanHeader.includes("id")) initialMapping["matricula"] = idx;
          if (cleanHeader.includes("cinturon") || cleanHeader.includes("belt")) initialMapping["cinturon"] = idx;
          if (cleanHeader.includes("grado") || cleanHeader.includes("kyu") || cleanHeader.includes("grade")) initialMapping["grado"] = idx;
          if (cleanHeader.includes("tutor") || cleanHeader.includes("parent")) initialMapping["tutor"] = idx;
          if (cleanHeader.includes("telefono") || cleanHeader.includes("phone")) initialMapping["telefono"] = idx;
          if (cleanHeader.includes("foto") || cleanHeader.includes("image")) initialMapping["foto"] = idx;
        });

        setColumnMapping(initialMapping);
      }
    };
    reader.readAsText(file);
  };

  // Update mapping selections
  const handleMappingChange = (dbKey: string, csvIdx: number) => {
    setColumnMapping(prev => ({
      ...prev,
      [dbKey]: csvIdx
    }));
  };

  // Recalculate preview when mapping changes
  useEffect(() => {
    if (csvRows.length === 0) return;

    const previewList = csvRows.slice(0, 5).map(row => {
      return {
        nombre: columnMapping["nombre"] !== undefined ? row[columnMapping["nombre"]] : "--",
        matricula: columnMapping["matricula"] !== undefined ? row[columnMapping["matricula"]] : "AUTOGENERADO",
        cinturon: columnMapping["cinturon"] !== undefined ? row[columnMapping["cinturon"]] : "blanco",
        grado: columnMapping["grado"] !== undefined ? row[columnMapping["grado"]] : "10° Kyu",
        tutor: columnMapping["tutor"] !== undefined ? row[columnMapping["tutor"]] : "--",
        telefono: columnMapping["telefono"] !== undefined ? row[columnMapping["telefono"]] : "--",
        foto: columnMapping["foto"] !== undefined ? row[columnMapping["foto"]] : "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=200",
      };
    });
    setImportPreview(previewList);
  }, [columnMapping, csvRows]);

  // Execute CSV import
  const handleImportSubmit = async () => {
    if (columnMapping["nombre"] === undefined || columnMapping["tutor"] === undefined || columnMapping["telefono"] === undefined) {
      alert("Es obligatorio mapear por lo menos: Nombre, Tutor y Teléfono.");
      return;
    }

    const importedList: Karateka[] = csvRows.map((row, idx) => {
      const beltRaw = columnMapping["cinturon"] !== undefined ? row[columnMapping["cinturon"]].toLowerCase() : "blanco";
      const validBelts = ["blanco", "amarillo", "naranja", "verde", "azul", "marron", "negro"];
      const cinturon = validBelts.includes(beltRaw) ? beltRaw : "blanco";

      const matricula = columnMapping["matricula"] !== undefined && row[columnMapping["matricula"]] 
        ? row[columnMapping["matricula"]].trim() 
        : `KA-2026-${String(karatekas.length + idx + 1).padStart(3, '0')}`;

      return {
        id: Math.random().toString(),
        nombre: row[columnMapping["nombre"]],
        matricula: matricula,
        cinturon: cinturon,
        grado: columnMapping["grado"] !== undefined ? row[columnMapping["grado"]] : "10° Kyu",
        tutor: row[columnMapping["tutor"]],
        telefono: row[columnMapping["telefono"]],
        foto_url: columnMapping["foto"] !== undefined ? row[columnMapping["foto"]] : "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=200",
        activo: true
      };
    });

    try {
      // Send to Supabase in bulk
      const dbPayload = importedList.map(k => ({
        nombre: k.nombre,
        matricula: k.matricula,
        cinturon: k.cinturon,
        grado: k.grado,
        tutor: k.tutor,
        telefono: k.telefono,
        foto_url: k.foto_url,
        activo: true
      }));

      await supabase.from("karatekas").insert(dbPayload);

      // Save to local storage cache too
      const mergedList = [...karatekas, ...importedList];
      setKaratekas(mergedList);
      localStorage.setItem("local_karatekas", JSON.stringify(mergedList));

      setIsImportOpen(false);
      setCsvHeaders([]);
      setCsvRows([]);
      setColumnMapping({});
      setImportPreview([]);
      alert(`Se importaron ${importedList.length} Karatekas correctamente.`);
    } catch (err) {
      console.error(err);
      alert("Hubo un error importando a Supabase, pero se guardó en memoria local.");
    }
  };

  const handlePrintLicense = () => {
    window.print();
  };

  // Filter students based on search queries and belts
  const filteredKaratekas = karatekas.filter(k => {
    const matchesSearch = k.nombre.toLowerCase().includes(search.toLowerCase()) || 
                          k.matricula.toLowerCase().includes(search.toLowerCase()) ||
                          k.tutor.toLowerCase().includes(search.toLowerCase());
    const matchesBelt = beltFilter ? k.cinturon.toLowerCase() === beltFilter.toLowerCase() : true;
    return matchesSearch && matchesBelt;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Directorio de Karatekas</h1>
          <p>Nómina de alumnos y licencias de la academia Shito-Ryu.</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={() => setIsImportOpen(true)}>
            <Upload size={18} /> Importar Excel/CSV
          </button>
          <button className="btn-primary" style={{ background: 'var(--brand-red)', display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={handleCreateOpen}>
            <Plus size={18} /> Registrar Karateka
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, matrícula o tutor..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select 
          className={styles.selectInput}
          value={beltFilter}
          onChange={(e) => setBeltFilter(e.target.value)}
        >
          <option value="">Filtro: Todos los cinturones</option>
          <option value="blanco">Cinturón Blanco</option>
          <option value="amarillo">Cinturón Amarillo</option>
          <option value="naranja">Cinturón Naranja</option>
          <option value="verde">Cinturón Verde</option>
          <option value="azul">Cinturón Azul</option>
          <option value="marron">Cinturón Marrón</option>
          <option value="negro">Cinturón Negro</option>
        </select>
      </div>

      {/* Grid List */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre Karateka</th>
              <th>Matrícula</th>
              <th>Cinturón</th>
              <th>Grado Kyu/Dan</th>
              <th>Tutor responsable</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredKaratekas.map((k) => (
              <tr key={k.id}>
                <td>
                  <div className={styles.studentCell}>
                    <div className={styles.avatar}>
                      {k.foto_url ? (
                        <img src={k.foto_url} alt={k.nombre} className={styles.avatarImg} />
                      ) : (
                        k.nombre.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>{k.nombre}</span>
                    </div>
                  </div>
                </td>
                <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{k.matricula}</span></td>
                <td>
                  <span className={`belt-badge ${getBeltColor(k.cinturon)}`}>
                    {k.cinturon}
                  </span>
                </td>
                <td>{k.grado}</td>
                <td>{k.tutor}</td>
                <td>{k.telefono}</td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={`${styles.btnAction} ${styles.edit}`}
                      onClick={() => handleEditOpen(k)}
                    >
                      Editar
                    </button>
                    <button 
                      className={`${styles.btnAction} ${styles.card}`}
                      onClick={() => {
                        setSelectedKarateka(k);
                        setIsLicenseOpen(true);
                      }}
                    >
                      <Award size={14} /> Credencial
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredKaratekas.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                  {loading ? 'Cargando karatekas...' : 'No se encontraron karatekas con los filtros seleccionados.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Create or Edit Form */}
      {isFormOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.formCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{formId ? "Editar Karateka" : "Registrar Nuevo Alumno"}</h2>
              <button onClick={() => setIsFormOpen(false)} style={{ color: 'var(--text-secondary)' }}><X /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Matrícula</label>
                  <input type="text" className={styles.input} value={formMatricula} onChange={(e) => setFormMatricula(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Grado Kyu/Dan</label>
                  <input type="text" className={styles.input} placeholder="e.g. 6° Kyu" value={formGrado} onChange={(e) => setFormGrado(e.target.value)} required />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Nombre Completo del Karateka</label>
                <input type="text" className={styles.input} placeholder="Nombre y Apellidos" value={formNombre} onChange={(e) => setFormNombre(e.target.value)} required />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cinturón</label>
                  <select className={styles.selectInput} value={formCinturon} onChange={(e) => setFormCinturon(e.target.value)}>
                    <option value="blanco">Blanco</option>
                    <option value="amarillo">Amarillo</option>
                    <option value="naranja">Naranja</option>
                    <option value="verde">Verde</option>
                    <option value="azul">Azul</option>
                    <option value="marron">Marrón</option>
                    <option value="negro">Negro</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Enlace de Foto (URL)</label>
                  <input type="text" className={styles.input} placeholder="https://..." value={formFotoUrl} onChange={(e) => setFormFotoUrl(e.target.value)} />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Tutor Responsable</label>
                  <input type="text" className={styles.input} placeholder="Nombre de Padre/Madre" value={formTutor} onChange={(e) => setFormTutor(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Teléfono WhatsApp</label>
                  <input type="tel" className={styles.input} placeholder="e.g. +5215512345678" value={formTelefono} onChange={(e) => setFormTelefono(e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ background: 'var(--brand-red)', marginTop: '0.5rem' }}>
                {formId ? "Guardar Cambios" : "Guardar Karateka"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Credencial Digital / License */}
      {isLicenseOpen && selectedKarateka && (
        <div className={styles.modalOverlay}>
          <div className={styles.formCard} style={{ maxWidth: '370px', alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2>Credencial Digital</h2>
              <button onClick={() => setIsLicenseOpen(false)} style={{ color: 'var(--text-secondary)' }}><X /></button>
            </div>

            <div className="printArea">
              <div className={styles.licenseCard}>
                <div className={styles.licenseHeader}>
                  <h3>LION KAI</h3>
                  <p>Karate Do Shito-Ryu</p>
                </div>
                <div className={styles.licenseBody}>
                  <div className={styles.licensePhotoContainer}>
                    {selectedKarateka.foto_url ? (
                      <img src={selectedKarateka.foto_url} alt={selectedKarateka.nombre} className={styles.licensePhoto} />
                    ) : (
                      <span style={{ fontSize: '2.5rem' }}>🥋</span>
                    )}
                  </div>
                  <div className={styles.licenseMeta}>
                    <h4 style={{ textTransform: 'uppercase' }}>{selectedKarateka.nombre}</h4>
                    <p style={{ fontWeight: 600, color: 'var(--brand-red)' }}>Kyudan: {selectedKarateka.grado}</p>
                    <p style={{ fontSize: '0.65rem' }}>Cinta: {selectedKarateka.cinturon.toUpperCase()}</p>
                    <p style={{ fontSize: '0.65rem' }}>ID: {selectedKarateka.matricula}</p>
                  </div>
                </div>
                <div className={styles.licenseFooter}>
                  <div className={styles.qrContainer}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=000&data=${selectedKarateka.matricula}`} 
                      alt="QR Access" 
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className={styles.licenseSign}>
                    <p>Sensei Principal</p>
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ background: 'var(--brand-red)', display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              onClick={handlePrintLicense}
            >
              <Printer size={18} /> Imprimir / PDF
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Excel/CSV Drag-and-drop Importer */}
      {isImportOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.importerCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSpreadsheet color="var(--success)" size={28} />
                <h2>Importador de Alumnos (CSV)</h2>
              </div>
              <button onClick={() => {
                setIsImportOpen(false);
                setCsvHeaders([]);
                setCsvRows([]);
              }} style={{ color: 'var(--text-secondary)' }}><X /></button>
            </div>

            {csvHeaders.length === 0 ? (
              <div 
                className={styles.dropzone}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files.length > 0) {
                    handleCsvFile(e.dataTransfer.files[0]);
                  }
                }}
              >
                <Upload size={48} color="var(--text-tertiary)" />
                <div>
                  <h3>Arrastra tu archivo CSV aquí</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    O haz clic para explorar tus carpetas locales
                  </p>
                </div>
                <input 
                  type="file" 
                  accept=".csv" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleCsvFile(e.target.files[0]);
                    }
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Las columnas sugeridas son: Nombre, Matrícula, Cinturón, Grado, Tutor, Teléfono
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3>Mapear Columnas de tu Archivo</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Asocia las columnas de tu CSV con los campos del perfil de Karateka en Supabase.
                </p>

                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                  {["nombre", "matricula", "cinturon", "grado", "tutor", "telefono", "foto"].map((dbKey) => (
                    <div key={dbKey} className={styles.mappingRow}>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                        {dbKey === "foto" ? "Foto URL" : dbKey} 
                        {["nombre", "tutor", "telefono"].includes(dbKey) && <span style={{ color: 'var(--brand-red)' }}> *</span>}
                      </span>
                      <span>➡️ Mapea a:</span>
                      <select 
                        className={styles.selectInput}
                        value={columnMapping[dbKey] ?? ""}
                        onChange={(e) => handleMappingChange(dbKey, parseInt(e.target.value))}
                      >
                        <option value="">-- Ignorar o Auto --</option>
                        {csvHeaders.map((header, idx) => (
                          <option key={idx} value={idx}>{header}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <h3>Vista Previa de Importación (Primeros 5 registros)</h3>
                <div className={styles.previewTableWrapper}>
                  <table className={styles.table} style={{ fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Matrícula</th>
                        <th>Cinturón</th>
                        <th>Grado</th>
                        <th>Tutor</th>
                        <th>Teléfono</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.nombre}</td>
                          <td style={{ fontFamily: 'monospace' }}>{item.matricula}</td>
                          <td>
                            <span className={`belt-badge ${getBeltColor(item.cinturon)}`} style={{ fontSize: '0.7rem' }}>
                              {item.cinturon}
                            </span>
                          </td>
                          <td>{item.grado}</td>
                          <td>{item.tutor}</td>
                          <td>{item.telefono}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ flex: 1 }}
                    onClick={() => {
                      setCsvHeaders([]);
                      setCsvRows([]);
                    }}
                  >
                    Cargar Otro Archivo
                  </button>
                  <button 
                    className="btn-primary" 
                    style={{ flex: 1, background: 'var(--brand-red)' }}
                    onClick={handleImportSubmit}
                  >
                    Completar Importación
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
