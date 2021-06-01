import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider } from '@material-ui/core';

const columns = [
  { field: 'style', headerName: 'Style', width: 150 },
  { field: 'size', headerName: 'Size', width: 150 },
  { field: 'color', headerName: 'Color', width: 150 },
  { field: 'productAvailability', headerName: 'Product Availabity', width: 150 },
  { field: 'inStock', headerName: 'In Stock', width: 150 },
  { field: 'unfulfilledCount', headerName: 'Unfulfilled Count', width: 150 },
  { field: 'inTransit', headerName: 'In Transit', width: 150 },
  { field: 'arrivalDate', headerName: 'ArrivaL Date', width: 150 },
  { field: 'trueCount', headerName: 'True Count', width: 150 },
  { field: 'minimum', headerName: 'Minimum', width: 150 },
  { field: 'maximum', headerName: 'Maximum', width: 150 },
  { field: 'shortCount', headerName: 'Short Count', width: 150 },
  { field: 'needToPurchase', headerName: 'Need to Purchase', width: 150 }
];

function InventoryList(props){
  
  //{ id: 1, style: 'dummy1', size: 'dummy ' },
  //{ id: 2, style: 'dummy2', size: 'dummy ' }
  const [productInventory, setproductInventory] = useState([]);
  
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);

  useEffect(() => {
    props.setTitle('Inventory');

    console.log({...productInventory[0]});
    API.getInventoryList(token['mr-token'])
    .then(data => {
      console.log(data); 
      // data.forEach((item, i) => item.id = item.sfmId);
      
      return setproductInventory(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }, []
  );

  useEffect( () => {    
    console.log(token);    
  }, [token]);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(parseInt(userInfo['mr-user'].split('-')[1])==0)
    return (<Redirect to='/'></Redirect>);
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <div style={{  width: '100%', minWidth:'600px', height:'calc(100vh - 100px)'}}>        
        <DataGrid rows={productInventory} columns={columns} components={{
          Toolbar: GridToolbar,
        }} />
      </div>
    </div>      
  );
}

export default InventoryList;
