"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const cookieStore = await cookies();

  // FIXED ADMIN SENSEI BYPASS
  if (email === "admin@admin.com" && password === "12345678Cecyte") {
    cookieStore.set("dojoia_role", "sensei", { path: "/" });
    cookieStore.set("dojoia_email", "admin@admin.com", { path: "/" });
    cookieStore.set("dojoia_name", "Sensei Carlos Martínez", { path: "/" });
    return redirect("/dashboard");
  }

  // STANDARD AUTH
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // If Supabase credentials fail, check if we are offline/no-keys and allow a mock karateka login
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL && email && password) {
      const isStudent = email.includes("student") || email.includes("alumno") || password === "123456";
      const role = isStudent ? "karateka" : "sensei";
      const name = isStudent ? "Mateo García López" : "Sensei Carlos Martínez";
      
      cookieStore.set("dojoia_role", role, { path: "/" });
      cookieStore.set("dojoia_email", email, { path: "/" });
      cookieStore.set("dojoia_name", name, { path: "/" });
      return redirect("/dashboard");
    }
    return redirect("/login?error=Credenciales inválidas. Por favor intenta de nuevo.");
  }

  // Read metadata role if Supabase is connected
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role || "karateka";
  const name = user?.user_metadata?.full_name || "Karateka";

  cookieStore.set("dojoia_role", role, { path: "/" });
  cookieStore.set("dojoia_email", email, { path: "/" });
  cookieStore.set("dojoia_name", name, { path: "/" });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string || "karateka";

  const cookieStore = await cookies();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role, // 'sensei' or 'karateka'
      },
    },
  });

  if (error) {
    // Fallback for offline signup demo
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      cookieStore.set("dojoia_role", role, { path: "/" });
      cookieStore.set("dojoia_email", email, { path: "/" });
      cookieStore.set("dojoia_name", fullName, { path: "/" });
      return redirect("/dashboard?welcome=true");
    }
    return redirect("/register?error=" + encodeURIComponent(error.message));
  }

  cookieStore.set("dojoia_role", role, { path: "/" });
  cookieStore.set("dojoia_email", email, { path: "/" });
  cookieStore.set("dojoia_name", fullName, { path: "/" });

  revalidatePath("/", "layout");
  redirect("/dashboard?welcome=true");
}
