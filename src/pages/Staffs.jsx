import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Panel } from 'primereact/panel';

// components
import StaffList from '../components/StaffList'

const Staffs = () => {
  const { user, userRole } = useAuth();
  const [fetchError, setFetchError] = React.useState(null);
  // console.log(user);

  return (
    <Panel>
      <div className="container-flex" style={{ fontSize: "24px" }}>
        <h3 className="pl-3">Staff List </h3>
        {fetchError && (<p>{fetchError}</p>)}
        <StaffList userRole={userRole} />
      </div>
    </Panel>

  );
};

export default Staffs;