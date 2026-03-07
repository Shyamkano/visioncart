import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for a session instantly on load
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        setLoading(false);
        return;
      }
      setSession(session);

      // 2. If a session exists, fetch the user's profile ONCE.
      if (session?.user?.id) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Auth Error: Could not fetch profile for logged-in user.", error);
          } else {
            setProfile(profileData);
          }
        } catch (e) {
          console.error("Auth Exception:", e);
        }
      }

      // 3. Mark loading as complete.
      setLoading(false);
    }).catch((err) => {
      console.error("Unexpected error getting session:", err);
      setLoading(false);
    });

    // 4. Set up a listener for FUTURE auth events (LOGIN / LOGOUT)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // When the user logs in or out, update the session and profile.
        // This is primarily for login/logout actions, not for refreshing data.
        setSession(session);
        if (session?.user?.id) {
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => setProfile(data));
        } else {
          setProfile(null); // Clear profile on logout
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user: session?.user,
    profile,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  // The safety net that prevents crashes and "stuck loading" screens.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};