import '../App.css';
import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { Divider, Button, TextField, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ProductForm from './ProductForm';

const columns = [
  { field: 'sfmId', headerName: 'SFM ID', width: 150},
  { field: 'style', headerName: 'Style', width: 150},
  { field: 'size', headerName: 'Size', width: 150},
  { field: 'color', headerName: 'Color', width: 150},
  { field: 'sku', headerName: 'SKU', width: 150 },
  { field: 'cost', headerName: 'Cost', width: 150},
  { field: 'price', headerName: 'Price', width: 150},
  { field: 'amountInStock', headerName: 'Amount In Stock', width: 150}
];

function ProductDetails(props){
  
  // { id: 1, sfmId: 'dummy1', style: 'dummy style' },
  // { id: 2,  sfmId: 'dummy2', style: 'dummy style' }
  const [products, setProducts] = useState([]);
  
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);
  const [mode, setMode] = useState('none');
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [recordDetails, setRecordDetails] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [message, setMessage] = useState('');

  const usertype = parseInt(userInfo['mr-user'].split('-')[1]);

  const restrictedColumns = [
    { field: 'style', headerName: 'Style', width: 150},
    { field: 'size', headerName: 'Size', width: 150},
    { field: 'color', headerName: 'Color', width: 150},
    { field: 'sku', headerName: 'SKU', width: 150 },
  ];

  if(usertype==0) 
    restrictedColumns.push({ field: 'price', headerName: 'Price', width: 150});

  const fileChangeHandler = (event) => {
    if(event.target.files.length==1){
      setSelectedFile(event.target.files[0]);
      console.log("file is: ", event.target.files[0])
      setIsFilePicked(true);
    }
    else{
      setSelectedFile(null);
      setIsFilePicked(false);
    }
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

  function fetchlist(){
    API.getProductList(token['mr-token'])
    .then(resp => {
      console.log(resp);
      if(resp.status==200)
        return resp.json();
      else
        throw 'Something went wrong'
    })
    .then(data => {
      console.log(data); 
      // data.forEach((item, i) => item.id = item.sfmId);
      setProducts(data);
    })    
    .catch(e => {console.log("api error"); console.error(e)});
  }
  
  useEffect(() => {
    props.setTitle('Products');

    if(mode=='none')
      fetchlist();
  }, [token, mode]
  );

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

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      {message=='' ? '' : <div style={{color:"red"}}>{message}</div>}
      { mode=='none' ?
        <div>
          { usertype==1 && 
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row'}}>
            <div>
            <IconButton color='primary' variant='contained' onClick={handleAddClick}><AddCircleIcon /></IconButton>
            <IconButton disabled={mySelectedRows.length == 1 ? false:true} onClick={updatebtnClicked} color='primary' variant='contained' ><EditIcon /></IconButton>
            </div>
            <form ><input type="file" name="myfile" id="myfile" onChange={fileChangeHandler} hidden></input><label htmlFor="myfile" className="file-input-label">Choose File</label><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Products</Button></form>
          </div>}
          <div style={{  width: '100%', minWidth:'600px', height: 'calc(100vh - 140px'}}>
            <DataGrid rows={products} columns={usertype==1 ? columns : restrictedColumns} checkboxSelection components={{
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
