import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Panel } from 'primereact/panel';
// components
import DigitizedRecordsTable from '../components/DigitizedRecordsTable'
//import RecordsTable from '../components/RecordsTable'

const DigitizedRecords = () => {
  const { user } = useAuth();
  const [fetchError, setFetchError] = React.useState(null);

  return (
    <Panel>
      <div className="container-flex" style={{ fontSize: "24px" }}>
        <h3 className="pl-3">Digitized Records</h3>
        {fetchError && (<p>{fetchError}</p>)}
        <DigitizedRecordsTable recordType="digitized"/>
      </div>
    </Panel>

  );
};

export default DigitizedRecords;