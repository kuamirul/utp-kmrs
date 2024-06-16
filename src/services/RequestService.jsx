import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";

// Initializing context
export const RequestsContext = createContext();

export function RequestsContextProvider({ children }) {
  const [allRecords, setAllRecords] = useState([]);
  const [disposedRecords, setDisposedRecords] = useState([]);
  const [digitizedRecords, setDigitizedRecords] = useState([]);
  const [isAllRecords, setIsAllRecords] = useState(false);
  const [isDigitizedRecords, setIsDigitizedRecords] = useState(false);
  const [isDisposedRecords, setIsDisposedRecords] = useState(false);
  const [disposedRecordsCount, setDisposedRecordsCount] = useState(0);
  const [recordsCount, setRecordsCount] = useState(0);
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

  const getAllRecords = async () => {
    const { from, to } = getPagination(first, rows);
    setLoading(true);
    try {

      const { error, data, count } = await supabase
        .from('records')
        .select('id,box_location,box_content,record_title,department,row,status',{ count: 'exact'})
        .range(from, to)
        .order("id", { ascending: false });

      if (error) throw error;

      if (data) setAllRecords(data);

      if (count) setRecordsCount(count);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDigitizedRecords = async () => {
    const { from, to } = getPagination(first, rows);
    setLoading(true);
    try {

      const { error, data, count } = await supabase
        .from('records')
        .select('id,box_location,box_content,record_title,department,row,status',{ count: 'exact'})
        .eq('status', 'Digitized')
        .range(from, to)
        .order("id", { ascending: false });

      if (error) throw error; //check if there was an error fetching the data and move the execution to the catch block

      if (data) setDigitizedRecords(data);

      if (count) setRecordsCount(count);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDisposedRecords = async () => {
    const { from, to } = getPagination(first, rows);
    //console.log("from: ", from, " to: ", to);
    setLoading(true);
    try {

      const { error, data, count } = await supabase
        .from('records')
        .select('id,box_location,box_content,record_title,department,row,status',{ count: 'exact'})
        .eq('status', 'Disposed')
        .range(from, to)
        .order("id", { ascending: false });

      if (error) throw error; 

      if (data) setDisposedRecords(data);

      if (count) setRecordsCount(count);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

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

      await getDisposedRecords();

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

      /*console.log("isAllRecords : ", isAllRecords);
      console.log("isDigitizedRecords : ", isDigitizedRecords);
      console.log("isDisposedRecords : ", isDisposedRecords);

      if (isAllRecords) {
        await getAllRecords();
      } else if (isDigitizedRecords) {
        await getDigitizedRecords();
      } else if (isDisposedRecords) {
        await getDisposedRecords();
      }*/


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

      await getDisposedRecords();
      console.log(record);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequestsContext.Provider
      value={{
        loading,
        adding,
        recordsCount,
        setRecordsCount,
        allRecords,
        isAllRecords,
        setIsAllRecords,
        getAllRecords,
        disposedRecords,
        isDisposedRecords,
        setIsDisposedRecords,
        getDisposedRecords,
        disposedRecordsCount,
        setDisposedRecordsCount,
        digitizedRecords,
        isDigitizedRecords,
        setIsDigitizedRecords,
        getDigitizedRecords,
        deleteRecord,
        saveRecord,
        updateRecord,
        setRows, 
        setFirst,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}
