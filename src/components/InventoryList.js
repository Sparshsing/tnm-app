import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import { Button, TextField} from '@material-ui/core';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider } from '@material-ui/core';
import GridCellExpand from './GridCellExpand';

const columns = [
  { field: 'style', headerName: 'Style', width: 200, renderCell: (params) => (<GridCellExpand limit={20} value={params.value ? params.value.toString() : ''} width={300} />) },
  { field: 'size', headerName: 'Size', width: 80 },
  { field: 'color', headerName: 'Color', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />) },
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
  const [selectedFile, setSelectedFile] = useState(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [message, setMessage] = useState('');
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);

  useEffect(() => {
    props.setTitle('Inventory');
    fetchlist();
    
  }, [token]
  );

  const fetchlist = () => {
    API.getInventoryList(token['mr-token'])
    .then(data => {
      console.log(data); 
      // data.forEach((item, i) => item.id = item.sfmId);
      
      return setproductInventory(data);
    })
    .catch(e => {console.log("api error"); setMessage('Something went wrong');console.error(e)});
  }

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

		formData.append('inventoryFile', selectedFile);

    if(isFilePicked && selectedFile.name.search(/inventory/i) == -1){
      setMessage('Please make sure you have selected inventory file. File name should contain the word inventory');
      return;
    }

		API.uploadInventoryFile(token['mr-token'], formData)
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
        setIsFilePicked(false);
        setSelectedFile(null);
        fetchlist();
			})
			.catch((error) => {
				console.error('Error:', error);
        setIsFilePicked(false);
        setSelectedFile(null);
        setMessage('Failed import due to unknown reasons');
			});
	};

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(parseInt(userInfo['mr-user'].split('-')[1])==0)
    return (<Redirect to='/'></Redirect>);
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      {message && <div style={{color:"red"}}>{message}</div>}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row', marginBottom: "5px"}}>
        <form ><input type="file" name="myfile" id="myfile" onChange={fileChangeHandler} hidden></input><label htmlFor="myfile" className="file-input-label">Choose File</label><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import Inventory</Button></form>
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
