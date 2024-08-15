import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";
// import { recordType} from '../components/RecordsTable';

// Initializing context
export const DigitizedRecordContext = createContext();

export function DigitizedRecordContextProvider({ children }) {
  const [recordsList, setRecords] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [recordType, setRecordType] = useState("");
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [status, setStatus] = useState("");
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedDepartmentVal, setSelectedDepartment] = useState([]);

  // https://github.com/orgs/supabase/discussions/1223
  const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const from = page ? page + limit : 0
    //const to = page ? from + size - 1 : size - 1
    const to = page ? from + size : size;
    // console.log("limit: ", limit, " from: ", from, " to: ", to);
    return { from, to }
  }

  // const getUserRole = async (user) => {
  //   try {
  //     let query = supabase
  //       .from('user_roles')
  //       .select('role')
  //       .eq('user_id', user);

  //     const { error, data } = await query

  //     if (error) throw error;
  //     if (data) {
  //       //setUserRole(data[0].role);
  //       return data[0].role;
  //     }

  //   } catch (error) {
  //     console.log(error.error_description || error.message);
  //   }
  // };



  const getUserDepartment = async (email) => {

    // const role = await getUserRole(user);
    // console.log("role: " + role );

    try {

      let query = supabase
        .from('profiles')
        .select('department')
        .eq('email', email)
        .single();

      const { error, data } = await query

      if (error) throw error;

      if (data) {
        console.log(data);
        return data;
        //console.log(myObjStr);
      }

    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  const getStatus = async () => {
    try {
      let query = supabase
        .from('status')
        .select('id,status');

      const { error, data } = await query
      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error.error_description || error.message);
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

  const getRecords = async (recordType, user, email, userRole, lazyState) => {
    const { from, to } = getPagination(first, rows);
    setLoading(true);
    const { filters } = lazyState;
    try {

      let query = supabase
        .from('records')
        .select('id,box_location,box_content,record_title,department,row,status', { count: 'exact' });

      // Apply filters based on the "filters" argument
      if (filters) {
        Object.entries(filters).forEach(([field, filterValue]) => {
          if (field === 'record_title' || field === 'box_location' || field === 'box_content' || field === 'row') {
            query = query.ilike(field, `%${filterValue.value}%`); // Case-insensitive like search
          }
        });
      }
      if (userRole === 'user') {
        const userDepartment = await getUserDepartment(email);
        // console.log("department: " + userDepartment.department);
        query = query.eq("department", userDepartment.department)
      }
      
      query = query.eq('status', '2');
      query = query.range(from, to);
      query = query.order("id", { ascending: false });

      const { error, data, count } = await query

      if (error) throw error;

      const statuses = await getStatus();
      const departmentValues = await getDepartment();
      const statusMap = Object.fromEntries(statuses.map(s => [s.id, s.status]));
      const departmentMap = Object.fromEntries(departmentValues.map(d => [d.id, d.department]));
      const updatedRecords = data.map(record => ({
        ...record,
        status: statusMap[record.status] || 'Unknown',  // Use 'Unknown' if status not found
        department: departmentMap[record.department] || 'Unknown'
      }));
      setRecords(updatedRecords);

      if (count) setRecordsCount(count);

      return data;
    } catch (error) {
      console.log(error.error_description || error.message);
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

      await getRecords(recordType);

    } catch (error) {
      console.log(error.error_description || error.message);
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
      console.log(error.error_description || error.message);
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
      console.log(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DigitizedRecordContext.Provider
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
        status,
        setStatus,
        departmentOptions,
        setDepartmentOptions,
        selectedDepartmentVal,
        setSelectedDepartment,
        email,
        setEmail,
        userRole,
        setUserRole
      }}
    >
      {children}
    </DigitizedRecordContext.Provider>
  );
}
