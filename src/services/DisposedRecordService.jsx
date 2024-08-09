import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";
// import { recordType} from '../components/RecordsTable';

// Initializing context
export const DisposedRecordContext = createContext();

export function DisposedRecordContextProvider({ children }) {
  const [recordsList, setRecords] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [recordType, setRecordType] = useState("");
  const [user, setUser] = useState("");
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

  const getUserRole = async (user) => {
    try {
      let query = supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user);

      const { error, data } = await query

      if (error) throw error;
      if (data) {
        setUserRole(data[0].role);
        return data[0].role;
      }

    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  const getRecords = async (recordType, user) => {
    const { from, to } = getPagination(first, rows);
    setLoading(true);

    // const role = await getUserRole(user);
    // console.log("role: " + role );

    const rtype = await recordType;
    console.log("rtype: " + rtype);

    try {

      let query = supabase
        .from('records')
        .select('id,box_location,box_content,record_title,department,row,status', { count: 'exact' });

      query = query.eq('status', '3');
      query = query.range(from, to);
      query = query.order("id", { ascending: false });

      const { error, data, count } = await query

      if (error) throw error;

      if (data) {
        setRecords(data);
        //const myObjStr = JSON.stringify(data);
        //console.log(myObjStr);
      }


      if (count) setRecordsCount(count);

      return data;

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  /*const getRecords = async (recordType) => {
    const { from, to } = getPagination(first, rows);
    setLoading(true);
    try {

      let query = supabase
        .from('records')
        .select('id,box_location,box_content,record_title,department,row,status', { count: 'exact' });

      if (recordType === "all") {
        query = query.range(from, to);
        query = query.order("id", { ascending: false });
      }
      else if (recordType === "disposed") {
        query = query.eq('status', 'Disposed');
        query = query.range(from, to);
        query = query.order("id", { ascending: false });
      }
      else if (recordType === "digitized") {
        query = query.eq('status', 'Digitized');
        query = query.range(from, to);
        query = query.order("id", { ascending: false });
      }

      const { error, data, count } = await query

      if (error) throw error;

      if (data) setRecords(data);

      if (count) setRecordsCount(count);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };*/

  const getRecordsByFilter = async (params) => {
    const queryParams = params
      ? Object.keys(params)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&')
      : '';

    return fetch('https://www.primefaces.org/data/customers?' + queryParams).then((res) => res.json());
  }

  // delete row from the database
  const deleteRecord = async (id) => {
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

      // Execute the deletion query
      const { error } = await query;

      if (error) throw error;

      await getRecords(recordType);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // add new row to the database
  const saveRecord = async (record) => {
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

      await getRecords(recordType);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setAdding(false);
    }
  };

  const updateRecord = async (record) => {
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

      await getRecords(recordType);
      console.log(record);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DisposedRecordContext.Provider
      value={{
        loading,
        adding,
        recordsCount,
        setRecordsCount,
        recordsList,
        getRecords,
        deleteRecord,
        saveRecord,
        updateRecord,
        setRows,
        setFirst,
        recordType,
        setRecordType,
        user,
        setUser,
      }}
    >
      {children}
    </DisposedRecordContext.Provider>
  );
}
