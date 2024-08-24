import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";


// Initializing context
export const DashboardContext = createContext();

export function DashboardContextProvider({ children }) {
  const [recordsList, setRecords] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [recordType, setRecordType] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  const getUserDepartment = async (email) => {
    try {
      let query = supabase
        .from('profiles')
        .select('department')
        .eq('email', email)
        .single();

      const { error, data } = await query

      if (error) throw error;
      if (data) {
        // setUserRole(data[0].role);
        console.log(data);
        return data;
      }

    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };


  const getRecords = async (recordType, user, email, userRole) => {
    
    setLoading(true);

    try {

      let query = supabase
        .from('records')
        .select('id', { count: 'exact' })
        .single();

      // console.log("email: "+email);
      // console.log("userRole: "+userRole);

      if (userRole === 'user') {
          const userDepartment = await getUserDepartment(email);
          // console.log("department: " + userDepartment.department);
          query = query.eq("department",userDepartment.department)
      }

      const { error, data, count } = await query

      if (error) throw error;

      //console.log(updatedRecords);

      if (count) setRecordsCount(count);

      if (data) {
        // setUserRole(data[0].role);
        console.log(data);
        return data;
      }

    } catch (error) {
      console.log(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <DashboardContext.Provider
      value={{
        loading,
        adding,
        recordsCount,
        setRecordsCount,
        getRecords,
        recordType,
        setRecordType,
        user,
        setUser,
        email,
        setEmail,
        userRole,
        setUserRole
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
