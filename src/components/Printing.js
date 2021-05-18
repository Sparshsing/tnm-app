import '../App.css';
import API from '../api-service'
import OrderForm from './OrderForm';
import GridCellExpand from './GridCellExpand'
import React, {useState, useEffect} from 'react'
import {isOverflown, DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, createChainedFunction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  th: {
    background:"black",
  }
});

//const getDetails = (params) => 

const columns = [
  { field: 'orderId', headerName: 'Id', width: 150, hide:true },
  { field: 'storeName', headerName: 'Store Name', width: 150 },
  { field: 'orderStatus', headerName: 'Order Status', width: 150 },
  // { field: 'details', headerName: 'Recipient|Order No|#', width: 150,
  //     valueGetter: getDetails,
  //     sortComparator: (v1, v2, cellParams1, cellParams2) =>
  //       getFullName(cellParams1).localeCompare(getFullName(cellParams2)),},
  { field: 'orderNo', headerName: 'Order No', width: 150 },
  { field: 'orderCount', headerName: 'Order Count', width: 150},
  { field: 'recipientName', headerName: 'Recipent Name', width: 150},
  { field: 'style', headerName: 'Style', width: 150 },
  { field: 'size', headerName: 'Size', width: 150 },
  { field: 'color', headerName: 'Color', width: 150 },
  { field: 'design', headerName: 'Design', width: 150 },
  { field: 'processing', headerName: 'Processing', width: 150 },
  { field: 'printed', headerName: 'Printed', width: 150 },
  { field: 'shipped', headerName: 'Shipped', width: 150 },
  { field: 'sfmNotes', headerName: 'SFM Notes', width: 150 },
  { field: 'giftMessages', headerName: 'Gift Messages', width: 150 },
  { field: 'productAvailability', headerName: 'Product Availability', width: 150 }
];

function Printing(){
  const classes = useStyles();
  
  // { id: 1, style: 'dummy1', size: 'dummy ' },
  // { id: 2, style: 'dummy2', size: 'dummy ' }
  const [orders, setOrders] = useState([]);
  
  const [token] = useCookies(['mr-token']);
  const [mode, setMode] = useState('none');
  const [open, setOpen] = useState(false);
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [myEditedRows, setMyEditedRows] = useState([]);
  
  const [message, setMessage] = useState('');
  

  const handleRowSelected = (s) => {
    console.log(s);
    let rows = [...s.api.current.getSelectedRows().values()];
    console.log('selected rows ere : ', rows);
    setMyEditedRows(rows);
  }

  const handleSpecialButtonsClick = (e) =>{
    console.log(e.currentTarget, e.currentTarget.dataset.oid);
    const oid = parseInt(e.currentTarget.dataset.oid);
    const btype = String(e.currentTarget.dataset.btype);
    let rowdata = orders.find(o => o.orderId == oid);
    let newRow ={};
    console.log(btype);
    if(btype=="processing"){
      const processing = rowdata.processing=='Y' ? 'N' : 'Y'
      console.log(processing);
      newRow = {...rowdata, processing}
    }
    if(btype=="printed"){
      const printed = rowdata.printed=='Y' ? 'N' : 'Y'
      console.log(printed);
      newRow = {...rowdata, printed}
    }
    if(btype=="shipped"){
      const shipped = rowdata.shipped=='Y' ? 'N' : 'Y'
      console.log(shipped);
      newRow = {...rowdata, shipped}
    }
      
    API.updateOrder(token['mr-token'], oid, newRow)
      .then(resp => {
        if(resp.status==200) return resp.json()
        else throw 'Something went wrong';
      })
      .then(data => {
        const updatedRows = orders.map((row) => {
          if (row.orderId == data.orderId)
            return data;          
          return row;
        });
        setMessage('updated order');
        console.log(updatedRows.map(x => x.orderId));
        setOrders(updatedRows)
      })
      .catch(err => {console.log('api error');console.error(err); setMessage('Something went wrong')})
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
      let rows = data.filter( d => d.orderStatus.toLowerCase()!='shipped');
      console.log('fetching orders');
      console.log(rows.map(r => r.orderId));
      rows.forEach((item, i) => item.id = item.orderId);

      const sortBy = [ 
        {prop:'storeName', direction: 1}, 
        {prop:'recipientName', direction: 1}, 
        {prop:'orderNo', direction: 1},
        {prop:'orderStatus', direction: 1}
      ];

      rows.sort(function(a,b){
        let i = 0, result = 0;
        while(i < sortBy.length && result === 0) {
          result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
          i++;
        }
        return result;
      })
      console.log(rows.map(r => r.orderId));
      setOrders(rows);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }

  useEffect( () => {    
    console.log(token);    
  }, [token]);

  let nextGroup = 0;

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <h3>Printing</h3>
      {message=='' ? '' : <div style={{color:"red"}}>{message}</div>}
      <Divider style={{  width: '100%', marginBottom: '15px' }}/>
      { mode=='none' ?
        <div>
          <Button style={{ width: '60px', marginBottom:'10px'}} color='primary' variant='contained' onClick={handleAddClick}>Add</Button>
          
            <div>
            <Button variant="outlined" color="primary" disabled={mySelectedRows.length>0 ? false:true} onClick={handleDeleteClick}>Delete</Button>
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
          
          {/*<div style={{  width: '100%', height: '450px', minWidth:'600px'}}>        
            <DataGrid rows={orders} columns={columns} checkboxSelection  components={{
              Toolbar: GridToolbar,
            }} disableSelectionOnClick={true} onSelectionModelChange={handleSelection} onRowSelected={handleRowSelected} onEditCellChangeCommitted={handleEditCellChangeCommitted} />
          </div>*/}
          <TableContainer component={Paper} style={{height: '500px'}}>
            <Table className={classes.table} size="small" aria-label="spanning table">
              <TableHead>                
                <TableRow>
                  <TableCell>Order Status</TableCell>
                  <TableCell align="right">Shop</TableCell>
                  <TableCell align="right">Recipient/Order/#</TableCell>
                  <TableCell align="right">Style</TableCell>
                  <TableCell align="right">Size</TableCell>
                  <TableCell align="right">Color</TableCell>
                  <TableCell align="right">Design</TableCell>
                  <TableCell align="right">Message</TableCell>
                  <TableCell align="right">Processed</TableCell>
                  <TableCell align="right">Printed</TableCell>
                  <TableCell align="right">Shipped</TableCell>
                  <TableCell align="right">Product Availability</TableCell>
                  <TableCell align="right">Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { orders.map((row, i, arr) => {
                  let showSpan = false;
                  if(i==nextGroup){
                    showSpan = true;
                    for(let j=i+1;j<arr.length; j++){
                      if(row.orderNo!=arr[j].orderNo || row.storeName!=arr[j].storeName 
                        || row.recipientName!=arr[j].recipientName || row.orderStatus!=arr[j].orderStatus){
                          nextGroup = j;
                          break;
                        }                        
                    }
                  }
                  return (
                    <TableRow key={row.orderId}>
                    {showSpan && <TableCell rowSpan={nextGroup-i}>{row.orderStatus}</TableCell>}
                    {showSpan && <TableCell rowSpan={nextGroup-i}>{row.storeName}</TableCell>}
                    {showSpan && <TableCell rowSpan={nextGroup-i}><div>{row.recipientName}</div><div>{row.orderNo}</div><div>{row.orderCount}</div></TableCell>}
                    <TableCell align="right">{row.style}</TableCell>
                    <TableCell align="right">{row.size}</TableCell>
                    <TableCell align="right">{row.color}</TableCell>
                    <TableCell align="right">{row.design}</TableCell>
                    <TableCell align="right" style={{  maxWidth: '100px'}}><GridCellExpand value={row.giftMessages} width={500}></GridCellExpand></TableCell>
                    <TableCell align="right"><Button onClick={handleSpecialButtonsClick} data-oid={row.orderId} data-btype={"processing"} color={row.processing=='Y' ? "primary" : "secondary"} variant="contained">{row.processing}</Button></TableCell>
                    <TableCell align="right"><Button onClick={handleSpecialButtonsClick} data-oid={row.orderId} data-btype={"printed"} color={row.printed=='Y' ? "primary" : "secondary"} variant="contained">{row.printed}</Button></TableCell>
                    <TableCell align="right"><Button onClick={handleSpecialButtonsClick} data-oid={row.orderId} data-btype={"shipped"} color={row.shipped=='Y' ? "primary" : "secondary"} variant="contained">{row.shipped}</Button></TableCell>
                    <TableCell align="right">{row.productAvailability}</TableCell>
                    <TableCell align="right">{row.sfmNotes}</TableCell>
                  </TableRow>);
                  })
                }                
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        :
        <OrderForm mode={mode} setMode={setMode}></OrderForm>
      }
    </div>
  );
}

export default Printing;
