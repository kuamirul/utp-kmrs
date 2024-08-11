import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

const AdminProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      getUserRole(session.user.id);
    }

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        getUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const getUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      if (data) setUserRole(data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const value = {
    user,
    userRole,
  };

  return (
  <AdminContext.Provider 
    value={value}>
      {children} 
  </AdminContext.Provider>);
};

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

export default AdminProvider;