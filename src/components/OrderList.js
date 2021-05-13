import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider, Button, TextField } from '@material-ui/core';
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
  const [mySelectedRows, setMySelectedRows] = useState([]);

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [message, setMessage] = useState('');

	const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
    console.log("file is: ", event.target.files[0])
		setIsFilePicked(true);
	};

	const handleUpload = (e) => {
    const formData = new FormData();

		formData.append('ordersFile', selectedFile);

		API.uploadOrdersFile(token['mr-token'], formData)
			.then((response) => response.json())
			.then((result) => {
        if(result['errors']){
          console.log('Success but with following errors: ');
          console.log(result['errors']);
          if(result['errors'].length=0)
            setMessage('Successfully imported all records');
          else
            setMessage('Partial Success (see error records in console (hit Ctrl+Shift+i)');
        }
				else setMessage('Failed import due to unknown reason');
        setMode('none');
			})
			.catch((error) => {
				console.error('Error:', error);
        setMessage('Failed import due to unknown reasons');
			});
	};

  const handleAddClick = (e) => {setMode('add')}

  const handleSelection = (items) => {
    console.log(items);    
    setMySelectedRows(items.selectionModel);    
  }

  useEffect(() => {
    API.getOrderList(token['mr-token'])
    .then(data => {
      console.log(data); 
      data.forEach((item, i) => item.id = item.orderId);
      
      return setOrders(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }, [mode, token]
  );

  useEffect( () => {    
    console.log(token);    
  }, [token]);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <h3>Orders</h3>
      {message=='' ? '' : <div>{message}</div>}
      <Divider style={{  width: '100%', marginBottom: '15px' }}/>
      { mode=='none' ?
        <div>
          <Button style={{ width: '60px', marginBottom:'10px'}} color='primary' variant='contained' onClick={handleAddClick}>Add</Button>
          <form ><TextField type="file" name="myfile" onChange={fileChangeHandler}></TextField><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import</Button></form>
          <div style={{  width: '100%', minWidth:'600px'}}>        
            <DataGrid rows={orders} columns={columns} checkboxSelection autoHeight={true} components={{
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
