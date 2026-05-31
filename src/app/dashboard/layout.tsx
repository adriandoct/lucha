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
  Award
} from "lucide-react";
import Link from "next/link";

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

  // Senior dev fallback: If Supabase env keys are missing, bypass login so the demo is fully functional
  if (!user) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      user = {
        id: "00000000-0000-0000-0000-000000000000",
        email: "sensei@dojoia.com",
        user_metadata: {
          full_name: "Sensei Carlos Martínez"
        }
      } as any;
    } else {
      return redirect("/login");
    }
  }

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
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <div className={styles.avatar} style={{ background: 'var(--brand-red)' }}>🥋</div>
            <div className={styles.userInfo}>
              <h4>{user.user_metadata?.full_name || "Sensei"}</h4>
              <p>Sensei Administrador</p>
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
