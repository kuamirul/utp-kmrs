
import React from 'react';
import { TieredMenu } from 'primereact/tieredmenu';
//import { useRouter } from 'next/router';
import { useAuth } from "../context/AuthProvider";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";


import { useLocation } from 'react-router-dom';


  


export default function RouterDemo() {
    //const router = useRouter();
    const items = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            url: '/',
        },
        {
            label: 'Request List',
            icon: 'pi pi-briefcase',
            url: '/request-list',
        },
        {
            label: 'User Details',
            icon: 'pi pi-cog',
            command: () => {
                <Link to={`/user-details`}></Link>
            }
        },
        {
            label: 'Staff Details',
            icon: 'pi pi-cog',
            url: '/staff-details',
        },
        {
            label: 'UTP Records',
            icon: 'pi pi-cog',
            url: '/utp-records',
        },
        {
            label: 'Digitized Records',
            icon: 'pi pi-cog',
            url: '/digitized-records',
        },
        {
            label: 'Disposed Records',
            icon: 'pi pi-cog',
            url: '/disposed-records',
        },
        {
            label: 'Record Management Guideline',
            icon: 'pi pi-cog',
            url: '/record-management-guideline',
        },
    ];

    let location = useLocation();
    console.log(location);

    return (
        <TieredMenu model={items} breakpoint="767px" />
    )
}
