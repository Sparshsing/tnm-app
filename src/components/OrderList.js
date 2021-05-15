import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';
import OrderForm from './OrderForm';

const columns = [
  { field: 'storeName', headerName: 'Store Name', width: 150 },
  { field: 'orderStatus', headerName: 'Order Status', width: 150 },
  { field: 'saleDate', headerName: 'Sale Date', width: 150 },
  { field: 'orderNo', headerName: 'Order No', width: 150 },
  { field: 'orderCount', headerName: 'Order Count', width: 150 },
  { field: 'recipientName', headerName: 'Recipent Name', width: 150 },
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
  { field: 'shipDate', headerName: 'Ship Date', width: 150 },
  { field: 'priorityShip', headerName: 'Priority Ship', width: 150 },
  { field: 'customerPaidShipping', headerName: 'Customer Paid Shipping', width: 150 },
  { field: 'trackingNumber', headerName: 'Tracking Number', width: 150 },
  { field: 'productAvailability', headerName: 'Product Availability', width: 150 }
];

function OrderList(){
  
  // { id: 1, style: 'dummy1', size: 'dummy ' },
  // { id: 2, style: 'dummy2', size: 'dummy ' }
  const [orders, setOrders] = useState([]);
  
  const [token] = useCookies(['mr-token']);
  const [mode, setMode] = useState('none');
  const [open, setOpen] = useState(false);
  const [mySelectedRows, setMySelectedRows] = useState([]);

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedShippingFile, setSelectedShippingFile] = useState();
  const [isShippingFilePicked, setIsShippingFilePicked] = useState(false);
  const [message, setMessage] = useState('');

	const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
    console.log("file is: ", event.target.files[0])
		setIsFilePicked(true);
	};

  const shippingFileChangeHandler = (event) => {
		setSelectedShippingFile(event.target.files[0]);
    console.log("file is: ", event.target.files[0])
		setIsShippingFilePicked(true);
	};

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
    if(mode=='none')
      fetchlist()
  }, [mode, token]
  );

  function fetchlist(){
    API.getOrderList(token['mr-token'])
    .then(data => {
      console.log(data); 
      data.forEach((item, i) => item.id = item.orderId);
      
      return setOrders(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }

  useEffect( () => {    
    console.log(token);    
  }, [token]);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <h3>Orders</h3>
      {message=='' ? '' : <div style={{color:"red"}}>{message}</div>}
      <Divider style={{  width: '100%', marginBottom: '15px' }}/>
      { mode=='none' ?
        <div>
          <Button style={{ width: '60px', marginBottom:'10px'}} color='primary' variant='contained' onClick={handleAddClick}>Add</Button>
          { mySelectedRows.length>0 && 
            <div>
            <Button variant="outlined" color="primary" onClick={handleDeleteClick}>Delete</Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">"Are you sure you want to delete the {mySelectedRows.length} items"</DialogTitle>
              
              <DialogActions>
                <Button onClick={handleClose} color="primary">Cancel</Button>
                <Button onClick={handleDeleteConfirm} color="primary" autoFocus>Confirm</Button>
              </DialogActions>
            </Dialog>
            </div>
          }
          <form ><TextField type="file" name="myfile" onChange={fileChangeHandler}></TextField><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Order Details</Button></form>
          <form ><TextField type="file" name="myShippingfile" onChange={shippingFileChangeHandler}></TextField><Button type="submit" disabled={!isShippingFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Shipping Details</Button></form>
          <div style={{  width: '100%', height: '450px', minWidth:'600px'}}>        
            <DataGrid rows={orders} columns={columns} checkboxSelection  components={{
              Toolbar: GridToolbar,
            }} onSelectionModelChange={handleSelection} />
          </div>
        </div>
        :
        <OrderForm mode={mode} setMode={setMode}></OrderForm>
      }
    </div>
  );
}

export default OrderList;
