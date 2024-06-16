import React, { useState, useContext, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import { UsersContext } from "../services/UserService";


export default function UserList() {

  const { getAllUsers, allUsers, usersCount } = useContext(UsersContext);

  let emptyUser = {
    id: null,
    full_name: '',
    company: '',
    job_title: '',
    business_phone: '',
    email: '',
    status: ''
  };

  const [users, setUsers] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const [item, setItem] = useState([]);
  const [tab, setTab] = useState("active");
  const { saveUser, adding, setIsAllUsers } = useContext(UsersContext);

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setIsAllUsers(true);
    console.log("user on save button click: ", user);

    try {
      await saveUser(user);
    } catch (err) {
      console.log(err);
    } finally {
      setUser({ ...user });
      setUserDialog(false);
      setUser(emptyUser);
      window.location.reload();
      /*if (user.full_name.trim()) {
          let _users = [...users];
          let _user = { ...user };
 
          if (user.id) {
              const index = findIndexById(user.id);
 
              _users[index] = _user;
              toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
          } else {
              //_user.id = createId();
              // _user.image = 'user-placeholder.svg';
              //_users.push(_user);
              toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
          }
 
          setUsers(_users);
          setUserDialog(false);
          setUser(emptyUser);
      }*/
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
    }
  };

  const editUser = (user) => {
    setUser({ ...user });
    setUserDialog(true);
  };

  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const { deleteUser } = useContext(UsersContext);
  const handleDeleteUser = async (id) => {
    //let _users = users.filter((val) => val.id !== user.id);
    console.log(id);
    try {
      await deleteUser(id);

      setUser({ ...user });
      // setUserDialog(true);
    } catch (error) {
      console.log(error);
    } finally {

      setUser({ ...user });
      setDeleteUserDialog(false);
      setUser(emptyUser);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    }

  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const deleteSelectedUsers = async () => {

    const idArray = selectedUsers.map(({ id }) => id);

    try {
      await deleteUser(idArray);
      setUser({ ...user });
      // setUserDialog(true);
    } catch (error) {
      console.log(error);
    } finally {
      setUser({ ...user });
      setDeleteUsersDialog(false);
      setSelectedUsers(null);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    }

  };

  const onStatusChange = (e) => {
    let _user = { ...user };
    _user['status'] = e.value;
    setUser(_user);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _user = { ...user };
    _user[`${name}`] = val;
    setUser(_user);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Users</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </IconField>
    </div>
  );

  const onRowEditComplete = (e) => {
    let _users = [...users];
    let { newData, index } = e;

    _users[index] = newData;

    setUsers(_users);
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null
  });

  let networkTimeout = null;

  useEffect(() => {
    loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
    setLoading(true);

    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }

    getAllUsers({ lazyEvent: JSON.stringify(lazyState) });
    setTotalUsers(usersCount);
    setLoading(false);

  };

  const { setRows, setFirst } = useContext(UsersContext);

  const onPage = (event) => {
    setlazyState(event);

    setFirst(event.first);
    setRows(event.rows);
  };

  const onSort = (event) => {
    setlazyState(event);
  };

  const onFilter = (event) => {
    event['first'] = 0;
    setlazyState(event);
  };

  const onSelectionChange = (event) => {
    const value = event.value;

    setSelectedCustomers(value);
    setSelectAll(value.length === totalUsers);
  };

  const onSelectAllChange = (event) => {
    const selectAll = event.checked;

    if (selectAll) {
      CustomerService.getCustomers().then((data) => {
        setSelectAll(true);
        setSelectedCustomers(data.customers);
      });
    } else {
      setSelectAll(false);
      setSelectedCustomers([]);
    }
  };

  return (

    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={allUsers} dataKey="id" lazy
          selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
          paginator rows={10} rowsPerPageOptions={[5, 10, 25]} totalRecords={usersCount} first={lazyState.first} onPage={onPage}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="full_name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="company" header="Company" sortable ></Column>
          <Column field="job_title" header="Title" sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="business_phone" header="Phone Number" sortable style={{ minWidth: '10rem' }}></Column>
          <Column field="email" header="Email" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="address" header="Address" sortable style={{ minWidth: '12rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
          {/*<Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
        </DataTable>

      </div>

      <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="User Details" modal className="p-fluid" onHide={hideDialog}>
        {/* {user.image && <img src={`https://primefaces.org/cdn/primereact/images/user/${user.image}`} alt={user.image} className="user-image block m-auto pb-3" />} */}
        <form onSubmit={handleSaveUser} >
          <div className="field">
            <label htmlFor="name" className="font-bold">User Title</label>
            <InputText id="full_name" value={user.full_name} onChange={(e) => onInputChange(e, 'full_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.full_name })} />
            {submitted && !user.full_name && <small className="p-error">User Title is required.</small>}
          </div>

          <div className="field">
            <label htmlFor="company" className="font-bold">Box Location</label>
            <InputText id="company" value={user.company} onChange={(e) => onInputChange(e, 'company')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.company })} />
          </div>

          <div className="field">
            <label htmlFor="job_title" className="font-bold">Department</label>
            <InputText id="job_title" value={user.job_title} onChange={(e) => onInputChange(e, 'job_title')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.job_title })} />
          </div>

          <div className="field">
            <label htmlFor="business_phone" className="font-bold">Box Content</label>
            <InputText id="business_phone" value={user.business_phone} onChange={(e) => onInputChange(e, 'business_phone')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.business_phone })} />
          </div>

          <div className="field">
            <label htmlFor="email" className="font-bold">Row</label>
            <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.email })} />
          </div>

          <div className="field">
            <label htmlFor="address" className="font-bold">Row</label>
            <InputText id="address" value={user.address} onChange={(e) => onInputChange(e, 'address')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.address })} />
          </div>

          <div className="p-dialog-footer pb-0">
            <Button label="Cancel" type="button" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" type="submit" icon="pi pi-check" />
          </div>

        </form>
      </Dialog>

     <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteUserDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {user && (
            <span>
              Are you sure you want to delete <b>{user.full_name}</b>?
            </span>
          )}
        </div>
        <div className="p-dialog-footer pb-0">
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => handleDeleteUser(user.id)} />
          {/* <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteUser} /> */}
        </div>
      </Dialog>

      {/* <Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}> */}
      <Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteUsersDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {user && <span>Are you sure you want to delete the {selectedUsers?.length} selected users?</span>}
        </div>
        <div className="p-dialog-footer pb-0">
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsersDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedUsers} />
        </div>
      </Dialog>
    </div>


  );
}
