import '../App.css';
import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { Divider, Button } from '@material-ui/core';
import ProductForm from './ProductForm';

const columns = [
  { field: 'sfmId', headerName: 'SFM ID', width: 150},
  { field: 'style', headerName: 'Style', width: 150, editable: true},
  { field: 'size', headerName: 'Size', width: 150, editable: true},
  { field: 'color', headerName: 'Color', width: 150, editable: true},
  { field: 'sku', headerName: 'SKU', width: 150 },
  { field: 'cost', headerName: 'Cost', width: 150 , editable: true},
  { field: 'price', headerName: 'Price', width: 150 , editable: true},
  { field: 'amountInStock', headerName: 'Amount In Stock', width: 150, editable: true}
];

function ProductDetails(){
  
  // { id: 1, sfmId: 'dummy1', style: 'dummy style' },
  // { id: 2,  sfmId: 'dummy2', style: 'dummy style' }
  const [products, setProducts] = useState([]);
  
  const [token] = useCookies(['mr-token']);
  const [mode, setMode] = useState('none');
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [recordDetails, setRecordDetails] = useState({});

  useEffect(() => {
    API.getProductList(token['mr-token'])
    .then(data => {
      console.log(data); 
      data.forEach((item, i) => item.id = item.sfmId);
      setMySelectedRows([]);
      setProducts(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }, [token, mode]
  );

  const updatebtnClicked = (e) => {
    console.log("update clicked");
    if(mySelectedRows.length==1)    
      API.getProduct(token['mr-token'], mySelectedRows[0])
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

  useEffect( () => {    
    console.log(token);    
  }, [token]);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <h3>Products</h3>
      <Divider style={{  width: '100%', marginBottom: '15px' }}/>
      { mode=='none' ?
        <div>
          <Button style={{ width: '60px', marginBottom:'10px'}} color='primary' variant='contained' onClick={handleAddClick}>Add</Button>
          <Button style={{ width: '60px', marginBottom:'10px'}} disabled={mySelectedRows.length == 1 ? false:true} onClick={updatebtnClicked} color='primary' variant='contained' >Update</Button>
          <div style={{  width: '100%', minWidth:'600px'}}>
            <DataGrid rows={products} columns={columns} checkboxSelection autoHeight={true} components={{
              Toolbar: GridToolbar,
            }} onSelectionModelChange={handleSelection} />
          </div>
        </div>
        :
        <ProductForm id={ mode=='update' ? mySelectedRows : null }  data={ mode=='update' ? recordDetails : null} mode={mode} setMode={setMode}></ProductForm>
      }
    </div>
  );
}

export default ProductDetails;
