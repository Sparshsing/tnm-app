import '../App.css';
import API from '../api-service'
import OrderForm from './OrderForm';
import OrderUpdateForm from './OrderUpdateForm';
import GridCellExpand from './GridCellExpand';
import React, {useState, useEffect} from 'react';
import {isOverflown, DataGrid, GridToolbar, GridRowsProp, GridColDef, useGridContainerProps } from '@material-ui/data-grid';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { Divider, Button, Checkbox, Dialog, DialogActions, DialogTitle, TextField, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import EmailIcon from '@material-ui/icons/Email';
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
  headcell: {
    fontWeight: "bold",
    fontSize: "1rem",
    padding: "6px"
  },
  redbtn: {
    color: "white",
    background: "red",
    float: "right"
  },
  greenbtn: {
    color: "white",
    background: "green",
    float: "right"
  },
  tablecell: {
    padding: "6px"
  }


});

//const getDetails = (params) => 

const columns = [
  { field: 'orderId', headerName: 'Id', width: 150, hide:true },
  { field: 'storeName', headerName: 'Store Name', width: 150 },
  { field: 'displayStatus', headerName: 'Status', width: 150 },
  // { field: 'details', headerName: 'Recipient|Order No|#', width: 150,
  //     valueGetter: getDetails,
  //     sortComparator: (v1, v2, cellParams1, cellParams2) =>
  //       getFullName(cellParams1).localeCompare(getFullName(cellParams2)),},
  { field: 'orderNo', headerName: 'Order No', width: 150 },
  { field: 'orderCount', headerName: 'Order Count', width: 150},
  { field: 'recipientName', headerName: 'Recipent Name', width: 150},
  { field: 'style', headerName: 'Style', width: 350 },
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

function Printing(props){

  const classes = useStyles();
  
  // { id: 1, style: 'dummy1', size: 'dummy ' },
  // { id: 2, style: 'dummy2', size: 'dummy ' }
  const [orders, setOrders] = useState([]);
  const [searchFilteredOrders, setSearchFilteredOrders] = useState([]);
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);
  const [mode, setMode] = useState('none');
  const [open, setOpen] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [myEditedRows, setMyEditedRows] = useState([]);
  
  const [message, setMessage] = useState('');

  const handleCheckboxClick = (e) =>{
    const oid = parseInt(e.target.dataset.oid)
    console.log(oid);
    console.log(e.target.checked);
    let checkedRows = [];
    if(e.target.checked) 
      checkedRows = [...mySelectedRows, oid]
    else{
      const index = mySelectedRows.indexOf(oid);
      if (index > -1)
        mySelectedRows.splice(index, 1);
      checkedRows = [...mySelectedRows];
    }
    console.log(checkedRows);
    setMySelectedRows(checkedRows)
  }

  // const handleRowSelected = (s) => {
  //   console.log(s);
  //   let rows = [...s.api.current.getSelectedRows().values()];
  //   console.log('selected rows ere : ', rows);
  //   setMyEditedRows(rows);
  // }

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
  // const handleEditCellChangeCommitted = React.useCallback(
  //   ({ id, field, props }) => {
  //       console.log('cell commit', myEditedRows, props);
  //       const data = props; // Fix eslint value is missing in prop-types for JS files
  //       const updatedRows = myEditedRows.map((row) => {
  //         const obj = {};
  //         obj[field] = data.value;
  //         if (row.orderId === id) {
  //           return { ...row, ...obj};
  //         }
  //         return row;
  //       });
  //       setMyEditedRows(updatedRows);
  //       console.log('cell commit after ', updatedRows);
  //   },
  //   [myEditedRows],
  // );

  const handleAddClick = (e) => {setMode('add')}
  const handleEditClick = (e) => {setMode('update')}
  const handleDeleteClick = (e) => {setOpen(true)}
  const handleClose = (e) => {setOpen(false)}

  const handleDeleteConfirm = (e) => {
    console.log('u confirmed delete');
    let errors = [];
    const deleteRows = async () => {
      for(let rowId of mySelectedRows) {
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
        setMessage('Some rows were not deleted\n' + errors.toString() + ' Pleae refresh');
      else
        setMessage('Deleted successfully. Please refresh');

    }
    setOpen(false);
    deleteRows();

  }

  // const handleSelection = (items) => {
  //   console.log(items);    
  //   setMySelectedRows(items.selectionModel);    
  // }

  useEffect(() => {
    props.setTitle('Printing');
    if(mode=='none')
      fetchlist()
  }, [mode, token]
  );

  useEffect( () => {
    updateSearchFilteredOrders(searchString);
  }, [orders]);

  function fetchlist(){
    setLoading(true);
    setMySelectedRows([]);
    API.getPrintingList(token['mr-token'])
    .then(data => {
      let rows = data;
      console.log('fetching orders');
      //console.log(rows.map(r => r.orderId))
      //filter
      
      
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
      setLoading(false);
    })
    .catch(e => {console.log("api error"); console.error(e); setLoading(false)});
  }  

  const updateSearchFilteredOrders = (theSearchString) =>{
    let rows = [...orders];
    if(theSearchString!='')
        rows = rows.filter(r => {
          const str = theSearchString.toLowerCase()
          return r.displayStatus.toLowerCase().search(str)>=0 ||
          r.style.toLowerCase().search(str)>=0 ||
          r.orderNo.toLowerCase().search(str)>=0 ||
          r.storeName.toLowerCase().search(str)>=0 ||
          r.recipientName.toLowerCase().search(str)>=0 ||
          r.design.toLowerCase().search(str)>=0 ||
          r.size.toLowerCase().search(str)>=0 ||
          r.color.toLowerCase().search(str)>=0 ||
          r.productAvailability.toLowerCase().search(str)>=0;
        })
    setMySelectedRows([]);
    setSearchFilteredOrders(rows);
  }

  let nextGroup = 0;

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  
  const usertype = parseInt(userInfo['mr-user'].split('-')[1]);

  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div>
          
        </div>
      </div>      
      {message!='' && <div style={{color:"red"}}>{message}</div>}
      { mode=='none' ?
        <div>          
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row'}}>
              
            <div>
              <IconButton color='primary' variant='contained' onClick={handleAddClick}><AddCircleIcon /></IconButton>
              <IconButton variant="contained" color="primary" disabled={mySelectedRows.length==1 ? false:true} onClick={handleEditClick}><EditIcon /></IconButton>
              <IconButton variant="contained" color="secondary" disabled={mySelectedRows.length>0 ? false:true} onClick={handleDeleteClick}><DeleteIcon /></IconButton>
              <Dialog
                open={open}
                onClose={handleClose}
              >
                <DialogTitle>"Are you sure you want to delete the {mySelectedRows.length} items"</DialogTitle>
                
                <DialogActions>
                  <Button onClick={handleClose} color="primary">Cancel</Button>
                  <Button onClick={handleDeleteConfirm} color="primary" autoFocus>Confirm</Button>
                </DialogActions>
              </Dialog>
            </div>
            <div>
                <TextField variant="outlined" size="small" margin="none" type="text" value={searchString} text='Search' onChange={(e) => setSearchString(e.target.value)} onKeyPress={e => e.key=="Enter" && updateSearchFilteredOrders(e.target.value)}></TextField>
                <Button color="primary" variant="contained" onClick={e => updateSearchFilteredOrders(searchString)}>Search</Button>
              </div>            
          </div>
          
          {/*<div style={{  width: '100%', height: '450px', minWidth:'600px'}}>        
            <DataGrid rows={orders} columns={columns} checkboxSelection  components={{
              Toolbar: GridToolbar,
            }} disableSelectionOnClick={true} onSelectionModelChange={handleSelection} onRowSelected={handleRowSelected} onEditCellChangeCommitted={handleEditCellChangeCommitted} />
          </div>*/}
          {loading ? <h2>Loading...  Please wait</h2>
          :
          <TableContainer component={Paper} style={{height: 'calc(100vh - 140px)'}}>
            <Table className={classes.table} size="small" aria-label="spanning table">
              <TableHead>                
                <TableRow>
                  <TableCell className={classes.tablecell}>
                    <Checkbox
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell className={classes.headcell} >Status</TableCell>
                  <TableCell className={classes.headcell} >Shop</TableCell>
                  <TableCell className={classes.headcell} >Recipient/Order/#</TableCell>
                  <TableCell className={classes.headcell} >Style</TableCell>
                  <TableCell className={classes.headcell} >Size</TableCell>
                  <TableCell className={classes.headcell} >Color</TableCell>
                  <TableCell className={classes.headcell} >Design</TableCell>
                  <TableCell className={classes.headcell} >Msg</TableCell>
                  <TableCell className={classes.headcell} >Processed</TableCell>
                  <TableCell className={classes.headcell} >Printed</TableCell>
                  <TableCell className={classes.headcell} >Shipped</TableCell>
                  <TableCell className={classes.headcell} >Product Availability</TableCell>
                  <TableCell className={classes.headcell} >Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { searchFilteredOrders.map((row, i, arr) => {
                  let showSpan = false;
                  if(i==nextGroup){
                    showSpan = true;
                    for(let j=i+1;j<arr.length; j++){
                      if(row.orderNo!=arr[j].orderNo || row.storeName!=arr[j].storeName 
                        || row.recipientName!=arr[j].recipientName || row.displayStatus!=arr[j].displayStatus){
                          nextGroup = j;
                          break;
                        }                        
                    }
                  }
                  return (
                    <TableRow key={row.orderId}>
                    <TableCell className={classes.tablecell}>
                      <Checkbox
                        inputProps={{ 'data-oid' : row.orderId }}
                        onChange={handleCheckboxClick}
                      />
                    </TableCell>
                    {showSpan && <TableCell style={{ whiteSpace : 'nowrap'}} rowSpan={nextGroup-i} className={classes.tablecell}>{row.displayStatus}</TableCell>}
                    {showSpan && <TableCell style={{ whiteSpace : 'nowrap'}} rowSpan={nextGroup-i} className={classes.tablecell}>{row.storeName}</TableCell>}
                    {showSpan && <TableCell style={{ whiteSpace : 'nowrap'}} rowSpan={nextGroup-i} className={classes.tablecell}><div >{row.recipientName}</div><div>{row.orderNo}</div><div>{row.orderCount}</div></TableCell>}
                    <TableCell style={{ whiteSpace : 'nowrap'}} className={classes.tablecell}>{row.style}</TableCell>
                    <TableCell style={{ whiteSpace : 'nowrap'}} className={classes.tablecell}>{row.size}</TableCell>
                    <TableCell style={{ whiteSpace : 'nowrap'}} className={classes.tablecell}>{row.color}</TableCell>
                    <TableCell style={{ whiteSpace : 'nowrap'}} className={classes.tablecell}>{row.design}</TableCell>
                    <TableCell style={{  maxWidth: '50px'}} className={classes.tablecell}>{row.giftMessages && <EmailIcon />}</TableCell>
                    <TableCell className={classes.tablecell}><Button onClick={handleSpecialButtonsClick} data-oid={row.orderId} data-btype={"processing"} className={row.processing=='Y' ? classes.greenbtn : classes.redbtn} variant="contained">{row.processing}</Button></TableCell>
                    <TableCell className={classes.tablecell}><Button onClick={handleSpecialButtonsClick} data-oid={row.orderId} data-btype={"printed"} className={row.printed=='Y' ? classes.greenbtn : classes.redbtn} variant="contained">{row.printed}</Button></TableCell>
                    <TableCell className={classes.tablecell}><Button onClick={handleSpecialButtonsClick} data-oid={row.orderId} data-btype={"shipped"} className={row.shipped=='Y' ? classes.greenbtn : classes.redbtn} variant="contained">{row.shipped}</Button></TableCell>
                    <TableCell className={classes.tablecell}>{row.productAvailability}</TableCell>
                    <TableCell className={classes.tablecell} style={{ maxWidth : '150px', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{row.sfmNotes}</TableCell>
                  </TableRow>);
                  })
                }                
              </TableBody>
            </Table>
          </TableContainer>
          }
          </div>
        :
        (mode=="add" ?
          <OrderForm mode={mode} setMode={setMode} fromPrinting={true}></OrderForm>
          :
          <OrderUpdateForm id={mySelectedRows[0]} mode={mode} setMode={setMode} fromPrinting={true}></OrderUpdateForm>
        )
      }
    </div>
  );
}

export default Printing;
