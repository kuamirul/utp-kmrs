import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";
// import { requestType} from '../components/RecordsTable';

// Initializing context
export const RequestsContext = createContext();

export function RequestsContextProvider({ children }) {
  const [requestsList, setRequests] = useState([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [requestType, setRequestType] = useState("");

  // https://github.com/orgs/supabase/discussions/1223
  const getPagination = (page, size) => {
    const limit = size ? +size : 3
    const from = page ? page + limit : 0
    //const to = page ? from + size - 1 : size - 1
    const to = page ? from + size : size;
    // console.log("limit: ", limit, " from: ", from, " to: ", to);
    return { from, to }
  }

  const getRequests = async (requestType) => {
    const { from, to } = getPagination(first, rows);
    setLoading(true);
    try {

      let query = supabase
        .from('requests')
        .select('id,title,records_description, profiles:customer(id, full_name),profiles2:assigned_to(id, full_name),department (id,department),priority,status (id, status),category,due_date', { count: 'exact' });

      query = query.range(from, to);
      query = query.order("id", { ascending: false });


      const { error, data, count } = await query

      if (error) throw error;

      if (data) {
        setRequests(data);
        console.log("data: ", data);
      }

      if (count) setRequestsCount(count);

    } catch (error) {
      console.log(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // delete row from the database
  const deleteRequest = async (id) => {
    setLoading(true);
    try {
      console.log("id: ", id)

      const idArray = Array.isArray(id) ? id : [id]; // Convert to array if necessary

      const query = supabase
        .from("requests")
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

      await getRequests(requestType);

    } catch (error) {
      console.log(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // add new row to the database
  const saveRequest = async (request) => {
    setAdding(true);
    try {
      console.log("request before fetch: ", request);

      if ((request.id) && (request.id != null)) {
        console.log("Calling update query");
        const { error } = await supabase
          .from("requests")
          .update([
            {
              title: request.title,
              records_description: request.records_description,
              customer: request.customer,
              assigned_to: request.assigned_to,
              department: request.department,
              priority: request.priority,
              status: request.status,
              category: request.category,
              due_date: request.due_date
            },
          ])
          .eq('id', request.id)
          .select()

        if (error) throw error;
      } else {
        console.log("Calling insert query");
        const { error } = await supabase
          .from("requests")
          .insert([
            {
              title: request.title,
              records_description: request.records_description,
              customer: request.customer,
              assigned_to: request.assigned_to,
              department: request.department,
              priority: request.priority,
              status: request.status,
              category: request.category,
              due_date: request.due_date
            },
          ])
          .select()

        if (error) throw error;
      }

      await getRequests(requestType);

    } catch (error) {
      console.log(error.error_description || error.message);
    } finally {
      setAdding(false);
    }
  };

  const updateRequest = async (request) => {
    setLoading(true);
    try {

      const { error } = await supabase
        .from("requests")
        //.update({ item })
        .update({
          title: request.title,
          records_description: request.records_description,
          customer: request.customer,
          assigned_to: request.assigned_to,
          department: request.department,
          priority: request.priority,
          status: request.status,
          category: request.category,
          due_date: request.due_date
        })
        .eq("id", request.id); //matching id of row to update

      if (error) throw error;

      await getRequests(requestType);
      console.log(request);

    } catch (error) {
      console.log(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequestsContext.Provider
      value={{
        loading,
        adding,
        requestsCount,
        setRequestsCount,
        requestsList,
        getRequests,
        deleteRequest,
        saveRequest,
        updateRequest,
        setRows,
        setFirst,
        requestType,
        setRequestType,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}
