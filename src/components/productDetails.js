import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';

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
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => resp.json())
    .then(data => {
      data.forEach((item, i) => item.id = i+1);
      console.log(data); 
      return setProducts(data);
    })
    .catch(e => console.log(e));
  }, []
  );

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
