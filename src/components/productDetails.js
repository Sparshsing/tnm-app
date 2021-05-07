import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider } from '@material-ui/core';

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
  
  const [products, setProducts] = useState([{ id: 1, sfmId: 'dummy1', style: 'dummy style' },
  { id: 2,  sfmId: 'dummy2', style: 'dummy style' }]);
  
  const [token] = useCookies(['mr-token']);

  useEffect(() => {
    API.getProducts(token['mr-token'])
    .then(data => {
      console.log(data); 
      data.forEach((item, i) => item.id = i+1);
      
      return setProducts(data);
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
      <h3>Products</h3>
      <Divider style={{  width: '100%', marginBottom: '15px' }}/>
      <div style={{  width: '100%', minWidth:'600px'}}>
        <DataGrid rows={products} columns={columns} autoHeight={true} components={{
          Toolbar: GridToolbar,
        }}/>
      </div>
      {/*<ul>
        { products.map( (product) => { 
            return <li key={product.sfmId}> {product.color}{product.id}</li>
          })
        }
      </ul>*/}
    </div>
  );
}

export default ProductDetails;
