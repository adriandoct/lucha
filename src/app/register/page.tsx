import Link from "next/link";
import { signup } from "../login/actions";
import styles from "../auth.module.css";
import { ArrowLeft } from "lucide-react";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBackground}></div>
      
      <div className={styles.authCard}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--dojo-white-dim)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Volver al inicio
        </Link>

        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <span>DOJOIA</span><span style={{ color: 'var(--brand-red)' }}>ACCESS</span>
          </div>
        </div>
        
        <h1 className={styles.title}>Comienza tu Camino</h1>
        <p className={styles.subtitle}>Crea tu cuenta de acceso para la academia de Karate Shito-Ryu.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form action={signup}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="fullName">Nombre Completo</label>
            <input 
              className={styles.input}
              id="fullName" 
              name="fullName" 
              type="text" 
              placeholder="Ej. Mateo García López"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="role">Rol en el Dojo</label>
            <select 
              className={styles.input} 
              id="role" 
              name="role" 
              style={{ width: '100%', cursor: 'pointer', appearance: 'none', background: 'var(--bg-tertiary) url("data:image/svg+xml;utf8,<svg fill=\'%23a1a1aa\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 12px center' }}
              required
            >
              <option value="karateka">Estudiante / Karateka</option>
              <option value="sensei">Sensei Administrador</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Correo Electrónico</label>
            <input 
              className={styles.input}
              id="email" 
              name="email" 
              type="email" 
              placeholder="tu@correo.com"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Contraseña (Mínimo 6 caracteres)</label>
            <input 
              className={styles.input}
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>

          <button className={styles.submitBtn} type="submit" style={{ background: 'var(--brand-red)' }}>
            Registrarse y Comenzar
          </button>
        </form>

        <div className={styles.linkText}>
          ¿Ya tienes una cuenta? <Link href="/login">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
}
