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
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
import { StaffsContext } from "../services/StaffService";


export default function StaffList() {

  const { getAllStaffs, allStaffs, staffsCount, departmentOptions, selectedDepartmentVal, setSelectedDepartment } = useContext(StaffsContext);

  let emptyStaff = {
    id: null,
    full_name: '',
    department: 0,
    business_phone: '',
    email: ''
  };

  const [staffs, setStaffs] = useState(null);
  const [staffDialog, setStaffDialog] = useState(false);
  const [deleteStaffDialog, setDeleteStaffDialog] = useState(false);
  const [deleteStaffsDialog, setDeleteStaffsDialog] = useState(false);
  const [staff, setStaff] = useState(emptyStaff);
  const [selectedStaffs, setSelectedStaffs] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const openNew = () => {
    setStaff(emptyStaff);
    setSubmitted(false);
    setStaffDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setStaffDialog(false);
  };

  const hideDeleteStaffDialog = () => {
    setDeleteStaffDialog(false);
  };

  const hideDeleteStaffsDialog = () => {
    setDeleteStaffsDialog(false);
  };

  const [item, setItem] = useState([]);
  const [tab, setTab] = useState("active");
  const { saveStaff, adding, setIsAllStaffs } = useContext(StaffsContext);

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setIsAllStaffs(true);
    console.log("staff on save button click: ", staff);

    try {
      await saveStaff(staff);
    } catch (err) {
      console.log(err);
    } finally {
      setStaff({ ...staff });
      setStaffDialog(false);
      setStaff(emptyStaff);
      window.location.reload();
      /*if (staff.full_name.trim()) {
          let _staffs = [...staffs];
          let _staff = { ...staff };
 
          if (staff.id) {
              const index = findIndexById(staff.id);
 
              _staffs[index] = _staff;
              toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Staff Updated', life: 3000 });
          } else {
              //_staff.id = createId();
              // _staff.image = 'staff-placeholder.svg';
              //_staffs.push(_staff);
              toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Staff Created', life: 3000 });
          }
 
          setStaffs(_staffs);
          setStaffDialog(false);
          setStaff(emptyStaff);
      }*/
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Staff Updated', life: 3000 });
    }
  };

  const editStaff = (staff) => {
    setStaff({ ...staff });
    setStaffDialog(true);
  };

  const confirmDeleteStaff = (staff) => {
    setStaff(staff);
    setDeleteStaffDialog(true);
  };

  const { deleteStaff } = useContext(StaffsContext);
  const handleDeleteStaff = async (id) => {
    //let _staffs = staffs.filter((val) => val.id !== staff.id);
    console.log(id);
    try {
      await deleteStaff(id);

      setStaff({ ...staff });
      // setStaffDialog(true);
    } catch (error) {
      console.log(error);
    } finally {

      setStaff({ ...staff });
      setDeleteStaffDialog(false);
      setStaff(emptyStaff);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Staff Deleted', life: 3000 });
    }

  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < staffs.length; i++) {
      if (staffs[i].id === id) {
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
    setDeleteStaffsDialog(true);
  };

  const deleteSelectedStaffs = async () => {

    const idArray = selectedStaffs.map(({ id }) => id);

    try {
      await deleteStaff(idArray);
      setStaff({ ...staff });
      // setStaffDialog(true);
    } catch (error) {
      console.log(error);
    } finally {
      setStaff({ ...staff });
      setDeleteStaffsDialog(false);
      setSelectedStaffs(null);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Staffs Deleted', life: 3000 });
    }

  };

  const onStatusChange = (e) => {
    let _staff = { ...staff };
    _staff['status'] = e.value;
    setStaff(_staff);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _staff = { ...staff };
    _staff[`${name}`] = val;
    setStaff(_staff);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedStaffs || !selectedStaffs.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editStaff(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteStaff(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Staffs</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </IconField>
    </div>
  );

  const onRowEditComplete = (e) => {
    let _staffs = [...staffs];
    let { newData, index } = e;

    _staffs[index] = newData;

    setStaffs(_staffs);
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const [loading, setLoading] = useState(false);
  const [totalStaffs, setTotalStaffs] = useState(0);
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

    getAllStaffs({ lazyEvent: JSON.stringify(lazyState) });
    setTotalStaffs(staffsCount);
    setLoading(false);

  };

  const { setRows, setFirst } = useContext(StaffsContext);

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
    setSelectAll(value.length === totalStaffs);
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

  const op = useRef(null);

  const onDepartmentSelect = (e) => {
    setSelectedDepartment(e.value);
    setUser({ ...user, department: e.value.id }); // Assign selected department's id to record.department
    op.current.hide();
  };

  return (

    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={allStaffs} dataKey="id" 
          selection={selectedStaffs} onSelectionChange={(e) => setSelectedStaffs(e.value)}
          paginator rows={10} rowsPerPageOptions={[5, 10, 25]} totalRecords={staffsCount} first={lazyState.first} onPage={onPage}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="full_name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="department" header="Department" sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="business_phone" header="Phone Number" sortable style={{ minWidth: '10rem' }}></Column>
          <Column field="email" header="Email" sortable style={{ minWidth: '12rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
          {/*<Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
        </DataTable>

      </div>

      <Dialog visible={staffDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Staff Details" modal className="p-fluid" onHide={hideDialog}>
        {/* {staff.image && <img src={`https://primefaces.org/cdn/primereact/images/staff/${staff.image}`} alt={staff.image} className="staff-image block m-auto pb-3" />} */}
        <form onSubmit={handleSaveStaff} >
          <div className="field">
            <label htmlFor="name" className="font-bold">Staff Title</label>
            <InputText id="full_name" value={staff.full_name} onChange={(e) => onInputChange(e, 'full_name')} required autoFocus className={classNames({ 'p-invalid': submitted && !staff.full_name })} />
            {submitted && !staff.full_name && <small className="p-error">Staff Title is required.</small>}
          </div>

          <div className="field">
            <label htmlFor="department" className="font-bold">Department</label>
            <InputNumber id="department" value={staff.department} onChange={(e) => onInputChange(e, 'department')} required showButtons min={0} max={100} autoFocus className={classNames({ 'p-invalid': submitted && !staff.department })} />
            <Button type="button" label="List of Departments" icon="pi pi-search" outlined onClick={(e) => op.current.toggle(e)} />
            <OverlayPanel ref={op} showCloseIcon closeOnEscape dismissable>
                    <DataTable value={departmentOptions} dataKey="id" selectionMode="single" selection={selectedDepartmentVal} onSelectionChange={onDepartmentSelect} >
                        <Column field="id" header="ID" />
                        <Column field="department" header="Description"  />
                    </DataTable>
            </OverlayPanel>
          </div>

          <div className="field">
            <label htmlFor="business_phone" className="font-bold">Phone Number</label>
            <InputText id="business_phone" value={staff.business_phone} onChange={(e) => onInputChange(e, 'business_phone')} required autoFocus className={classNames({ 'p-invalid': submitted && !staff.business_phone })} />
          </div>

          <div className="field">
            <label htmlFor="email" className="font-bold">Email</label>
            <InputText id="email" value={staff.email} onChange={(e) => onInputChange(e, 'email')} disabled autoFocus className={classNames({ 'p-invalid': submitted && !staff.email })} />
          </div>

          <div className="p-dialog-footer pb-0">
            <Button label="Cancel" type="button" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" type="submit" icon="pi pi-check" />
          </div>

        </form>
      </Dialog>

     <Dialog visible={deleteStaffDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteStaffDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {staff && (
            <span>
              Are you sure you want to delete <b>{staff.full_name}</b>?
            </span>
          )}
        </div>
        <div className="p-dialog-footer pb-0">
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteStaffDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => handleDeleteStaff(staff.id)} />
          {/* <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteStaff} /> */}
        </div>
      </Dialog>

      {/* <Dialog visible={deleteStaffsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteStaffsDialogFooter} onHide={hideDeleteStaffsDialog}> */}
      <Dialog visible={deleteStaffsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteStaffsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {staff && <span>Are you sure you want to delete the {selectedStaffs?.length} selected staffs?</span>}
        </div>
        <div className="p-dialog-footer pb-0">
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteStaffsDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedStaffs} />
        </div>
      </Dialog>
    </div>


  );
}
