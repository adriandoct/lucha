"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const emailVal = formData.get("email") as string;
  const passwordVal = formData.get("password") as string;

  const cookieStore = await cookies();

  const email = (emailVal || "").trim().toLowerCase();
  const password = (passwordVal || "").trim();

  const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                         !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                         String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).includes("reemplázala");

  // FIXED ADMIN SENSEI BYPASS
  const isAdminEmail = email === "admin@admin.com";
  const isAdminPassword = 
    password.toLowerCase() === "12345678cecyte" ||
    password.toLowerCase() === "12345678cecy" ||
    password === "12345678";

  if (isAdminEmail && isAdminPassword) {
    if (!isMockSupabase) {
      try {
        const authPassword = password.toLowerCase() === "12345678cecyte" ? passwordVal : "12345678Cecyte";
        // Attempt standard auth login to create an active Supabase session
        const { error: signInError } = await supabase.auth.signInWithPassword({ 
          email: "admin@admin.com", 
          password: authPassword 
        });
        if (signInError) {
          // If sign in fails (e.g. user does not exist), register the user first
          const { error: signUpError } = await supabase.auth.signUp({
            email: "admin@admin.com",
            password: "12345678Cecyte",
            options: {
              data: {
                full_name: "Sensei Carlos Martínez",
                role: "sensei",
              },
            },
          });
          if (!signUpError) {
            await supabase.auth.signInWithPassword({ 
              email: "admin@admin.com", 
              password: "12345678Cecyte" 
            });
          }
        }
      } catch (authErr) {
        console.warn("Supabase auth integration failed during admin bypass, continuing with cookie session:", authErr);
      }
    }
    cookieStore.set("dojoia_role", "sensei", { path: "/" });
    cookieStore.set("dojoia_email", "admin@admin.com", { path: "/" });
    cookieStore.set("dojoia_name", "Sensei Carlos Martínez", { path: "/" });
    return redirect("/dashboard");
  }

  // CHECK DYNAMIC KARATEKA TABLE FOR STUDENT CREDENTIALS
  if (!isMockSupabase) {
    try {
      const { data: students, error: studentError } = await supabase
        .from("karatekas")
        .select("nombre, tutor")
        .like("tutor", `%[credentials:${email}:%`);

      if (students && students.length > 0 && !studentError) {
        // Find if any student has a matching password (allowing suffix variations)
        const matchingStudent = students.find((student: any) => {
          const match = student.tutor?.match(/\[credentials:([^:]+):([^\]]+)\]/);
          if (!match) return false;
          const storedPassword = match[2].trim();
          
          const enteredLower = password.toLowerCase();
          const storedLower = storedPassword.toLowerCase();
          
          return enteredLower === storedLower || 
                 enteredLower === storedLower + "cecy" || 
                 enteredLower === storedLower + "cecyte" ||
                 storedLower === enteredLower + "cecy" ||
                 storedLower === enteredLower + "cecyte";
        });

        if (matchingStudent) {
          cookieStore.set("dojoia_role", "karateka", { path: "/" });
          cookieStore.set("dojoia_email", email, { path: "/" });
          cookieStore.set("dojoia_name", matchingStudent.nombre, { path: "/" });
          return redirect("/dashboard");
        }
      }
    } catch (dbErr) {
      console.warn("Dynamic karateka check failed or skipped", dbErr);
    }
  }

  // STANDARD AUTH
  let authError = null;
  let userMetadata = null;

  if (!isMockSupabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      authError = error;
      if (!error && data?.user) {
        userMetadata = data.user.user_metadata;
      }
    } catch (err) {
      console.error("Supabase auth signInWithPassword failed", err);
      authError = err;
    }
  }

  if (isMockSupabase || authError) {
    // If Supabase credentials fail or we are offline/no-keys, check and allow a mock login
    if (isMockSupabase && email && password) {
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
  const role = userMetadata?.role || "karateka";
  const name = userMetadata?.full_name || "Karateka";

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
