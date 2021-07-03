import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import StoreForm from './StoreForm';
import GridCellExpand from './GridCellExpand';


const columns = [
  { field: 'storeName', headerName: 'Store Name', width: 200,  renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />)},
  { field: 'storeCode', headerName: 'Store Code', width: 110 },
  { field: 'emailAddress', headerName: 'Email Address', width: 250,  renderCell: (params) => (<GridCellExpand limit={23} value={params.value ? params.value.toString() : ''} width={300} />) },
  { field: 'addressLine1', headerName: 'Addres Line 1', width: 200,  renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />) },
  { field: 'addressLine2', headerName: 'Adress Line 2', width: 200,  renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />) },
  { field: 'city', headerName: 'City', width: 150,  renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />) },
  { field: 'state', headerName: 'State', width: 80 },
  { field: 'zipCode', headerName: 'Zip Code', width: 100 }
];

function StoreDetails(props){


  //{ id: 1, storeCode: 'dummy1', storeName: 'dummy store' },
  //{ id: 2, storeCode: 'dummy2', storeName: 'dummy store2' }
  const [stores, setStores] = useState([]);
  
  const [token] = useCookies(['mr-token']);
  const [mode, setMode] = useState('none');
  const [selectedStore, setSelectedStore] = useState('');
  const [mySelectedRows, setMySelectedRows] = useState([]);

  const updatebtnClicked = (e) => {
    console.log("update clicked");
    if(mySelectedRows.length==1){
      setSelectedStore(stores.find(s => s.id==mySelectedRows[0]).storeCode);
      setMode('update');
    }
      
  };

  const handleSelection = (items) => {
    console.log(items);    
    setMySelectedRows(items.selectionModel);    
  }

  useEffect(() => {
    props.setTitle('Stores');

    API.getStoreList(token['mr-token'])
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
      // client permission to filter only his store, is handled in api
      data.forEach((item, i) => item.id = i+1);
      
      return setStores(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }, [mode]
  );

  const usertype = props.usertype;

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  return(    
    <div>
    { mode=='none' ?
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
        {usertype==1 && <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row'}}>
          <IconButton disabled={mySelectedRows.length == 1 ? false:true} onClick={updatebtnClicked} color='primary' variant='contained' ><EditIcon /></IconButton>
        </div>}
        <div style={{  width: '100%', minWidth:'600px', height: "calc(100vh - 100px"}}>
          <DataGrid rows={stores} columns={columns} components={{
            Toolbar: GridToolbar,
          }} checkboxSelection onSelectionModelChange={handleSelection} disableColumnMenu/>
        </div>
      </div>
      :
      <StoreForm id={ mode=='update' ? selectedStore : null } mode={mode} setMode={setMode}></StoreForm>
    }
    </div>
  );
}

export default StoreDetails;
