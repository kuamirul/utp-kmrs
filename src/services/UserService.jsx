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

      const { error, data, count } = await supabase
        .from('profiles')
        .select('id,full_name,company,job_title,business_phone,email,address',{ count: 'exact'})
        .range(from, to)
        .order("id", { ascending: false });

      if (error) throw error;

      if (data) setAllUsers(data);

      if (count) setUsersCount(count);

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
  const saveUser = async (record) => {
    setAdding(true);
    try {
      console.log("record before fetch: ", record);

      if ((record.id) && (record.id != null)) {
        console.log("Calling update query");
        const { error } = await supabase
          .from("records")
          .update([
            {
              box_location: record.box_location,
              box_content: record.box_content,
              record_title: record.record_title,
              department: record.department,
              row: record.row,
              status: record.status
            },
          ])
          .eq('id', record.id)
          .select()

        if (error) throw error;
      } else {
        console.log("Calling insert query");
        const { error } = await supabase
          .from("records")
          .insert([
            {
              box_location: record.box_location,
              box_content: record.box_content,
              record_title: record.record_title,
              department: record.department,
              row: record.row,
              status: record.status
            },
          ])
          .select()

        if (error) throw error;
      }

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setAdding(false);
    }
  };

  const updateUser = async (record) => {
    setLoading(true);
    try {

      const { error } = await supabase
        .from("records")
        //.update({ item })
        .update({
          box_location: record.box_location,
          box_content: record.box_content,
          record_title: record.record_title,
          department: record.department,
          row: record.row,
          status: record.status
        })
        .eq("id", record.id); //matching id of row to update

      if (error) throw error;

      await getDisposedUsers();
      console.log(record);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
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
        updateUser,
        setRows, 
        setFirst,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
