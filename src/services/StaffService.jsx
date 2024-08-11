import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";

// Initializing context
export const StaffsContext = createContext();

export function StaffsContextProvider({ children }) {
  const [allStaffs, setAllStaffs] = useState([]);
  const [isAllStaffs, setIsAllStaffs] = useState(false);
  const [staffsCount, setStaffsCount] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // https://github.com/orgs/supabase/discussions/1223
  const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const from = page ? page + limit : 0
    //const to = page ? from + size - 1 : size - 1
    const to = page ? from + size : size;
    // console.log("limit: ", limit, " from: ", from, " to: ", to);
    return { from, to }
  }

  const getAllStaffs = async () => {
    const { from, to } = getPagination(first, rows);
    setLoading(true);
    try {

      const { error, data, count } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        company,
        job_title,
        business_phone,
        email,
        address,
        user_roles!profiles_id_fkey1!inner (
          role
        )
      `, { count: 'exact' })
      .eq('user_roles.role', 'user')
      .order("id", { ascending: false });
      //.not('user_roles.role', 'is', null)           

      if (error) throw error;

      if (data) setAllStaffs(data);

      if (count) setStaffsCount(count);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (id) => {
    setLoading(true);
    try {
      console.log("id: ", id)

      const idArray = Array.isArray(id) ? id : [id]; // Convert to array if necessary

      const query = supabase
        .from("records")
        .delete();
      // Add the ID filter(s) dynamically based on the array size
      if (idArray.length === 1) {
        query.eq("id", idArray[0]); // Single ID case
      } else {
        query.in("id", idArray); // Multiple ID case
      }

      const { error } = await query;

      if (error) throw error;

      await getDisposedStaffs();

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // add new row to the database
  const saveStaff = async (staff) => {
    setAdding(true);
    try {
      console.log("staff before fetch: ", staff);
      //.select('id,full_name,company,job_title,business_phone,email,address',{ count: 'exact'})
      if ((staff.id) && (staff.id != null)) {
        console.log("Calling update query", staff);
        const { error } = await supabase
          .from("profiles")
          .update([
            {
              full_name: staff.full_name,
              company: staff.company,
              job_title: staff.job_title,
              business_phone: staff.business_phone,
              email: staff.email,
              address: staff.address
            },
          ])
          .eq('id', staff.id)
          .select()

        if (error) throw error;
      } else {
        console.log("Calling insert query");
        const { error } = await supabase
          .from("profiles")
          .insert([
            {
              full_name: staff.full_name,
              company: staff.company,
              job_title: staff.job_title,
              business_phone: staff.business_phone,
              email: staff.email,
              address: staff.address
            },
          ])
          .select()

        if (error) throw error;
      }

      //console.log("isAllRecords : ", isAllRecords);

      await getAllStaffs();

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <StaffsContext.Provider
      value={{
        loading,
        adding,
        staffsCount,
        setStaffsCount,
        allStaffs,
        isAllStaffs,
        setIsAllStaffs,
        getAllStaffs,
        deleteStaff,
        saveStaff,
        setRows,
        setFirst,
      }}
    >
      {children}
    </StaffsContext.Provider>
  );
}
