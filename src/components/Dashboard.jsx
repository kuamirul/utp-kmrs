import React, { useState, useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client'
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import { supabase } from "../supabaseClient";

export default function dashboard({ email, userRole }) {

    const [recordsCount, setRecordsCount] = useState(0);
    const [digitizedCount, setDigitizedCount] = useState(0);
    const [disposedCount, setDisposedCount] = useState(0);
    const [requestsCount, setRequestsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const getUserDepartment = async (email) => {
            try {
                let query = supabase
                    .from('profiles')
                    .select('department')
                    .eq('email', email)
                    .single();

                const { error, data } = await query

                if (error) throw error;
                if (data) {
                    return data;
                }

            } catch (error) {
                console.log(error.error_description || error.message);
            }
        };

        const getRecords = async (recordType, email, userRole) => {
            try {
                let query = supabase
                    .from('records')
                    .select('*', { count: 'exact', head: true })

                if (userRole === 'user') {
                    const userDepartment = await getUserDepartment(email);
                    query = query.eq("department", userDepartment.department)
                }

                if (recordType === 2 || recordType === 3) {
                    query = query.eq("status", recordType)
                }

                const { error, count } = await query

                if (error) throw error;

                if (count) {
                    if (recordType === 0) setRecordsCount(count);
                    else if (recordType === 2) setDigitizedCount(count);
                    else if (recordType === 3) setDisposedCount(count);
                }

            } catch (error) {
                console.log(error.error_description || error.message);
            } finally {
                setLoading(false);
            }
        };

        const getRequests = async (email, userRole) => {
            try {
                let query = supabase
                    .from('requests')
                    .select('*', { count: 'exact', head: true })

                if (userRole === 'user') {
                    const userDepartment = await getUserDepartment(email);
                    query = query.eq("department", userDepartment.department)
                }

                const { error, count } = await query

                if (error) throw error;

                if (count) setRequestsCount(count);

            } catch (error) {
                console.log(error.error_description || error.message);
            } finally {
                setLoading(false);
            }
        };

        getRecords(0, email, userRole);
        getRecords(3, email, userRole);
        getRecords(2, email, userRole);
        getRequests(email, userRole);

    });

    return (

        <div className="grid p-5">
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3 text-xl">All Requests</span>
                            <div className="text-900 font-medium text-xl">{requestsCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-list text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3 text-xl">All Records</span>
                            <div className="text-900 font-medium text-xl">{recordsCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-orange-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3 text-xl">Digitized Records</span>
                            <div className="text-900 font-medium text-xl">{digitizedCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-desktop text-cyan-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3 text-xl">Disposed Records</span>
                            <div className="text-900 font-medium text-xl">{disposedCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-trash text-purple-500 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}