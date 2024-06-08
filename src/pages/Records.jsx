import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// components
import AllRecords from '../components/AllRecords'

const Records = () => {
  const { user } = useAuth();
  const [fetchError, setFetchError] = React.useState(null);
   
  return (
    <div className="container-flex" style={{ fontSize: "24px" }}>
      <h3 className="pl-3">UTP Records</h3>
      {fetchError && (<p>{fetchError}</p>)}
      <AllRecords  />  
    </div>
    
  );
};

export default Records;