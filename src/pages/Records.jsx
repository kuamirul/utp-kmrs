import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useAdmin } from "../context/AdminProvider";
import { supabase } from "../supabaseClient";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Panel } from 'primereact/panel';

import RecordsTable from '../components/RecordsTable'

const Records = () => {
  const { user } = useAuth();
  const { userRole } = useAdmin();
  const [fetchError, setFetchError] = React.useState(null);

  return (
    <Panel>
      <div className="container-flex" style={{ fontSize: "24px" }}>
        <h3 className="pl-3">UTP Records </h3>
        {fetchError && (<p>{fetchError}</p>)}
        <RecordsTable recordType="" user={user.id} email={user.email} userRole={userRole} />
      </div>
    </Panel>


  );
};

export default Records;