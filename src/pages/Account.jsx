import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';

// components
import UserProfile from '../components/UserProfile'

const Account = () => {
  const { user } = useAuth();
  const [fetchError, setFetchError] = React.useState(null);

  return (
    <Panel>
      <div className="container-flex" style={{ fontSize: "24px" }}>
        <h3 className="pl-3">User Details</h3>
        {fetchError && (<p>{fetchError}</p>)}
        <UserProfile />
      </div>
    </Panel>


  );
};

export default Account;