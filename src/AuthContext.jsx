import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (_event === "SIGNED_IN" && session?.user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", session.user.id)
            .single();

          if (!profile) {
            window.location.href = "/setup";
          } else {
            await supabase
              .from("profiles")
              .update({ last_seen: new Date().toISOString() })
              .eq("id", session.user.id);

            if (
              window.location.pathname === "/" ||
              window.location.pathname === "/signIn" ||
              window.location.pathname === "/signUp"
            ) {
              window.location.href = "/home";
            }
          }
          // if already on /home or elsewhere, don't redirect at all
        } catch (err) {
          // network error — do nothing, stay on current page
          console.error("Auth check failed:", err);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Heartbeat to stay online
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(
      async () => {
        await supabase
          .from("profiles")
          .update({ last_seen: new Date().toISOString() })
          .eq("id", user.id);
      },
      3 * 60 * 1000,
    ); // every 3 minutes

    return () => clearInterval(interval);
  }, [user]);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
