import '../App.css';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar, GridRowsProp, GridColDef } from '@material-ui/data-grid';
import API from '../api-service'
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'
import { Divider, Button, TextField } from '@material-ui/core';
import PurchaseForm from './PurchaseForm';



function PurchaseList(){
  //{ id: 1, sfmId: 'dummy1', style: 'dummy style' },
  //{ id: 2,  sfmId: 'dummy2', style: 'dummy style' }
  const [purchases, setPurchases] = useState([]);
  
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

  const columns = [
    { field: 'id', headerName: 'Purchase Id', width: 150, hide:true },
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
    { field: 'style', headerName: 'Style', width: 150 },
    { field: 'size', headerName: 'Size', width: 150 },
    { field: 'color', headerName: 'Color', width: 150 },
    { field: 'company', headerName: 'Company' },
    { field: 'warehouse', headerName: 'Warehouse', width: 150 },
    { field: 'ordered', headerName: 'Ordered', width: 150 },
    { field: 'orderDate', headerName: 'Order Date', width: 150},
    { field: 'arrivalDate', headerName: 'Arrival Date', width: 150 },
    { field: 'sfmId', headerName: 'SFM ID', width: 150 }
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
        else throw 'Something went wrong. Please Refresh';
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
    console.log('useeffect called');
    if(mode=='none')
      fetchList();    
  }, [token, mode]
  );

  function fetchList(){    
      console.log("fetching data");
      API.getPurchasesList(token['mr-token'])
      .then(data => {
        console.log(data);
        // not needed as purchases object already contains field called id
        // data.forEach((item, i) => item.id = i+1);
        setMySelectedRows([]);
        setPurchases(data);
      })
      .catch(e => {console.log("api error"); console.error(e);});    
  }

  useEffect( () => {    
    console.log(token);    
  }, [mode]);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  else
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <h3>Purchases</h3>
      {message=='' ? '' : <div>{message}</div>}
      <Divider style={{  width: '100%', marginBottom: '10px' }}/>
      { mode=='none' ?
        <div>
          <Button style={{ width: '60px', marginBottom:'10px'}} color='primary' variant='contained' onClick={handleAddClick}>Add</Button>
          <Button style={{ width: '60px', marginBottom:'10px'}} disabled={mySelectedRows.length == 1 ? false:true} onClick={updatebtnClicked} color='primary' variant='contained' >Update</Button>
          <form ><TextField type="file" name="myfile" onChange={fileChangeHandler}></TextField><Button type="submit" disabled={!isFilePicked} onClick={handleUpload} color='primary' variant='contained'>Import</Button></form>
          <div style={{  width: '100%', minWidth:'600px', flexGrow: 1}}>
            <DataGrid rows={purchases} columns={columns} checkboxSelection autoHeight={true} components={{
              Toolbar: GridToolbar,
            }} onSelectionModelChange={handleSelection} disableSelectionOnClick={true}/>
          </div>
        </div>
        :
        <PurchaseForm id={ mode=='update' ? mySelectedRows : null }  data={ mode=='update' ? recordDetails : null} mode={mode} setMode={setMode}></PurchaseForm>
      }           
    </div>
  );
}

export default PurchaseList;