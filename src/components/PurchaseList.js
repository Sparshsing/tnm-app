import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider } from '@material-ui/core';

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

  useEffect(() => {
    API.getPurchasesList(token['mr-token'])
    .then(data => {
      console.log(data); 
      data.forEach((item, i) => item.id = i+1);
      
      return setPurchases(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }, []
  );

  useEffect( () => {    
    console.log(token);    
  }, [token]);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <h3>Purchases</h3>
      <Divider style={{  width: '100%', marginBottom: '15px' }}/>
      <div style={{  width: '100%', minWidth:'600px'}}>
        <DataGrid rows={purchases} columns={columns} autoHeight={true} components={{
          Toolbar: GridToolbar,
        }}/>
      </div>
    </div>
  );
}

export default PurchaseList;
