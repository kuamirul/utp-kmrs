import React, { createContext, useState } from "react";
import { supabase } from "../supabaseClient";

// Initializing context
export const ItemsContext = createContext();

export function ItemsContextProvider({ children }) {
  const [disposedRecords, setDisposedRecords] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [inactiveItems, setInactiveItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  // get all active items by the user
  const getActiveItems = async () => {
    setLoading(true);
    try {
      // get the user currently logged in
      const user = supabase.auth.user();

      const { error, data } = await supabase
        .from("todo") //the table you want to work with
        .select("item, done, id") //columns to select from the database
        .eq("userId", user?.id) //comparison function to return only data with the user id matching the current logged in user
        .eq("done", false) //check if the done column is equal to false
        .order("id", { ascending: false }); // sort the data so the last item comes on top;

      if (error) throw error; //check if there was an error fetching the data and move the execution to the catch block

      if (data) setActiveItems(data);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // get all active items by the user
  const getDisposedRecords = async () => {
    setLoading(true);
    try {
      // get the user currently logged in
      //const user = supabase.auth.user();

      const { error, data } = await supabase
        .from('records')
        .select('id,box_location,box_content,record_title,department,row,status')
        .eq('status', 'Disposed')
        .range(0, 30)
        .order("id", { ascending: false });

      if (error) throw error; //check if there was an error fetching the data and move the execution to the catch block

      if (data) setDisposedRecords(data);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };


  // get all completed items by the user
  const getInactiveItems = async () => {
    setLoading(true);
    try {
      // get the user currently logged in
      const user = supabase.auth.user();

      const { error, data } = await supabase
        .from("todo") //the table you want to work with
        .select("item, done, id") //columns to select from the database
        .eq("userId", user?.id) //comparison function to return only data with the user id matching the current logged in user
        .eq("done", true) //check if the done column is equal to true
        .order("id", { ascending: false }); // sort the data so the last item comes on top

      if (error) throw error; //check if there was an error fetching the data and move the execution to the catch block

      if (data) setInactiveItems(data);

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // delete row from the database
  /*const deleteItem = async (id) => {
    try {
      const user = supabase.auth.user();

      const { error } = await supabase
        .from("todo")
        .delete() //delete the row
        .eq("id", id) //the id of row to delete
        .eq("userId", user?.id) //check if the item being deleted belongs to the user

      if (error) throw error;

      await getInactiveItems(); //get the new completed items list
      await getActiveItems(); //get the new active items list
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };*/

  // delete row from the database
  const deleteRecord = async (id) => {
    try {
      //const user = supabase.auth.user();
      console.log("id: ", id)

      const idArray = Array.isArray(id) ? id : [id]; // Convert to array if necessary

      // Construct the Supabase query
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


      /*const { error } = await supabase
        .from("records")
        .delete() //delete the row
        .eq("id", id) //the id of row to delete

      if (error) throw error;*/

      await getDisposedRecords();

    } catch (error) {
      alert(error.error_description || error.message);
    }
  };



  // add new row to the database
  /*const saveRecord = async (item) => {
    setAdding(true);
    try {
      //const user = supabase.auth.user();

      const { error } = await supabase
        .from("todo")
        .insert({ item, userId: user?.id }); //insert an object with the key value pair, the key being the column on the table

      if (error) throw error;

      await getActiveItems(); //get the new active items list

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setAdding(false);
    }
  };*/

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

      await getDisposedRecords(); //get the new active items list

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setAdding(false);
    }
  };

  // update column(s) on the database
  /*const updateItem = async ({ item, id }) => {
    setLoading(true);
    try {
      const user = supabase.auth.user();

      const { error } = await supabase
        .from("todo")
        .update({ item })
        .eq("userId", user?.id)
        .eq("id", id); //matching id of row to update

      if (error) throw error;

      await getActiveItems();
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };*/

  const updateItem = async (record) => {
    //{ box_location, box_content, record_title, department ,row ,status, id }
    setLoading(true);
    try {
      //const user = supabase.auth.user();

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


  // change value of done to true
  const markAsDone = async (id) => {
    setLoading(true);
    try {
      const user = supabase.auth.user();
      const { error } = await supabase
        .from("todo")
        .update({ done: true })
        .eq("userId", user?.id)
        .eq("id", id); //match id to toggle

      if (error) throw error;

      await getActiveItems();
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // change value of done to false
  const markActive = async (id) => {
    setLoading(true);
    try {
      const user = supabase.auth.user();
      const { error } = await supabase
        .from("todo")
        .update({ done: false })
        .eq("userId", user?.id)
        .eq("id", id); //match id of row to toggle

      if (error) throw error;

      await getInactiveItems();

    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ItemsContext.Provider
      value={{
        activeItems,
        inactiveItems,
        loading,
        adding,
        disposedRecords,
        getDisposedRecords,
        getActiveItems,
        getInactiveItems,
        //deleteItem,
        deleteRecord,
        saveRecord,
        //addItem,
        updateItem,
        markAsDone,
        markActive,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

/*export const RecordService = {


  getProductsSmall() {
    return fetch('data/products-small.json').then(res => res.json()).then(d => d.data);
  },

  getRecords({ data }) {

    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .range(0, 9)

      if (error) {
        setFetchError('Could not fetch the cases')
        setCases(null)
      }
      if (data) {
        //setCases(data)
        //setProducts(records)
        //setFetchError(null)
        console.log('Fetched data:', data, typeof data);
        return data;
      }
    }

    fetchRecords();



    //return fetch('data/products.json').then(res => res.json()).then(d => d.data);
  },

  getProductsWithOrdersSmall() {
    return fetch('data/products-orders-small.json').then(res => res.json()).then(d => d.data);
  }
}*/
