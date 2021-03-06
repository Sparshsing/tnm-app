import '../App.css';
import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { Button, IconButton, Dialog, DialogActions, DialogTitle, TextField} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ProductForm from './ProductForm';
import GridCellExpand from './GridCellExpand';
import AuthenticationService from '../authentication-service';


const columns = [
  { field: 'id', headerName: 'ID', width: 80},
  { field: 'sfmId', headerName: 'SFM ID', width: 300, renderCell: (params) => (<GridCellExpand limit={29} value={params.value ? params.value.toString() : ''} width={300} />), hide: true},
  { field: 'style', headerName: 'Style', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />)},
  { field: 'size', headerName: 'Size', width: 100},
  { field: 'color', headerName: 'Color', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />)},
  { field: 'sku', headerName: 'SKU', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />)},
  { field: 'price', headerName: 'Price', width: 100, type: 'number'},
  { field: 'amountInStock', headerName: 'Amount In Stock', width: 150, type: 'number'}
];

function ProductDetails(props){
  
  // { id: 1, sfmId: 'dummy1', style: 'dummy style' },
  // { id: 2,  sfmId: 'dummy2', style: 'dummy style' }
  const [products, setProducts] = useState([]);
  const [searchFilteredProducts, setSearchFilteredProducts] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [token] = useCookies(['mr-token']);
  const [mode, setMode] = useState('none');
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [message, setMessage] = useState('');

  const usertype = props.usertype;

  const restrictedColumns = [
    { field: 'style', headerName: 'Style', width: 150},
    { field: 'size', headerName: 'Size', width: 150},
    { field: 'color', headerName: 'Color', width: 150},
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'amountInStock', headerName: 'Amount In Stock', width: 150, type: 'number'}
  ];

  if(usertype==0) 
    restrictedColumns.splice(4, 0, { field: 'price', headerName: 'Price', width: 150});

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
            setMessage(result['msg']);
            console.log(result['msg']);
          }
          else{
            setMessage(result['msg'] + ' (see error records in admin panel logs, or in console (hit Ctrl+Shift+i)');
            console.log('Following rows were not imported: ');
            console.log(result['errors']);
          }
        }
				else setMessage('Failed import due to unknown reason');
        console.log('setting mode');
        setIsFilePicked(false);
        setSelectedFile(null);
        fetchlist();
        setMode('none');
			})
			.catch((error) => {
				console.error('Error:', error);
        setIsFilePicked(false);
        setSelectedFile(null);
        setMessage('Failed import due to unknown reasons');
			});
	};

  function fetchlist(){
    setLoading(true);
    API.getProductList(token['mr-token'])
    .then(resp => {
      if(resp.status==200) return resp.json();
      if(resp.status==401) AuthenticationService.handleUnauthorized();
      throw 'Something went wrong';    
    })
    .then(data => {
      // console.log(data); 
      // data.forEach((item, i) => item.id = item.sfmId);
      setLoading(false);
      setProducts(data);
    })    
    .catch(e => {console.log("api error"); console.error(e); setLoading(false);});
  }
  
  useEffect(() => {
    props.setTitle('Products');

    if(mode=='none')
      fetchlist();
  }, [token, mode]
  );

  useEffect(() => {
    updateSearchFilteredProducts(searchString);
  }, [products]
  );

  const updateSearchFilteredProducts = (theSearchString) =>{
    let rows = [...products];
    if(theSearchString!='')
        rows = rows.filter(r => {
          const str = theSearchString.toLowerCase()
          return r.style.toLowerCase().search(str)>=0 ||
          r.size.toLowerCase().search(str)>=0 ||
          r.color.toLowerCase().search(str)>=0;
          
        })
    setMySelectedRows([]);
    setSearchFilteredProducts(rows);
  }

  const updatebtnClicked = (e) => {
    console.log("update clicked");
    if(mySelectedRows.length==1)
      setMode('update');
  };

  const handleAddClick = (e) => {setMode('add')}

  const handleSelection = (items) => {
    console.log(items);    
    setMySelectedRows(items.selectionModel);    
  }

  const handleDeleteClick = (e) => {setOpen(true)}
  const handleClose = (e) => {setOpen(false)}
  const handleDeleteConfirm = async (e) => { 
    console.log('u confirmed delete');
    let deleted = 0;
    const errors = [];
    for(let rowId of mySelectedRows) {
      try{
        const resp = await API.deleteProduct(token['mr-token'], rowId);        
        if(resp.status==200 || resp.status==204){
          console.log(`deleted order with id ${rowId}`);
          deleted++;
        }            
        else{
          console.log(`Failed to delete product with id ${rowId}`);
          const p = products.find(x => x.id==rowId)['sfmId'];
          throw `Could not delete product ${p}`;
        }           
      }
      catch(e){
        console.error(`could not delete product id ${rowId}`, e);
        errors.push(e.toString());
      }
    }
    if(deleted < mySelectedRows.length)
      setMessage('Could not delete products ' + errors.toString());
    else
      setMessage('Successfull');
    setOpen(false);
    fetchlist();
  }

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      {message && <div style={{color:"red"}}>{message}</div>}
      { mode=='none' ?
        <div>
          { usertype==1 && 
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row'}}>
            <div>
              <IconButton color='primary' variant='contained' onClick={handleAddClick}><AddCircleIcon /></IconButton>
              <IconButton disabled={mySelectedRows.length == 1 ? false:true} onClick={updatebtnClicked} color='primary' variant='contained' ><EditIcon /></IconButton>
              <IconButton variant="outlined" color="secondary" disabled={mySelectedRows.length>0 ? false:true} onClick={handleDeleteClick}><DeleteIcon /></IconButton>
              <Dialog
                open={open}
                onClose={handleClose}
                >
                <DialogTitle id="alert-dialog-title">"Are you sure you want to delete the {mySelectedRows.length} items"</DialogTitle>
                
                <DialogActions>
                  <Button onClick={handleClose} color="primary">Cancel</Button>
                  <Button onClick={handleDeleteConfirm} color="primary" autoFocus>Confirm</Button>
                </DialogActions>
              </Dialog>
            </div>
            <form ><input type="file" name="myfile" id="myfile" onChange={fileChangeHandler} hidden></input><label htmlFor="myfile" className="file-input-label">Choose File</label><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Products</Button></form>
            <div>
                <TextField variant="outlined" size="small" margin="none" type="text" style={{marginRight: '4px'}} value={searchString} text='Search' onChange={(e) => setSearchString(e.target.value)} onKeyPress={e => e.key=="Enter" && updateSearchFilteredProducts(e.target.value)}></TextField>
                <Button color="primary" variant="contained" onClick={e => updateSearchFilteredProducts(searchString)}>Search</Button>
            </div>
          </div>}
          <div style={{  width: '100%', minWidth:'600px', height: 'calc(100vh - 140px'}}>
            <DataGrid rows={searchFilteredProducts} columns={usertype==1 ? columns : restrictedColumns} checkboxSelection components={{
              Toolbar: GridToolbar,
            }} onSelectionModelChange={handleSelection} disableColumnMenu={true} disableSelectionOnClick loading={loading}/>
          </div>
        </div>
        :
        <ProductForm id={ mode=='update' ? mySelectedRows[0] : null } mode={mode} setMode={setMode}></ProductForm>
      }
    </div>
  );
}

export default ProductDetails;
