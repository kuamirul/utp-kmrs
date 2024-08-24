import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Panel } from 'primereact/panel';  

import Dashboard from '../components/Dashboard'

const Home = () => {
  const { user, userRole } = useAuth();
  const [fetchError, setFetchError] = React.useState(null);

  // Card ref:  https://refine.dev/blog/building-react-admin-panel-with-primereact-and-refine/#create-recentsales-component
  return (
    <Panel>
      <div className="container-flex" style={{ fontSize: "24px" }}>
        <h3 className="pl-3">Welcome user {user.email}  </h3>
      </div>
      <Dashboard user={user.id} email={user.email} userRole={userRole} />
    </Panel>

  );
};

export default Home;