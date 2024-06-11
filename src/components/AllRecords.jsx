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
import { ItemsContext } from "../services/RecordService";


const AllRecords = () => {

  const { getAllRecords, allRecords, loading } = useContext(ItemsContext);

    useEffect(() => {
      getAllRecords();
    }, []);

  let emptyRecord = {
    id: null,
    record_title: '',
    box_location: '',
    department: '',
    box_content: '',
    row: '',
    status: ''
  };

  const [record, setRecord] = useState(emptyRecord);
  const [records, setRecords] = useState(null);
  const [recordDialog, setRecordDialog] = useState(false);
  const [deleteRecordDialog, setDeleteRecordDialog] = useState(false);
  const [deleteRecordsDialog, setDeleteRecordsDialog] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const openNew = () => {
    setRecord(emptyRecord);
    setSubmitted(false);
    setRecordDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setRecordDialog(false);
  };

  const hideDeleteRecordDialog = () => {
    setDeleteRecordDialog(false);
  };

  const hideDeleteRecordsDialog = () => {
    setDeleteRecordsDialog(false);
  };

  const saveRecord = () => {
    setSubmitted(true);

    if (record.record_title.trim()) {
      let _records = [...records];
      let _record = { ...record };

      if (record.id) {
        const index = findIndexById(record.id);

        _records[index] = _record;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Updated', life: 3000 });
      } else {
        //_record.id = createId();
        _records.push(_record);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Created', life: 3000 });
      }

      setRecords(_records);
      setRecordDialog(false);
      setRecord(emptyRecord);
    }
  };

  const editRecord = (record) => {
    setRecord({ ...record });
    setRecordDialog(true);
  };

  const confirmDeleteRecord = (record) => {
    setRecord(record);
    setDeleteRecordDialog(true);
  };

  const deleteRecord = () => {
    let _records = records.filter((val) => val.id !== record.id);

    setRecords(_records);
    setDeleteRecordDialog(false);
    setRecord(emptyRecord);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < records.length; i++) {
      if (records[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return id;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteRecordsDialog(true);
  };

  const deleteSelectedRecords = () => {
    let _records = records.filter((val) => !selectedRecords.includes(val));

    setRecords(_records);
    setDeleteRecordsDialog(false);
    setSelectedRecords(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Records Deleted', life: 3000 });
  };

  const onStatusChange = (e) => {
    let _record = { ...record };

    _record['status'] = e.value;
    setRecord(_record);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _record = { ...record };

    _record[`${name}`] = val;

    setRecord(_record);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedRecords || !selectedRecords.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRecord(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteRecord(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Records</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </IconField>
    </div>
  );
  const recordDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveRecord} />
    </React.Fragment>
  );
  const deleteRecordDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRecordDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteRecord} />
    </React.Fragment>
  );
  const deleteRecordsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRecordsDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedRecords} />
    </React.Fragment>
  );

  const onRowEditComplete = (e) => {
    let _records = [...records];
    let { newData, index } = e;

    _records[index] = newData;

    setRecords(_records);
  };

  const rowIndexTemplate = (rowData, props) => {
    let index = parseInt(props.rowIndex + 1, 10);
    return (
      <React.Fragment>
        <span>{index}</span>
      </React.Fragment>
    );
  };

  return (

    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={allRecords} selection={selectedRecords} onSelectionChange={(e) => setSelectedRecords(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records" globalFilter={globalFilter} header={header}>
          {/* <Column field="id" header="#" sortable ></Column> */}
          <Column field="Index" header="" style={{ width: "3rem" }} body={rowIndexTemplate} />
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="record_title" header="Record Title" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="box_location" header="Box Location" sortable ></Column>
          <Column field="department" header="Department" sortable style={{ minWidth: '8rem' }}></Column>
          <Column field="box_content" header="Box Content" sortable style={{ minWidth: '10rem' }}></Column>
          <Column field="row" header="Row" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="status" header="Status" sortable style={{ minWidth: '12rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
          {/*<Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
        </DataTable>

      </div>

      <Dialog visible={recordDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Record Details" modal className="p-fluid" footer={recordDialogFooter} onHide={hideDialog}>
        {/* {record.image && <img src={`https://primefaces.org/cdn/primereact/images/record/${record.image}`} alt={record.image} className="record-image block m-auto pb-3" />} */}
        <div className="field">
          <label htmlFor="name" className="font-bold">Record Title</label>
          <InputText id="record_title" value={record.record_title} onChange={(e) => onInputChange(e, 'record_title')} required autoFocus className={classNames({ 'p-invalid': submitted && !record.record_title })} />
          {submitted && !record.record_title && <small className="p-error">Record Title is required.</small>}
        </div>

        <div className="field">
          <label htmlFor="box_location" className="font-bold">Box Location</label>
          <InputText id="box_location" value={record.box_location} onChange={(e) => onInputChange(e, 'box_location')} required autoFocus className={classNames({ 'p-invalid': submitted && !record.box_location })} />
        </div>

        <div className="field">
          <label htmlFor="department" className="font-bold">Department</label>
          <InputText id="department" value={record.department} onChange={(e) => onInputChange(e, 'department')} required autoFocus className={classNames({ 'p-invalid': submitted && !record.department })} />
        </div>

        <div className="field">
          <label htmlFor="box_content" className="font-bold">Box Content</label>
          <InputText id="box_content" value={record.box_content} onChange={(e) => onInputChange(e, 'box_content')} required autoFocus className={classNames({ 'p-invalid': submitted && !record.box_content })} />
        </div>

        <div className="field">
          <label htmlFor="row" className="font-bold">Row</label>
          <InputText id="row" value={record.row} onChange={(e) => onInputChange(e, 'row')} required autoFocus className={classNames({ 'p-invalid': submitted && !record.row })} />
        </div>

        <div className="field">
          <label className="mb-3 font-bold">Status</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category1" name="category" value="Active" onChange={onStatusChange} checked={record.status === 'Active'} />
              <label htmlFor="category1">Active</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category2" name="category" value="Digitized" onChange={onStatusChange} checked={record.status === 'Digitized'} />
              <label htmlFor="category2">Digitized</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category3" name="category" value="Disposed" onChange={onStatusChange} checked={record.status === 'Disposed'} />
              <label htmlFor="category3">Disposed</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category4" name="category" value="Inactive" onChange={onStatusChange} checked={record.status === 'Inactive'} />
              <label htmlFor="category4">Inactive</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category4" name="category" value="KIV" onChange={onStatusChange} checked={record.status === 'KIV'} />
              <label htmlFor="category4">KIV</label>
            </div>
          </div>
        </div>

      </Dialog>

      <Dialog visible={deleteRecordDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteRecordDialogFooter} onHide={hideDeleteRecordDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {record && (
            <span>
              Are you sure you want to delete <b>{record.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteRecordsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteRecordsDialogFooter} onHide={hideDeleteRecordsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {record && <span>Are you sure you want to delete the selected records?</span>}
        </div>
      </Dialog>
    </div>


  );
}

export default AllRecords