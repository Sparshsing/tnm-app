import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider, Button } from '@material-ui/core';
import PurchaseForm from './PurchaseForm';


const columns = [
  { field: 'status', headerName: 'Status', width: 150},
  { field: 'style', headerName: 'Style', width: 150 },
  { field: 'size', headerName: 'Size', width: 150 },
  { field: 'color', headerName: 'Color', width: 150 },
  { field: 'company', headerName: 'Company' },
  { field: 'warehouse', headerName: 'Warehouse', width: 150 },
  { field: 'ordered', headerName: 'Ordered', width: 150 },
  { field: 'orderDate', headerName: 'Order Date', width: 150},
  { field: 'arrivalDate', headerName: 'Arrival Date', width: 150 },
  { field: 'sfmId', headerName: 'SFM ID', width: 150 }
];

function PurchaseList(){
  
  const [purchases, setPurchases] = useState([{ id: 1, sfmId: 'dummy1', style: 'dummy style' },
  { id: 2,  sfmId: 'dummy2', style: 'dummy style' }]);
  
  const [token] = useCookies(['mr-token']);
  const [mode, setMode] = useState('none');
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [recordDetails, setRecordDetails] = useState({});

  const updatebtnClicked = (e) => {
    console.log("update clicked");
    if(mySelectedRows.length==1)    
      API.getPurchase(token['mr-token'], mySelectedRows[0])
        .then(resp => resp.json())
        .then(data => {
        console.log("filling formdata");
        setRecordDetails(data);
        setMode('update');
        })
        .catch(e =>{console.log("api error");console.error(e)});
  };

  const handleAddClick = (e) => {setMode('add')}

  const handleSelection = (items) => {
    console.log(items);    
    setMySelectedRows(items.selectionModel);    
  }
  

  useEffect(() => {
    if(mode=='none'){
      console.log("fetching data");
      API.getPurchasesList(token['mr-token'])
      .then(data => {
        console.log(data);
        // not needed as purchases object already contains field called id
        // data.forEach((item, i) => item.id = i+1);
        
        return setPurchases(data);
      })
      .catch(e => {console.log("api error"); console.error(e)});
    }
  }, [token, mode]
  );

  useEffect( () => {    
    console.log(token);    
  }, [mode]);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <h3>Purchases</h3>
      <Divider style={{  width: '100%', marginBottom: '10px' }}/>
      { mode=='none' ?
        <div>
          <Button style={{ width: '60px', marginBottom:'10px'}} color='primary' variant='contained' onClick={handleAddClick}>Add</Button>
          <Button style={{ width: '60px', marginBottom:'10px'}} disabled={mySelectedRows.length == 1 ? false:true} onClick={updatebtnClicked} color='primary' variant='contained' >Update</Button>
          <div style={{  width: '100%', minWidth:'600px', flexGrow: 1}}>
            <DataGrid rows={purchases} columns={columns} checkboxSelection autoHeight={true} components={{
              Toolbar: GridToolbar,
            }} onSelectionModelChange={handleSelection} />
          </div>
        </div>
        :
        <PurchaseForm id={ mode=='update' ? mySelectedRows : null }  data={ mode=='update' ? recordDetails : null} mode={mode} setMode={setMode}></PurchaseForm>
      }           
    </div>
  );
}

export default PurchaseList;
