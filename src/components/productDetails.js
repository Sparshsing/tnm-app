import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'

const rows = [
  { id: 1, sfmid: 'Hello', style: 'World' },
  { id: 2, sfmid: 'XGrid', style: 'is Awesome' },
  { id: 3, sfmid: 'Material-UI', style: 'is Amazing' },
];

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
      data.forEach((item, i) => item.id = i+1);
      console.log(data); 
      return setProducts(data);
    })
    .catch(e => console.log(e));
  }, []
  );

  useEffect( () => {    
    console.log(token);    
  }, [token]);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ height: 400, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div style={{  width: '80%', minWidth:'600px'}}>
        <DataGrid rows={products} columns={columns} components={{
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
