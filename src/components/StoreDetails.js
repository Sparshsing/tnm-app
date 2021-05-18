import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider } from '@material-ui/core';

const columns = [
  { field: 'storeName', headerName: 'Store Name', width: 150 },
  { field: 'storeCode', headerName: 'Store Code', width: 150 },
  { field: 'emailAddress', headerName: 'Email Address', width: 150 },
  { field: 'addressLine1', headerName: 'Addres Line 1', width: 150 },
  { field: 'addressLine2', headerName: 'Adress Line 2', width: 150 },
  { field: 'city', headerName: 'City', width: 150 },
  { field: 'state', headerName: 'State', width: 150 },
  { field: 'zipCode', headerName: 'Zip Code', width: 150 }
];

function StoreDetails(){
  //{ id: 1, storeCode: 'dummy1', storeName: 'dummy store' },
  //{ id: 2, storeCode: 'dummy2', storeName: 'dummy store2' }
  const [stores, setStores] = useState([]);
  
  const [token] = useCookies(['mr-token']);

  useEffect(() => {
    API.getStoreList(token['mr-token'])
    .then(data => {
      console.log(data); 
      data.forEach((item, i) => item.id = i+1);
      
      return setStores(data);
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
      <h3>Stores</h3>
      <Divider style={{  width: '100%', marginBottom: '15px' }}/>
      <div style={{  width: '100%', minWidth:'600px'}}>        
        <DataGrid rows={stores} columns={columns} autoHeight={true} components={{
          Toolbar: GridToolbar,
        }} />
      </div>
    </div>      
  );
}

export default StoreDetails;
