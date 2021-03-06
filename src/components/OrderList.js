import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider, MenuItem, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, createChainedFunction, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import OrderForm from './OrderForm';
import OrderUpdateForm from './OrderUpdateForm';
import GridCellExpand from './GridCellExpand';
import AuthenticationService from '../authentication-service';


const formatDate = (dt) => {
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yy = String(dt.getFullYear()).substr(2,2);
  return mm + '/' + dd + '/' + yy;
}

const formatDateTime = (dt) => {
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yy = String(dt.getFullYear()).substr(2,2);
  const hh = String(dt.getHours()).padStart(2, '0');
  const minutes = String(dt.getMinutes()).padStart(2, '0');
  return mm + '/' + dd + '/' + yy + ' ' + hh + ':' + minutes;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const useStyles = makeStyles({
  root: {
    '& .cold': {
      backgroundColor: '#b9d5ff91',
      color: '#1a3e72',
    },
    '& .hot': {
      backgroundColor: '#ff943975',
      color: '#1a3e72',
    },
    '& .compactcell': {
      padding: '0px 8px'
    },
  },
  searchInput: {
    marginRight: '4px'
  }
});

// function renderCellExpand(params) {
//   return (
//     <GridCellExpand
//       value={params.value ? params.value.toString() : ''}
//       width={300}
//     />
//   );
// }

const columns = [
  { field: 'orderId', headerName: 'Id', width: 60, cellClassName: 'compactcell', },
  { field: 'storeName', headerName: 'Store Name', width: 150, cellClassName: 'compactcell',
    renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />)},
  { field: 'orderStatus', headerName: 'Status', cellClassName: 'compactcell', width: 110 },
  { field: 'saleDate', headerName: 'Sale Date', cellClassName: 'compactcell', type: 'date', editable:true, width: 120,
      valueFormatter: (params) => { if(params.value) return formatDate(new Date(params.value))}},
  { field: 'orderNo', headerName: 'Order No', cellClassName: 'compactcell', width: 150 },
  { field: 'orderCount', headerName: 'Count', cellClassName: 'compactcell', width: 60, headerClassName: 'compactcell', },
  { field: 'recipientName', headerName: 'Recipient Name', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />), cellClassName: 'compactcell' },
  { field: 'style', headerName: 'Style', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />), cellClassName: 'compactcell'},
  { field: 'size', headerName: 'Size', width: 80, cellClassName: 'compactcell' },
  { field: 'color', headerName: 'Color', width: 110, renderCell: (params) => (<GridCellExpand limit={10} value={params.value ? params.value.toString() : ''} width={300} />), cellClassName: 'compactcell' },
  { field: 'design', headerName: 'Design', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />), cellClassName: 'compactcell' },
  { field: 'productAvailability', headerName: 'Product Availability', width: 120, cellClassName: 'compactcell' },
  { field: 'processing', headerName: 'Processing', width: 80 , cellClassName: 'compactcell'},
  { field: 'printed', headerName: 'Printed', width: 80, cellClassName: 'compactcell' },
  { field: 'shipped', headerName: 'Shipped', width: 90, cellClassName: 'compactcell' },
  { field: 'sfmNotes', headerName: 'SFM Notes', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={500} />), cellClassName: 'compactcell' },
  { field: 'buyerName', headerName: 'Buyer Name', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />), cellClassName: 'compactcell'},
  { field: 'buyerEmail', headerName: 'Buyer Email', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={500} />), cellClassName: 'compactcell' },
  { field: 'buyerComments', headerName: 'Buyer Comments', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={500} />), cellClassName: 'compactcell' },
  { field: 'giftMessages', headerName: 'Gift Messages', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />), cellClassName: 'compactcell' },
  { field: 'sfmId', headerName: 'SFM ID', width: 300, renderCell: (params) => (<GridCellExpand limit={28} value={params.value ? params.value.toString() : ''} width={400} />), cellClassName: 'compactcell' },
  { field: 'sku', headerName: 'SKU', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />), cellClassName: 'compactcell' },
  { field: 'shipDate', headerName: 'Ship Date', type: 'datetime', editable:true, width: 150, cellClassName: 'compactcell',
    valueFormatter: (params) => { if(params.value) return formatDateTime(new Date(params.value))} },
  { field: 'priorityShip', headerName: 'Priority Ship', width: 110, editable:true, cellClassName: 'compactcell'  },
  { field: 'customerPaidShipping', headerName: 'Customer Paid Shipping', width: 150, type: 'number', cellClassName: 'compactcell',
    editable:true,
    valueFormatter: ({ value }) => currencyFormatter.format(Number(value))
  },
  { field: 'trackingNumber', headerName: 'Tracking Number', width: 200, editable:true, cellClassName: 'compactcell'}
];

function OrderList(props){
  const classes = useStyles();

  const [orders, setOrders] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [token] = useCookies(['mr-token']);
  const [mode, setMode] = useState('none');
  const [open, setOpen] = useState(false);
  const [totalcount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [myEditedRows, setMyEditedRows] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [selectedShippingFile, setSelectedShippingFile] = useState(null);
  const [isShippingFilePicked, setIsShippingFilePicked] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const usertype = props.usertype;

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
      console.log("ship file is: ", event.target.files[0]);
      event.target.labels[0].textContent = event.target.files[0].name
      setIsShippingFilePicked(true);
    }
    else{
      setSelectedShippingFile(null);
      setIsShippingFilePicked(false);
    }
	};

  const handleRowSelected = (s) => {
    // console.log(s);
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
        // console.log('cell commit after ', updatedRows);
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
            setMessage(result['msg']);
            console.log(result['msg']);
          }
          else{
            setMessage(result['msg'] + ' (see error records in admin panel logs, or in console (hit Ctrl+Shift+i)');
            console.log('Following rows were not imported: ');
            console.log(result['errors']);
          }
        }
				else setMessage('Failed import due to unknown reason');
        setIsFilePicked(false);
        setSelectedFile(null);
        setIsShippingFilePicked(false);
        setSelectedShippingFile(null);
        fetchlist();
        setMode('none');
			})
			.catch((error) => {
				console.error('Error:', error);
        setIsFilePicked(false);
        setSelectedFile(null);
        setIsShippingFilePicked(false);
        setSelectedShippingFile(null);
        setMessage('Failed import due to unknown reasons');
			});
	};

  const handleAddClick = (e) => {setMode('add')}
  const handleUpdateClick = (e) => {setMode('update')}
  const handleDeleteClick = (e) => {setOpen(true)}
  const handleClose = (e) => {setOpen(false)}
  const handleDeleteConfirm = (e) => {
    console.log('confirmed delete');
    let errors = [];
    const deletRows = async () => {
      for(let rowId of mySelectedRows){
        try{
          const resp = await API.deleteOrder(token['mr-token'], rowId);
          if(resp.status==200 || resp.status==204){
            console.log(`deleted order with id ${rowId}`);
          }          
          else{
            console.log(`Failed to delete order with id ${rowId}`);
            throw `Failed to delete order with id ${rowId}`;
          }
        }
        catch(e){
          console.error(`could not delete order id ${rowId}`, e);
          errors.push(`could not delete order id ${rowId}`);
        }
      }

      if(errors.length>0)
        setMessage('Some rows were not deleted\n' + errors.toString() + ' Please refresh');
      else
        setMessage('Deleted successfully. Please refresh');
    }
    setOpen(false);
    deletRows();
    
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
      
  }, [mode, token, page]
  );

  // useEffect(() => {
  //   updateSearchFilteredOrders(searchString);      
  // }, [orders]
  // );

  function fetchlist(fromSearchBar=false){
    if(fromSearchBar && page!=0){
      setPage(0);
      return;
    }
    console.log('fetching details');
    let urlparams;
    if(searchString){
      urlparams = new URLSearchParams({page: page+1, search: searchString});
    }        
    else
      urlparams = new URLSearchParams({page: page+1});
    setLoading(true);
    API.getOrderList(token['mr-token'], urlparams)
    .then(resp => {
      if(resp.status==200) return resp.json();
      if(resp.status==401) AuthenticationService.handleUnauthorized();
      throw 'Something went wrong';    
    })
    .then(data => {
      //console.log(data); 
      
      
      if(data['results']){
        if(totalcount != data['count'])
          setPage(0);
        console.log('setting count', data['count'])
        setTotalCount(data['count']);
        data['results'].forEach((item, i) => item.id = item.orderId);
        setOrders(data['results']);    
      }
      else{
        console.error('error getting data')
        console.error(data['detail'])
        console.log('setting count', data['count'])
        setPage(0);
        setTotalCount(0);
        setOrders([]);        
      }
      setLoading(false);
    })
    .catch(e => {console.log("api error"); console.error(e); setLoading(false);});
  }

  // const updateSearchFilteredOrders = (theSearchString) =>{
  //   let rows = [...orders];
  //   if(theSearchString!='')
  //       rows = rows.filter(r => {
  //         const str = theSearchString.toLowerCase()
  //         return r.orderStatus.toLowerCase().search(str)>=0 ||
  //         r.style.toLowerCase().search(str)>=0 ||
  //         r.orderNo.toLowerCase().search(str)>=0 ||
  //         r.storeName.toLowerCase().search(str)>=0 ||
  //         r.recipientName.toLowerCase().search(str)>=0 ||
  //         r.design.toLowerCase().search(str)>=0 ||
  //         r.size.toLowerCase().search(str)>=0 ||
  //         r.color.toLowerCase().search(str)>=0;
  //       })
  //   setMySelectedRows([]);
  //   setMyEditedRows([]);
  //   setSearchFilteredOrders(rows);
  // }

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      {message=='' ? '' : <div style={{color:"red"}}>{message}</div>}
      { mode=='none' ?
        <div>
          {usertype==0 && 
            <div>
            <IconButton color='primary' variant='contained' onClick={handleAddClick}><AddCircleIcon /></IconButton>
            <IconButton color='primary' variant='contained' disabled={mySelectedRows.length==1 && (myEditedRows[0].shipped=='N' || myEditedRows[0].printed=='N' || myEditedRows[0].processing=='N') ? false:true} onClick={handleUpdateClick}><EditIcon /></IconButton>
            </div>
          }
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
            <form ><input type="file" name="myfile" id="myfile" onChange={fileChangeHandler} hidden></input><label htmlFor="myfile" className="file-input-label">Choose File</label><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Orders</Button></form>
            <form ><input type="file" name="myShippingfile" id="myShippingfile" onChange={shippingFileChangeHandler} hidden></input><label htmlFor="myShippingfile" className="file-input-label">Choose File</label><Button type="submit" disabled={!isShippingFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Shipping Info</Button></form>
            <div>
                <TextField variant="outlined" size="small" margin="none" type="text" value={searchString} className={classes.searchInput} text='Search' onChange={(e) => setSearchString(e.target.value)} onKeyPress={e => e.key=="Enter" && fetchlist(true)}></TextField>
                <Button color="primary" variant="contained" onClick={e => fetchlist(true)}>Search</Button>
            </div>
            </div>
          }
          <div style={{ width: '100%', padding: "5px",  height: "calc(100vh - 110px)", minWidth:'600px'}} className={classes.root}>        
            <DataGrid
              rows={orders} columns={columns}
              loading={loading}
              checkboxSelection 
              components={{ Toolbar: GridToolbar,}}
              density='compact'
              disableSelectionOnClick={true}
              onSelectionModelChange={handleSelection}
              onRowSelected={handleRowSelected}
              onEditCellChangeCommitted={handleEditCellChangeCommitted}
              disableColumnMenu={true}
              pagination
              page={page}
              pageSize = {50}
              rowsPerPageOptions={[]}
              rowCount = {totalcount}
              paginationMode="server"
              onPageChange={(params) => {
                setPage(params.page);
              }}
              getRowClassName={(params) =>{
                if(params.row.productAvailability=="Short" || params.row.productAvailability=="Out Of Stock")
                return 'hot'
              }                
              }
            />
          </div>
        </div>
        :
        (mode=='add' ? 
          <OrderForm mode={mode} setMode={setMode} usertype={usertype}></OrderForm>
          :
          <OrderUpdateForm id={mySelectedRows[0]} mode={mode} setMode={setMode} usertype={usertype}></OrderUpdateForm>
        )
        
      }
    </div>
  );
}

export default OrderList;
