import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import styles from "../dashboard.module.css";
import {
  LayoutDashboard,
  Users,
  QrCode,
  Calendar,
  Settings,
  LogOut,
  Shield,
  Award,
  Video,
  PlaySquare
} from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let user = null;

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    console.warn("Supabase auth check failed. Using offline developer mode.", error);
  }

  // Read cookies for mock/local bypass roles
  const cookieStore = await cookies();
  const role = cookieStore.get("dojoia_role")?.value || "karateka";
  const name = cookieStore.get("dojoia_name")?.value || "Karateka";
  const email = cookieStore.get("dojoia_email")?.value || "";

  // Senior dev fallback: If Supabase env keys are missing, bypass login so the demo is fully functional
  if (!user && !email) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Allow fallback if no local session exists yet
      return redirect("/login");
    } else {
      return redirect("/login");
    }
  }

  const isSensei = role === "sensei";

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon} style={{ background: 'var(--brand-red)' }}>
            <Shield size={24} color="#FFF" />
          </div>
          <div>
            <span className={styles.logoText}>DOJOIA</span>
            <span className={styles.logoAccent} style={{ color: 'var(--brand-red)' }}>ACCESS</span>
          </div>
        </div>
        
        <nav className={styles.navMenu}>
          <div className={styles.navSectionTitle}>Principal</div>
          
          <Link href="/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {isSensei ? (
            <>
              <div className={styles.navSectionTitle} style={{ marginTop: '1rem' }}>Gestión Dojo</div>
              
              <Link href="/dashboard/alumnos" className={styles.navItem}>
                <Users size={20} />
                <span>Karatekas y Tutores</span>
              </Link>
              
              <Link href="/dashboard/asistencia" className={styles.navItem}>
                <QrCode size={20} />
                <span>Escáner QR</span>
              </Link>
              
              <Link href="/dashboard/estructura" className={styles.navItem}>
                <Award size={20} />
                <span>Horarios y Programa</span>
              </Link>
              
              <div className={styles.navSectionTitle} style={{ marginTop: '1rem' }}>Ajustes</div>
              
              <Link href="/dashboard/settings" className={styles.navItem}>
                <Settings size={20} />
                <span>Configuración y WhatsApp</span>
              </Link>
            </>
          ) : (
            <>
              <div className={styles.navSectionTitle} style={{ marginTop: '1rem' }}>Portal Alumno</div>

              <Link href="/dashboard/videos" className={styles.navItem}>
                <Video size={20} />
                <span>Videos de Entrenamiento</span>
              </Link>
              
              <Link href="/dashboard/estructura" className={styles.navItem}>
                <Calendar size={20} />
                <span>Horarios Especiales</span>
              </Link>
            </>
          )}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar} style={{ background: isSensei ? 'var(--brand-red)' : 'var(--brand-gold)' }}>🥋</div>
            <div className={styles.userInfo}>
              <h4 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                {name}
              </h4>
              <p>{isSensei ? "Sensei Administrador" : "Karateka Estudiante"}</p>
            </div>
          </div>
          <form action="/auth/signout" method="post" style={{ marginTop: '1rem' }}>
            <button type="submit" className={styles.navItem} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
