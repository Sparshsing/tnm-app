import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import { Button, TextField} from '@material-ui/core';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider } from '@material-ui/core';

const columns = [
  { field: 'style', headerName: 'Style', width: 250 },
  { field: 'size', headerName: 'Size', width: 80 },
  { field: 'color', headerName: 'Color', width: 150 },
  { field: 'productAvailability', headerName: 'Product Availabity', width: 150 },
  { field: 'inStock', headerName: 'In Stock', width: 80 },
  { field: 'unfulfilledCount', headerName: 'Unfulfilled Count', width: 80 },
  { field: 'inTransit', headerName: 'In Transit', width: 90 },
  { field: 'arrivalDate', headerName: 'ArrivaL Date', width: 120 },
  { field: 'trueCount', headerName: 'True Count', width: 80 },
  { field: 'minimum', headerName: 'Minimum', width: 80 },
  { field: 'maximum', headerName: 'Maximum', width: 80 },
  { field: 'shortCount', headerName: 'Short Count', width: 80 },
  { field: 'needToPurchase', headerName: 'Need to Purchase', width: 90 }
];

function InventoryList(props){
  
  //{ id: 1, style: 'dummy1', size: 'dummy ' },
  //{ id: 2, style: 'dummy2', size: 'dummy ' }
  const [productInventory, setproductInventory] = useState([]);
  const [searchFilteredInventory, setSearchFilteredInventory] = useState([]);
  const [searchString, setSearchString] = useState('');
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
  }, [token]
  );

  useEffect(() => {
    updateSearchFilteredInventory(searchString);
  }, [productInventory]
  );

  const updateSearchFilteredInventory = (theSearchString) =>{
    let rows = [...productInventory];
    if(theSearchString!='')
        rows = rows.filter(r => {
          const str = theSearchString.toLowerCase()
          return r.style.toLowerCase().search(str)>=0 ||
          r.size.toLowerCase().search(str)>=0 ||
          r.color.toLowerCase().search(str)>=0 ||
          r.productAvailability.toLowerCase().search(str)>=0;
        })
    setSearchFilteredInventory(rows);
  }

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(parseInt(userInfo['mr-user'].split('-')[1])==0)
    return (<Redirect to='/'></Redirect>);
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row', marginBottom: "5px"}}>
        <div>
            <TextField variant="outlined" size="small" margin="none" type="text" value={searchString} text='Search' onChange={(e) => setSearchString(e.target.value)} onKeyPress={e => e.key=="Enter" && updateSearchFilteredInventory(e.target.value)}></TextField>
            <Button color="primary" variant="contained" onClick={e => updateSearchFilteredInventory(searchString)}>Search</Button>
        </div>
      </div>
      <div style={{  width: '100%', minWidth:'600px', height:'calc(100vh - 100px)'}}>        
        <DataGrid rows={searchFilteredInventory} columns={columns} components={{
          Toolbar: GridToolbar,
        }} disableColumnMenu />
      </div>
    </div>      
  );
}

export default InventoryList;
