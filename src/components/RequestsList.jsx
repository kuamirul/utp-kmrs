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
import { RequestsContext } from "../services/RequestService";


export default function requestsTable({ email }) {

  const { getRequests, requestsList, requestsCount, setRequestType, getDepartment, departmentOptions, setDepartmentOptions, userDepartment } = useContext(RequestsContext);

  let emptyRequest = {
    id: null,
    title: '',
    records_description: '',
    customer: null,
    assigned_to: null,
    department: 0,
    status: 0
  };

  const [requests, setRequests] = useState(null);
  const [requestDialog, setRequestDialog] = useState(false);
  const [deleteRequestDialog, setDeleteRequestDialog] = useState(false);
  const [deleteRequestsDialog, setDeleteRequestsDialog] = useState(false);
  const [request, setRequest] = useState(emptyRequest);
  const [selectedRequests, setSelectedRequests] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [departments, setDepartments] = useState([]);

  const openNew = () => {
    setRequest(emptyRequest);
    setSubmitted(false);
    setIsEditing(false);
    setRequestDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setRequestDialog(false);
  };

  const hideDeleteRequestDialog = () => {
    setDeleteRequestDialog(false);
  };

  const hideDeleteRequestsDialog = () => {
    setDeleteRequestsDialog(false);
  };

  const [item, setItem] = useState([]);
  const [tab, setTab] = useState("active");
  const { saveRequest, adding } = useContext(RequestsContext);

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("request on save button click: ", request);

    try {
      await saveRequest(request);
    } catch (err) {
      console.log(err);
    } finally {
      setRequest({ ...request });
      setRequestDialog(false);
      setRequest(emptyRequest);

      if (request.id) {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Updated', life: 3000 });
      } else {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Created', life: 3000 });
      }

    }
  };

  const findDepartmentId = (departmentName) => {
    const foundDepartment = departmentOptions.find(dept => dept.department === departmentName);
    return foundDepartment ? foundDepartment.id : null; // Handle case where department is not found
  };

  const findStatusId = (statusName) => {
    // Access the ID directly using property notation
    return statusLookup[statusName] || null; // Handle case where status is not found
  };

  const editRequest = (request) => {
    setIsEditing(true);
    const updatedRequest = { ...request };
    updatedRequest.department = findDepartmentId(request.department);
    updatedRequest.status = findStatusId(request.status);
    setRequest(updatedRequest);
    setRequestDialog(true);
  };

  const confirmDeleteRequest = (request) => {
    setRequest(request);
    setDeleteRequestDialog(true);
  };

  const { deleteRequest } = useContext(RequestsContext);
  const handleDeleteRequest = async (id) => {
    //let _requests = requests.filter((val) => val.id !== request.id);
    console.log(id);
    try {
      await deleteRequest(id);

      setRequest({ ...request });
      // setRequestDialog(true);
    } catch (error) {
      console.log(error);
    } finally {

      setRequest({ ...request });
      setDeleteRequestDialog(false);
      setRequest(emptyRequest);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
    }

  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteRequestsDialog(true);
  };

  const deleteSelectedRecords = async () => {

    const idArray = selectedRequests.map(({ id }) => id);

    try {
      await deleteRequest(idArray);
      setRequest({ ...request });
      // setRequestDialog(true);
    } catch (error) {
      console.log(error);
    } finally {
      setRequest({ ...request });
      setDeleteRequestsDialog(false);
      setSelectedRequests(null);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Records Deleted', life: 3000 });
    }

  };

  const onStatusChange = (e) => {
    let _request = { ...request };
    _request['status'] = statusLookup[e.value.toString()];  //statusLookup is an object, not an array. access the ID directly using property notation. .find method will not work 
    setRequest(_request);
  };

  const statusLookup = {
    "To Dispose": 6,
    "To Digitize": 7
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _request = { ...request };
    _request[`${name}`] = val;
    setRequest(_request);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRequests || !selectedRequests.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRequest(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteRequest(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Requests</h4>
      {/* <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </IconField> */}
    </div>
  );

  // https://stackblitz.com/run?file=src%2Fservice%2FCustomerService.jsx,src%2FApp.jsx
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectAll, setSelectAll] = useState(false);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      request_title: { value: '', matchMode: 'contains' },
      box_location: { value: '', matchMode: 'contains' },
      department: { value: '', matchMode: 'contains' },
      status: { value: '', matchMode: 'contains' }
    }
  });

  let networkTimeout = null;

  useEffect(() => {
    // setRequestType(requestType);
    // fetchDepartments();
    loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
    setLoading(true);

    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }

    getRequests(email, { lazyEvent: JSON.stringify(lazyState) });
    setTotalRecords(requestsCount);
    setLoading(false);
  };

  const { setRows, setFirst } = useContext(RequestsContext);

  const onPage = (event) => {
    setlazyState(event);

    setFirst(event.first);
    setRows(event.rows);
  };

  const onSort = (event) => {
    setlazyState(event);
  };

  const fetchDepartments = async () => {
    try {
      const departmentData = await getDepartment(email); // Call the service function
      setDepartments(departmentData);
    } catch (error) {
      console.error(error);
    }
  };

  const onFilter = (event) => {
    event['first'] = 0;
    setlazyState(event);
  };

  const onSelectionChange = (event) => {
    const value = event.value;

    setSelectedCustomers(value);
    setSelectAll(value.length === totalRecords);
  };

  return (

    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable
          ref={dt} value={requestsList} dataKey="id" lazy
          selection={selectedRequests} onSelectionChange={(e) => setSelectedRequests(e.value)}
          paginator rows={10} rowsPerPageOptions={[5, 10, 25]} totalRecords={requestsCount} first={lazyState.first} onPage={onPage}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} requests"
          onFilter={onFilter} filters={lazyState.filters} filterDisplay="row"
          header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          {/* <Column field="id" header="#" sortable ></Column> */}

          <Column field="title" header="Request Title" sortable filter filterPlaceholder="Search" style={{ minWidth: '16rem' }}></Column>
          <Column field="records_description" header="Box Location" filter filterPlaceholder="Search" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="profiles.full_name" header="Requester" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          <Column field="profiles2.full_name" header="Assigned To" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          <Column field="department" header="Department" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          <Column field="status" header="Status" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          {/* <Column field="priority" header="Priority" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column> */}
          {/* <Column field="category" header="Category" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          <Column field="due_date" header="Due Date" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          <Column field="title" header="Request Title" sortable filter filterPlaceholder="Search" style={{ minWidth: '16rem' }}></Column>
          <Column field="department" header="Department" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          <Column field="records_description" header="Box Content" filter filterPlaceholder="Search" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="status" header="Status" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column> */}
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
          {/*<Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
        </DataTable>

      </div>

      <Dialog visible={requestDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Request Details" modal className="p-fluid" onHide={hideDialog}>
        <form onSubmit={handleSaveRecord} >

          <div className="field">
            <label htmlFor="requester" className="font-bold">Requester: {email}</label>
            {/* <InputText id="requester" value={email} onChange={(e) => onInputChange(e, 'title')} disabled autoFocus className={classNames({ 'p-invalid': submitted && !request.request_title })} />
            {submitted && !request.title && <small className="p-error">Request Title is required.</small>} */}
          </div>

          <div className="field">
            <label htmlFor="department" className="font-bold">Department:
              {isEditing ? (request.department || 'No department available')
                : (userDepartment && userDepartment[0] && userDepartment[0].department
                  ? userDepartment[0].department.department
                  : "No department available")}
            </label>
          </div>

          <div className="field">
            <label htmlFor="title" className="font-bold">Request Title</label>
            <InputText id="title" value={request.title} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !request.request_title })} />
            {submitted && !request.title && <small className="p-error">Request Title is required.</small>}
          </div>

          <div className="field">
            <label htmlFor="records_description" className="font-bold">Box Location</label>
            <InputText id="records_description" value={request.records_description} onChange={(e) => onInputChange(e, 'records_description')} required autoFocus className={classNames({ 'p-invalid': submitted && !request.records_description })} />
          </div>

          <div className="field">
            <label className="mb-3 font-bold">Transfer to Record Center</label>
            <div className="formgrid grid">
              <div className="field-radiobutton col-6">
                <RadioButton inputId="category2" name="category" value="To Digitize" onChange={onStatusChange} checked={request.status === 7} />
                <label htmlFor="category2">To Digitize</label>
              </div>
              <div className="field-radiobutton col-6">
                <RadioButton inputId="category3" name="category" value="To Dispose" onChange={onStatusChange} checked={request.status === 6} />
                <label htmlFor="category3">To Dispose</label>
              </div>
            </div>
          </div>

          <div className="p-dialog-footer pb-0">
            {/* <Button label="Submit" type="submit" className="p-button-rounded p-button-success mr-2 mb-2" /> */}
            <Button label="Cancel" type="button" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" type="submit" icon="pi pi-check" />
          </div>

        </form>
      </Dialog>

      {/* <Dialog visible={deleteRequestDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteRequestDialogFooter} onHide={hideDeleteRequestDialog}> */}
      <Dialog visible={deleteRequestDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteRequestDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {request && (
            <span>
              Are you sure you want to delete <b>{request.request_title}</b>?
            </span>
          )}
        </div>
        <div className="p-dialog-footer pb-0">
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRequestDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => handleDeleteRequest(request.id)} />
          {/* <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteRequest} /> */}
        </div>
      </Dialog>

      {/* <Dialog visible={deleteRequestsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteRequestsDialogFooter} onHide={hideDeleteRequestsDialog}> */}
      <Dialog visible={deleteRequestsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteRequestsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {request && <span>Are you sure you want to delete the {selectedRequests?.length} selected requests?</span>}
        </div>
        <div className="p-dialog-footer pb-0">
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRequestsDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedRecords} />
        </div>
      </Dialog>
    </div>


  );
}
