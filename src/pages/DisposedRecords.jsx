import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// components
import DisposedRecordsTable from '../components/DisposedRecordsTable'

const DisposedRecords = () => {
    const { user } = useAuth();
    const [fetchError, setFetchError] = React.useState(null);

    return (
        <div className="container-flex" style={{ fontSize: "24px" }}>
            <h3 className="pl-3">Disposed Records</h3>
            {fetchError && (<p>{fetchError}</p>)}
            <DisposedRecordsTable />
        </div>

    );
};

export default DisposedRecords;