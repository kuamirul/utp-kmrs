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


export default function recordsTable({ recordType }) {

  const { getRecords, recordsList, recordsCount, setRecordType } = useContext(ItemsContext);

  let emptyRecord = {
    id: null,
    record_title: '',
    box_location: '',
    department: '',
    box_content: '',
    row: '',
    status: ''
  };

  const [records, setRecords] = useState(null);
  const [recordDialog, setRecordDialog] = useState(false);
  const [deleteRecordDialog, setDeleteRecordDialog] = useState(false);
  const [deleteRecordsDialog, setDeleteRecordsDialog] = useState(false);
  const [record, setRecord] = useState(emptyRecord);
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

  const [item, setItem] = useState([]);
  const [tab, setTab] = useState("active");
  const { saveRecord, adding } = useContext(ItemsContext);

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("record on save button click: ", record);

    try {
      await saveRecord(record);
    } catch (err) {
      console.log(err);
    } finally {
      setRecord({ ...record });
      setRecordDialog(false);
      setRecord(emptyRecord);

      if (record.id) {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Updated', life: 3000 });
      } else {
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Created', life: 3000 });
      }

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

  const { deleteRecord } = useContext(ItemsContext);
  const handleDeleteRecord = async (id) => {
    //let _records = records.filter((val) => val.id !== record.id);
    console.log(id);
    try {
      await deleteRecord(id);

      setRecord({ ...record });
      // setRecordDialog(true);
    } catch (error) {
      console.log(error);
    } finally {

      setRecord({ ...record });
      setDeleteRecordDialog(false);
      setRecord(emptyRecord);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Record Deleted', life: 3000 });
    }

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

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteRecordsDialog(true);
  };

  const deleteSelectedRecords = async () => {

    const idArray = selectedRecords.map(({ id }) => id);

    try {
      await deleteRecord(idArray);
      setRecord({ ...record });
      // setRecordDialog(true);
    } catch (error) {
      console.log(error);
    } finally {
      setRecord({ ...record });
      setDeleteRecordsDialog(false);
      setSelectedRecords(null);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Records Deleted', life: 3000 });
    }

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

  const [statuses] = useState(['Active', 'Disposed', 'Digitized', 'Inactive', 'KIV']);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={getStatus(rowData)}></Tag>;
  };

  const getStatus = (record) => {
    switch (record.status) {
      case 'Active':
        return 'Active';

      case 'Digitized':
        return 'Digitized';

      case 'Disposed':
        return 'Disposed';

      case 'Inactive':
        return 'Inactive';

      case 'KIV':
        return 'KIV';

      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Records</h4>
      {/* <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </IconField> */}
    </div>
  );

  const onRowEditComplete = (e) => {
    let _records = [...records];
    let { newData, index } = e;

    _records[index] = newData;

    setRecords(_records);
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };


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
      record_title: { value: '', matchMode: 'contains' },
      box_location: { value: '', matchMode: 'contains' },
      department: { value: '', matchMode: 'contains' },
      box_content: { value: '', matchMode: 'contains' },
      row: { value: '', matchMode: 'contains' },
      status: { value: '', matchMode: 'contains' }
    }
  });

  let networkTimeout = null;

  useEffect(() => {
    setRecordType(recordType);
    loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
    setLoading(true);

    if (networkTimeout) {
      clearTimeout(networkTimeout);
    }
    // TODO EXPORT CONST RECORD FROM SERVICE
    getRecords(recordType, { lazyEvent: JSON.stringify(lazyState) });
    setTotalRecords(recordsCount);
    setLoading(false);

  };

  const { setRows, setFirst } = useContext(ItemsContext);

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
    setSelectAll(value.length === totalRecords);
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

        <DataTable 
          ref={dt} value={recordsList} dataKey="id" lazy
          selection={selectedRecords} onSelectionChange={(e) => setSelectedRecords(e.value)}
          paginator rows={10} rowsPerPageOptions={[5, 10, 25]} totalRecords={recordsCount} first={lazyState.first} onPage={onPage}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records" 
          onFilter={onFilter} filters={lazyState.filters}  filterDisplay="row" 
          header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          {/* <Column field="id" header="#" sortable ></Column> */}
          <Column field="record_title" header="Record Title" sortable filter filterPlaceholder="Search" style={{ minWidth: '16rem' }}></Column>
          <Column field="box_location" header="Box Location" filter filterPlaceholder="Search" sortable ></Column>
          <Column field="department" header="Department" sortable filter filterPlaceholder="Search" style={{ minWidth: '8rem' }}></Column>
          <Column field="box_content" header="Box Content" sortable filter filterPlaceholder="Search" style={{ minWidth: '10rem' }}></Column>
          <Column field="row" header="Row" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          <Column field="status" header="Status" sortable filter filterPlaceholder="Search" style={{ minWidth: '12rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
          {/*<Column rowEditor={allowEdit} headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column> */}
        </DataTable>

        {/* https://primereact.org/datatable/#lazy_load */}
        {/* value={customers} lazy filterDisplay="row" dataKey="id" paginator
            first={lazyState.first} rows={10} totalRecords={totalRecords} onPage={onPage}
            onSort={onSort} sortField={lazyState.sortField} sortOrder={lazyState.sortOrder}
            onFilter={onFilter} filters={lazyState.filters} loading={loading} tableStyle={{ minWidth: '75rem' }}
            selection={selectedCustomers} onSelectionChange={onSelectionChange} selectAll={selectAll} onSelectAllChange={onSelectAllChange} */}

      </div>

      <Dialog visible={recordDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Record Details" modal className="p-fluid" onHide={hideDialog}>
        {/* {record.image && <img src={`https://primefaces.org/cdn/primereact/images/record/${record.image}`} alt={record.image} className="record-image block m-auto pb-3" />} */}
        <form onSubmit={handleSaveRecord} >
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

          {/* <div className="field">
                    <label className="mb-3 font-bold">Status</label>
                        <div className="formgrid grid">
                        <Dropdown
                            value={getStatus(record.status)}
                            options={statuses}
                            //onChange={(e) => record.editorCallback(e.value)}
                            onChange={(e) => setSelectedStatus(e.value)}
                            placeholder="Select a Status"
                            itemTemplate={(record) => {
                                return <Tag value={record} severity={getStatus(record)}></Tag>;
                            }}
                        />
                        </div>
                    </div> */}

          <div className="p-dialog-footer pb-0">
            {/* <Button label="Submit" type="submit" className="p-button-rounded p-button-success mr-2 mb-2" /> */}
            <Button label="Cancel" type="button" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" type="submit" icon="pi pi-check" />
          </div>

        </form>
      </Dialog>

      {/* <Dialog visible={deleteRecordDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteRecordDialogFooter} onHide={hideDeleteRecordDialog}> */}
      <Dialog visible={deleteRecordDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteRecordDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {record && (
            <span>
              Are you sure you want to delete <b>{record.record_title}</b>?
            </span>
          )}
        </div>
        <div className="p-dialog-footer pb-0">
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRecordDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={() => handleDeleteRecord(record.id)} />
          {/* <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteRecord} /> */}
        </div>
      </Dialog>

      {/* <Dialog visible={deleteRecordsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteRecordsDialogFooter} onHide={hideDeleteRecordsDialog}> */}
      <Dialog visible={deleteRecordsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal onHide={hideDeleteRecordsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {record && <span>Are you sure you want to delete the {selectedRecords?.length} selected records?</span>}
        </div>
        <div className="p-dialog-footer pb-0">
          <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteRecordsDialog} />
          <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedRecords} />
        </div>
      </Dialog>
    </div>


  );
}
