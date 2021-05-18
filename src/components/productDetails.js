import '../App.css';
import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { Divider, Button, TextField } from '@material-ui/core';
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

  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [message, setMessage] = useState('');

  const fileChangeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
    console.log("file is: ", event.target.files[0])
		setIsFilePicked(true);
	};

  const handleUpload = (e) => {
    e.preventDefault();

    const formData = new FormData();

		formData.append('productsFile', selectedFile);

    if(isFilePicked && selectedFile.name.search(/product/i) == -1){
      setMessage('Please make sure you have selected products file. File name should contain the word product');
      return;
    }

		API.uploadProductsFile(token['mr-token'], formData)
			.then((response) => response.json())
			.then((result) => {
        if(result['errors']){          
          if(result['errors'].length==0){
            setMessage('Successfully imported all records');
            console.log('Successfully imported all records');
          }
          else{
            setMessage('Partial Success (see error records in console (hit Ctrl+Shift+i)');
            console.log('Following rows were not imported: ');
            console.log(result['errors']);
          }
        }
				else setMessage('Failed import due to unknown reason');
        console.log('setting mode');
        setIsFilePicked(false);
        fetchlist();
        setMode('none');
			})
			.catch((error) => {
				console.error('Error:', error);
        setMessage('Failed import due to unknown reasons');
			});
	};

  useEffect(() => {
    if(mode=='none')
      fetchlist();
  }, [token, mode]
  );

  function fetchlist(){
    API.getProductList(token['mr-token'])
    .then(data => {
      console.log(data); 
      // data.forEach((item, i) => item.id = item.sfmId);
      setProducts(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }

  const updatebtnClicked = (e) => {
    console.log("update clicked");
    if(mySelectedRows.length==1){
      const selectedRowId = mySelectedRows[0]
      setMySelectedRows([])
      API.getProduct(token['mr-token'], selectedRowId)
        .then(resp => resp.json())
        .then(data => {
        console.log("filling formdata");
        setRecordDetails(data);
        setMode('update');
        })
        .catch(e =>{console.log("api error");console.error(e)});
      }
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
      {message=='' ? '' : <div style={{color:"red"}}>{message}</div>}
      <Divider style={{  width: '100%', marginBottom: '15px' }}/>
      { mode=='none' ?
        <div>
          <Button style={{ width: '60px', marginBottom:'10px'}} color='primary' variant='contained' onClick={handleAddClick}>Add</Button>
          <Button style={{ width: '60px', marginBottom:'10px'}} disabled={mySelectedRows.length == 1 ? false:true} onClick={updatebtnClicked} color='primary' variant='contained' >Update</Button>
          <form ><TextField type="file" name="myfile" onChange={fileChangeHandler}></TextField><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Products</Button></form>
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
