import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Panel } from 'primereact/panel';
import { useAdmin } from "../context/AdminProvider";

// components
import UserList from '../components/UserList'

const Users = () => {
  const { user, userRole } = useAuth();
  // const { userRole } = useAdmin();
  const [fetchError, setFetchError] = React.useState(null);

  return (
    <Panel>
      <div className="container-flex" style={{ fontSize: "24px" }}>
        <h3 className="pl-3">User Details</h3>
        {fetchError && (<p>{fetchError}</p>)}
        <UserList userRole={userRole} />
      </div>
    </Panel>

  );
};

export default Users;