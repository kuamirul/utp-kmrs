import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { supabase } from "../supabaseClient";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const Home = () => {
  const { user } = useAuth();
  const [fetchError, setFetchError] = React.useState(null);

  return (
    <div className="container-flex" style={{ fontSize: "24px" }}>
      <h3 className="pl-3">Welcome user {user.email}  </h3>
    </div>
  );
};

export default Home;