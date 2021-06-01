import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider, MenuItem, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, createChainedFunction, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import OrderForm from './OrderForm';
import OrderUpdateForm from './OrderUpdateForm';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const columns = [
  { field: 'orderId', headerName: 'Order Id', width: 150 },
  { field: 'storeName', headerName: 'Store Name', width: 150 },
  { field: 'orderStatus', headerName: 'Order Status', width: 150 },
  { field: 'saleDate', headerName: 'Sale Date', type: 'date', editable:true, width: 150 },
  { field: 'orderNo', headerName: 'Order No', width: 150 },
  { field: 'orderCount', headerName: 'Order Count', width: 150 },
  { field: 'recipientName', headerName: 'Recipent Name', width: 150, editable:true },
  { field: 'style', headerName: 'Style', width: 150 },
  { field: 'size', headerName: 'Size', width: 150 },
  { field: 'color', headerName: 'Color', width: 150 },
  { field: 'design', headerName: 'Design', width: 150 },
  { field: 'processing', headerName: 'Processing', width: 150 },
  { field: 'printed', headerName: 'Printed', width: 150 },
  { field: 'shipped', headerName: 'Shipped', width: 150 },
  { field: 'sfmNotes', headerName: 'SFM Notes', width: 150 },
  { field: 'buyerName', headerName: 'Buyer Name', width: 150 },
  { field: 'buyerEmail', headerName: 'Buyer Email', width: 150 },
  { field: 'buyerComments', headerName: 'Buyer Comments', width: 150 },
  { field: 'giftMessages', headerName: 'Gift Messages', width: 150 },
  { field: 'sfmId', headerName: 'SFM ID', width: 150 },
  { field: 'sku', headerName: 'SKU', width: 150 },
  { field: 'shipDate', headerName: 'Ship Date', type: 'datetime', editable:true, width: 150 },
  { field: 'priorityShip', headerName: 'Priority Ship', width: 150, editable:true  },
  { field: 'customerPaidShipping', headerName: 'Customer Paid Shipping', width: 150, type: 'number',
    editable:true,
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value))
  },
  { field: 'trackingNumber', headerName: 'Tracking Number', width: 150, editable:true },
  { field: 'productAvailability', headerName: 'Product Availability', width: 150 }
];

function OrderList(props){
  
  // { id: 1, style: 'dummy1', size: 'dummy ' },
  // { id: 2, style: 'dummy2', size: 'dummy ' }
  const [orders, setOrders] = useState([]);
  
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);
  const [mode, setMode] = useState('none');
  const [open, setOpen] = useState(false);
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [myEditedRows, setMyEditedRows] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedShippingFile, setSelectedShippingFile] = useState(null);
  const [isShippingFilePicked, setIsShippingFilePicked] = useState(false);
  const [message, setMessage] = useState('');

  const usertype = parseInt(userInfo['mr-user'].split('-')[1]);

	const fileChangeHandler = (event) => {
    console.log(event);
    if(event.target.files.length==1){
      setSelectedFile(event.target.files[0]);
      console.log("order file is: ", event.target.files[0]);
      event.target.labels[0].textContent = event.target.files[0].name
      setIsFilePicked(true);
    }
    else{
      setSelectedFile(null);
      setIsFilePicked(false);
    }
		
	};

  const shippingFileChangeHandler = (event) => {
    if(event.target.files.length==1){
      setSelectedShippingFile(event.target.files[0]);
      console.log("ship file is: ", event.target.files[0])
      setIsShippingFilePicked(true);
    }
    else{
      setSelectedShippingFile(null);
      setIsShippingFilePicked(false);
    }
	};

  const handleRowSelected = (s) => {
    console.log(s);
    let rows = [...s.api.current.getSelectedRows().values()];
    console.log('selected rows ere : ', rows);
    setMyEditedRows(rows);
  }

  const handleMassUpdate = (e) => {
    console.log('updating the orders', myEditedRows);

    async function updateTheOrders(){
      let updateErrors = []
      for(let row of myEditedRows){
        try{
          const updateOrdersAsync = async () => { return API.updateOrder(token['mr-token'], row.orderId, row)}
          let resp = await updateOrdersAsync();
          if(resp.status==200){
            console.log(`updated order with id ${row.orderId}`);
          }
          else if(resp.status==400){
            console.log(`Invalid Update for order with id ${row.orderId}`);
            let result = await resp.json()
            let orderId = row.orderId
            updateErrors.push({orderId, result});
          }
          else
            throw "server error";
        }
        catch(err){
          console.log(`Something went wrong for order id ${row.orderId}`);
          console.error(err);
          updateErrors.push(`Something went wrong for order id ${row.orderId}`);
        }
      }

      if(updateErrors.length>0)
        setMessage('Some rows were not updated\n' + JSON.stringify(updateErrors));
      else
        setMessage('Updated successfully');
    }

    updateTheOrders();
      
      //fetchlist();
  }

  // needed to update myEditedRows if cell value changed after selection
  const handleEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
        console.log('cell commit', myEditedRows, props);
        const data = props; // Fix eslint value is missing in prop-types for JS files
        const updatedRows = myEditedRows.map((row) => {
          const obj = {};
          obj[field] = data.value;
          if (row.orderId === id) {
            return { ...row, ...obj};
          }
          return row;
        });
        setMyEditedRows(updatedRows);
        console.log('cell commit after ', updatedRows);
    },
    [myEditedRows],
  );

	const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if(isFilePicked && selectedFile.name.search(/order/i) == -1){
      setMessage('Please make sure you have selected orders file. File name should contain the word order');
      return;
    }

    if(isShippingFilePicked && selectedShippingFile.name.search(/ship/i) == -1){
      setMessage('Please make sure you have selected shipping file. File name should contain the word ship');
      return;
    }

    let res

    if(isFilePicked){
      formData.append('ordersFile', selectedFile);
		  res = API.uploadOrdersFile(token['mr-token'], formData)
    }

    else if(isShippingFilePicked){
      formData.append('shippingFile', selectedShippingFile);
		  res = API.uploadShippingFile(token['mr-token'], formData)
    }

    else{
      setMessage('Please select a file');
      return;
    }
		
			res.then((response) => response.json())
			.then((result) => {
        if(result['errors']){          
          if(result['errors'].length==0){
            setMessage('Successfully imported all records');
            console.log('Successfully imported all records');
          }
          else{
            setMessage('Partial Success (see error records in console (hit Ctrl+Shift+i)');
            console.log('Following rows were not imported: ');
            console.log(result['errors']);
          }
        }
				else setMessage('Failed import due to unknown reason');
        setIsFilePicked('fasle');
        fetchlist();
        setMode('none');
			})
			.catch((error) => {
				console.error('Error:', error);
        setMessage('Failed import due to unknown reasons');
			});
	};

  const handleAddClick = (e) => {setMode('add')}
  const handleUpdateClick = (e) => {setMode('update')}
  const handleDeleteClick = (e) => {setOpen(true)}
  const handleClose = (e) => {setOpen(false)}
  const handleDeleteConfirm = (e) => {
    console.log('u confirmed delete');
      mySelectedRows.forEach( rowId => {
        API.deleteOrder(token['mr-token'], rowId)
        .then( resp => {
          if(resp.status==200 || resp.status==204)
            console.log(`deleted order with id ${rowId}`);
          else
            console.log(`Failed to delete order with id ${rowId}`);
        })
        .catch(e => console.error(`could not delete order id ${rowId}`, e))
      });
      setOpen(false);
  }

  const handleSelection = (items) => {
    console.log(items);    
    setMySelectedRows(items.selectionModel);    
  }

  useEffect(() => {
    props.setTitle('Orders');
    if(mode=='none'){
      setMySelectedRows([]);
      setMyEditedRows([]);
      console.log('inside useeffect');
      fetchlist()
    }
      
  }, [mode, token]
  );

  function fetchlist(){
    console.log('fetching details');
    API.getOrderList(token['mr-token'])
    .then(data => {
      console.log(data); 
      data.forEach((item, i) => item.id = item.orderId);
      
      return setOrders(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      {message=='' ? '' : <div style={{color:"red"}}>{message}</div>}
      { mode=='none' ?
        <div>
          {usertype==0 && <IconButton style={{ marginBottom:'10px'}} color='primary' variant='contained' disabled={mySelectedRows.length==1 && myEditedRows[0].processing=='N'? false:true} onClick={handleUpdateClick}><EditIcon /></IconButton>}
          {usertype!=0 && <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row'}}>
            <IconButton style={{ width: '60px'}} color='primary' variant='contained' onClick={handleAddClick}><AddCircleIcon /></IconButton>
            <IconButton color='primary' variant='contained' disabled={mySelectedRows.length==1 ? false:true} onClick={handleUpdateClick}><EditIcon /></IconButton>
            <div>
              <IconButton variant="outlined" color="secondary" disabled={mySelectedRows.length>0 ? false:true} onClick={handleDeleteClick}><DeleteIcon /></IconButton>
              <Dialog
                open={open}
                onClose={handleClose}                
              >
                <DialogTitle id="alert-dialog-title">"Are you sure you want to delete the {mySelectedRows.length} items"</DialogTitle>
                
                <DialogActions>
                  <Button onClick={handleClose} color="primary">Cancel</Button>
                  <Button onClick={handleDeleteConfirm} color="primary" autoFocus>Confirm</Button>
                </DialogActions>
              </Dialog>
            </div>
            <Button variant="contained" color="primary" disabled={myEditedRows.length>0 ? false:true} onClick={handleMassUpdate}>Mass Update</Button>
            <form ><input type="file" name="myfile" id="myfile" onChange={fileChangeHandler} hidden></input><label htmlFor="myfile" className="file-input-label">Choose File</label><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Order Details</Button></form>
            <form ><input type="file" name="myShippingfile" id="myShippingfile" onChange={shippingFileChangeHandler} hidden></input><label htmlFor="myShippingfile" className="file-input-label">Choose File</label><Button type="submit" disabled={!isShippingFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Shipping Details</Button></form>
          </div>}
          <div style={{ width: '100%', padding: "5px",  height: "calc(100vh - 100px)", minWidth:'600px'}}>        
            <DataGrid rows={orders} columns={columns} checkboxSelection  components={{
              Toolbar: GridToolbar,
            }} disableSelectionOnClick={true} onSelectionModelChange={handleSelection} onRowSelected={handleRowSelected} onEditCellChangeCommitted={handleEditCellChangeCommitted} />
          </div>
        </div>
        :
        (mode=='add' ? 
          <OrderForm mode={mode} setMode={setMode}></OrderForm>
          :
          <OrderUpdateForm id={mySelectedRows[0]} mode={mode} setMode={setMode}></OrderUpdateForm>
        )
        
      }
    </div>
  );
}

export default OrderList;
