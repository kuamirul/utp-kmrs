import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { supabase } from "../supabaseClient";
import { classNames } from 'primereact/utils';
//import { ProductService } from './service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primeicons/primeicons.css';
        

const CaseCard = () => {

  //const [data, _setData] = React.useState(() => [...record])
  //const rerender = React.useReducer(() => ({}), {})[1]
  const [fetchError, setFetchError] = React.useState(null);
  //const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .range(0, 9)

      if (error) {
        setFetchError('Could not fetch the cases')
        setCases(null)
      }
      if (data) {
        //setCases(data)
        setProducts(data)
        setFetchError(null)
      }
    }

    fetchRecords()

  }, [])

  let emptyProduct = {
    id: null,
    record_title: '',
    box_location: '',
    department: '',
    box_content: '',
    row: '',
    status: ''
  };

  const [cases, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  /*useEffect(() => {
    ProductService.getProducts().then((data) => setProducts(data));
  }, []);*/

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (product.record_title.trim()) {
      let _records = [...cases];
      let _record = { ...product };

      if (product.id) {
        const index = findIndexById(product.id);

        _records[index] = _record;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      } else {
        _record.id = createId();
        // _record.image = 'product-placeholder.svg';
        _records.push(_record);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      setProducts(_records);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _records = cases.filter((val) => val.id !== product.id);

    setProducts(_records);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cases.length; i++) {
      if (cases[i].id === id) {
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
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _records = cases.filter((val) => !selectedProducts.includes(val));

    setProducts(_records);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
  };

  const onCategoryChange = (e) => {
    let _record = { ...product };

    _record['category'] = e.value;
    setProduct(_record);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _record = { ...product };

    _record[`${name}`] = val;

    setProduct(_record);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _record = { ...product };

    _record[`${name}`] = val;

    setProduct(_record);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  const imageBodyTemplate = (rowData) => {
    return <img src={`https://primefaces.org/cdn/primereact/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData)}></Tag>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  };

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
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
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
      <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
    </React.Fragment>
  );

  const onRowEditComplete = (e) => {
    let _records = [...cases];
    let { newData, index } = e;

    _records[index] = newData;

    setProducts(_records);
  };

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  };

  const statusEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Status"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const allowEdit = (rowData) => {
    return rowData.name !== 'Blue Band';
  };

  return (


    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={cases} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} cases" globalFilter={globalFilter} header={header}>
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="id" header="#" sortable ></Column>
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

      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Record Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        {/* {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />} */}
        <div className="field">
          <label htmlFor="name" className="font-bold">Record Title</label>
          <InputText id="record_title" value={product.record_title} onChange={(e) => onInputChange(e, 'record_title')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.record_title })} />
          {submitted && !product.record_title && <small className="p-error">Record Title is required.</small>}
        </div>

        <div className="field">
          <label htmlFor="box_location" className="font-bold">Box Location</label>
          <InputText id="box_location" value={product.box_location} onChange={(e) => onInputChange(e, 'box_location')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.box_location })} />
        </div>

        <div className="field">
          <label htmlFor="department" className="font-bold">Department</label>
          <InputText id="department" value={product.department} onChange={(e) => onInputChange(e, 'department')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.department })} />
        </div>

        <div className="field">
          <label htmlFor="box_content" className="font-bold">Box Content</label>
          <InputText id="box_content" value={product.box_content} onChange={(e) => onInputChange(e, 'box_content')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.box_content })} />
        </div>

        <div className="field">
          <label htmlFor="row" className="font-bold">Row</label>
          <InputText id="row" value={product.row} onChange={(e) => onInputChange(e, 'row')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.row })} />
        </div>

        <div className="field">
          <label className="mb-3 font-bold">Status</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category1" name="category" value="Active" onChange={onCategoryChange} checked={product.status === 'Active'} />
              <label htmlFor="category1">Active</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category2" name="category" value="Digitized" onChange={onCategoryChange} checked={product.status === 'Digitized'} />
              <label htmlFor="category2">Digitized</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category3" name="category" value="Disposed" onChange={onCategoryChange} checked={product.status === 'Disposed'} />
              <label htmlFor="category3">Disposed</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category4" name="category" value="Inactive" onChange={onCategoryChange} checked={product.status === 'Inactive'} />
              <label htmlFor="category4">Inactive</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton inputId="category4" name="category" value="KIV" onChange={onCategoryChange} checked={product.status === 'KIV'} />
              <label htmlFor="category4">KIV</label>
            </div>
          </div>
        </div>

 
      </Dialog>

      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.name}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>Are you sure you want to delete the selected cases?</span>}
        </div>
      </Dialog>
    </div>


  );
}

export default CaseCard