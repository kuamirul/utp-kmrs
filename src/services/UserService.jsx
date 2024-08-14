import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";

// Initializing context
export const UsersContext = createContext();

export function UsersContextProvider({ children }) {
  const [allUsers, setAllUsers] = useState([]);
  const [isAllUsers, setIsAllUsers] = useState(false);
  const [usersCount, setUsersCount] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartmentVal, setSelectedDepartment] = useState([]);
  const [userRole, setUserRole] = useState("");

  // https://github.com/orgs/supabase/discussions/1223
  const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const from = page ? page + limit : 0
    //const to = page ? from + size - 1 : size - 1
    const to = page ? from + size : size;
    // console.log("limit: ", limit, " from: ", from, " to: ", to);
    return { from, to }
  }

  const getAllUsers = async () => {
    const { from, to } = getPagination(first, rows);
    setLoading(true);
    try {

      let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        department,
        business_phone,
        email,
        user_roles!profiles_id_fkey1!inner (
          role
        )
      `, { count: 'exact' })
      .order("id", { ascending: false });
            
      const { error, data, count } = await query

      const departmentValues = await getDepartment();
      // console.log("department: " + userDepartment.department);
      const departmentMap = Object.fromEntries(departmentValues.map(d => [d.id, d.department]));

      // Replace id with description in records
      const updatedUsers = data.map(user => ({
        ...user,
        department: departmentMap[user.department] || 0
      }));

      if (error) throw error;

      if (data) setAllUsers(updatedUsers);
      //console.log(updatedUsers);

      if (count) setUsersCount(count);

      return data;

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
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

      await getDisposedUsers();

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // add new row to the database
  const saveUser = async (user) => {
    setAdding(true);
    try {
      console.log("user before fetch: ", user);
      //.select('id,full_name,company,department,business_phone,email,address',{ count: 'exact'})
      if ((user.id) && (user.id != null)) {
        console.log("Calling update query", user);
        const { error } = await supabase
          .from("profiles")
          .update([
            {
              full_name: user.full_name,
              department: user.department,
              business_phone: user.business_phone,
              email: user.email,
            },
          ])
          .eq('id', user.id)
          .select()

        if (error) throw error;
      } else {
        console.log("Calling insert query");
        const { error } = await supabase
          .from("profiles")
          .insert([
            {
              full_name: user.full_name,
              department: user.department,
              business_phone: user.business_phone,
              email: user.email,
            },
          ])
          .select()

        if (error) throw error;
      }

      //console.log("isAllRecords : ", isAllRecords);

      await getAllUsers();

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setAdding(false);
    }
  };


  const getDepartment = async () => {
    try {
      let query = supabase
        .from('department')
        .select('id,department');

      const { error, data } = await query

      if (error) throw error;
      if (data) {
        setDepartmentOptions(data);
        return data;
      }

    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  return (
    <UsersContext.Provider
      value={{
        loading,
        adding,
        usersCount,
        setUsersCount,
        allUsers,
        isAllUsers,
        setIsAllUsers,
        getAllUsers,
        deleteUser,
        saveUser,
        setRows, 
        setFirst,
        departmentOptions,
        setDepartmentOptions,
        selectedDepartmentVal,
        setSelectedDepartment,
        userRole,
        setUserRole
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
