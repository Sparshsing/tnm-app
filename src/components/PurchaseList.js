import '../App.css';
import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import { Divider, Button, TextField, Dialog, DialogTitle, DialogActions, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PurchaseForm from './PurchaseForm';
import GridCellExpand from './GridCellExpand';


function PurchaseList(props){

  //{ id: 1, sfmId: 'dummy1', style: 'dummy style' },
  //{ id: 2,  sfmId: 'dummy2', style: 'dummy style' }
  const [purchases, setPurchases] = useState([]);
  const [searchFilteredPurchases, setSearchFilteredPurchases] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);
  const [mode, setMode] = useState('none');
  const [mySelectedRows, setMySelectedRows] = useState([]);
  const [recordDetails, setRecordDetails] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

	const fileChangeHandler = (event) => {
    if(event.target.files.length==1){
      setSelectedFile(event.target.files[0]);
      console.log("file is: ", event.target.files[0]);
      setIsFilePicked(true);
    }
    else{
      setSelectedFile(null);
      setIsFilePicked(false);
    }
	};

  const handleDeleteClick = (e) => {setOpen(true)}
  const handleClose = (e) => {setOpen(false)}

  const handleDeleteConfirm = (e) => {
    console.log('u confirmed delete');
    let errors = [];
    const deleteRows = async () => {
      for(let rowId of mySelectedRows) {
        try{
          const resp = await API.deletePurchase(token['mr-token'], rowId);
          if(resp.status==200 || resp.status==204){
            console.log(`deleted purchase with id ${rowId}`);
          }          
          else{
            console.log(`Failed to delete purchase with id ${rowId}`);
            throw `Failed to delete purchase with id ${rowId}`;
          }
        }
        catch(e){
          console.error(`could not delete purchase id ${rowId}`, e);
          errors.push(`could not delete purchase id ${rowId}`);
        }
      }

      if(errors.length>0)
        setMessage('Some rows were not deleted\n' + errors.toString() + ' Pleae refresh');
      else
        setMessage('Deleted successfully. Please refresh');

    }
    setOpen(false);
    deleteRows();

  }

  const columns = [
    { field: 'id', headerName: 'Purchase Id', width: 70, hide:true },
    { field: 'status', headerName: 'Status', width: 150,
      renderCell: (params) => {
          return(
          <Button
            variant="contained"
            color= { params.value=="In Transit" ? "secondary":"primary" }
            size="small"
            data-pid={params.id}
            onClick={handleStatusChange}
            style={{ marginLeft: 16 }}
          >
            {params.value}
          </Button>);
      },
      },
    { field: 'style', headerName: 'Style', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />)  },
    { field: 'size', headerName: 'Size', width: 80 },
    { field: 'color', headerName: 'Color', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />)  },
    { field: 'company', headerName: 'Company', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />)  },
    { field: 'warehouse', headerName: 'Warehouse', width: 150 },
    { field: 'ordered', headerName: 'Ordered', width: 150 },
    { field: 'orderDate', headerName: 'Order Date', width: 150},
    { field: 'arrivalDate', headerName: 'Arrival Date', width: 150 },
    { field: 'sfmId', headerName: 'SFM ID', hide: true, width: 300, renderCell: (params) => (<GridCellExpand limit={28} value={params.value ? params.value.toString() : ''} width={400} />)  }
  ];

  const handleStatusChange = (e) => {
    const pid = parseInt(e.currentTarget.dataset.pid);
    let rowdata = purchases.find(p => p.id == pid);
    const status = rowdata.status=='In Transit' ? 'Received': 'In Transit'
    const newRow = {...rowdata, status}
    console.log(newRow);
    API.updatePurchase(token['mr-token'], pid, newRow)
      .then(resp => {
        if(resp.status==200) return resp.json();
        if(resp.status==400) throw JSON.stringify(resp.json());
        else throw 'Unknown reason. Please refresh';
      })
      .then(data => {
        const updatedRows = purchases.map((row) => {
          if (row.id == data.id)
            return data;          
          return row;
        });
        setMessage('updated purchase');
        console.log(updatedRows.map(x => x.id));
        setPurchases(updatedRows);
      })
      .catch(err => {console.log('api error');console.error(err); setMessage('Something went wrong, ' + String(err))});
    
  }

	const handleUpload = (e) => {
    e.preventDefault();

    const formData = new FormData();

		formData.append('purchaseFile', selectedFile);

    if(isFilePicked && selectedFile.name.search(/purchase/i) == -1){
      setMessage('Please make sure you have selected purchase file. File name should contain the word purchase');
      return;
    }

		API.uploadPurchasesFile(token['mr-token'], formData)
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
        fetchList();
        setMode('none');
        setIsFilePicked(false);
			})
			.catch((error) => {
				console.error('Error:', error);
        setMessage('Failed import due to unknown reasons');
			});
	};

  const updatebtnClicked = (e) => {
    console.log("update clicked");
    if(mySelectedRows.length==1)    
      API.getPurchase(token['mr-token'], mySelectedRows[0])
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
  

  useEffect(() => {
    props.setTitle('Purchases');
    console.log('useeffect called');
    if(mode=='none')
      fetchList();    
  }, [token, mode]
  );

  useEffect(() => {
    updateSearchFilteredPurchases(searchString);
  }, [purchases]
  );

  const updateSearchFilteredPurchases = (theSearchString) =>{
    let rows = [...purchases];
    if(theSearchString!='')
        rows = rows.filter(r => {
          const str = theSearchString.toLowerCase()
          return r.style.toLowerCase().search(str)>=0 ||
          r.size.toLowerCase().search(str)>=0 ||
          r.color.toLowerCase().search(str)>=0 ||
          r.warehouse.toLowerCase().search(str)>=0 ||
          r.company.toLowerCase().search(str)>=0;
          
        })
    setMySelectedRows([]);
    setSearchFilteredPurchases(rows);
  }

  function fetchList(){
      console.log("fetching data");
      API.getPurchasesList(token['mr-token'])
      .then(resp => {
        if(resp.status==200)
          return resp.json()
        else throw 'Something went wrong';
      })
      .then(data => {
        console.log(data);
        // not needed as purchases object already contains field called id
        // data.forEach((item, i) => item.id = i+1);
        setMySelectedRows([]);
        setPurchases(data);
      })
      .catch(e => {console.log("api error"); console.error(e); setMessage(String(e))});    
  }


  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(parseInt(userInfo['mr-user'].split('-')[1])==0)
    return (<Redirect to='/'></Redirect>);
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      {message=='' ? '' : <div style={{color:'red'}}>{message}</div>}
      { mode=='none' ?
        <div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', flexDirection: 'row'}}>
            <div>
            <IconButton  color='primary' variant='contained' onClick={handleAddClick}><AddCircleIcon /></IconButton>
            <IconButton disabled={mySelectedRows.length == 1 ? false:true} onClick={updatebtnClicked} color='primary' variant='contained' ><EditIcon /></IconButton>
            <IconButton variant="contained" color="secondary" disabled={mySelectedRows.length>0 ? false:true} onClick={handleDeleteClick}><DeleteIcon /></IconButton>
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
            <form ><input type="file" name="myfile" id="myfile" onChange={fileChangeHandler} hidden></input><label htmlFor="myfile" className="file-input-label">Choose File</label><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import</Button></form>
            <div>
                <TextField variant="outlined" size="small" margin="none" type="text" value={searchString} text='Search' onChange={(e) => setSearchString(e.target.value)} onKeyPress={e => e.key=="Enter" && updateSearchFilteredPurchases(e.target.value)}></TextField>
                <Button color="primary" variant="contained" onClick={e => updateSearchFilteredPurchases(searchString)}>Search</Button>
            </div>
          </div>
          <div style={{  width: '100%', minWidth:'600px', flexGrow: 1}}>
            <DataGrid rows={searchFilteredPurchases} columns={columns} checkboxSelection autoHeight={true} components={{
              Toolbar: GridToolbar,
            }} onSelectionModelChange={handleSelection} disableSelectionOnClick={true} disableColumnMenu/>
          </div>
        </div>
        :
        <PurchaseForm id={ mode=='update' ? mySelectedRows : null }  data={ mode=='update' ? recordDetails : null} mode={mode} setMode={setMode}></PurchaseForm>
      }           
    </div>
  );
}

export default PurchaseList;
