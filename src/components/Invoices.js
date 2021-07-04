import API from '../api-service';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar} from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import {Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import GridCellExpand from './GridCellExpand';
import AuthenticationService from '../authentication-service';


const getDeafultStartDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - 7);
  const offset = d.getTimezoneOffset();
  const d2 = new Date(d.getTime() - (offset*60*1000));
  return d2.toISOString().split('T')[0];
}

const getDeafultEndDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - 1);
  const offset = d.getTimezoneOffset();
  const d2 = new Date(d.getTime() - (offset*60*1000));
  return d2.toISOString().split('T')[0];
}

const useStyles = makeStyles({
  root: {
    '& .compactcell': {
      padding: '0px 8px'
    },
  },
  
  redcolor: {
    background: 'red',
    color: 'white'
  },
  greencolor: {
    background: 'green',
    color: 'white'
  },
  inputbtn: {
    display: 'none',
  }

});

export default function Invoices(props){
  const classes = useStyles();

  //{ id: 1, style: 'dummy1', size: 'dummy ' },
  //{ id: 2, style: 'dummy2', size: 'dummy ' }
  const [invoices, setInvoices] = useState([]);
  const [token] = useCookies(['mr-token']);
  const [message, setMessage] = useState('');
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [notesRowId, setNotesRowId] = useState(null);
  const [startDate, setStartDate] = useState(getDeafultStartDate());
  const [endDate, setEndDate] = useState(getDeafultEndDate());
  const usertype = props.usertype;

  const columns = [
    { field: 'id', headerName: 'Id', width: 100, hide: true },
    // { field: 'receipt', headerName: 'Receipt', width: 110,
    //     renderCell: (params) => {
    //         return(
    //         <Button
    //           variant="contained"
    //           color="primary"
    //           size="small"
    //           data-pid={params.id}
    //           onClick={handleOpenReceipt}
    //         >
    //           Open
    //         </Button>);
    //     },
    // },
    { field: 'receipt', headerName: 'Receipt', width: 70, cellClassName: 'compactcell', headerClassName: 'compactcell',
        renderCell: (params) => {
            return(
            <Link
              size="small"
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
            </Link>);
        },
    },
    { field: 'uploadbtn', headerName: 'Upload', width: 70, cellClassName: 'compactcell', headerClassName: 'compactcell',
        renderCell: (params) => {
          return(
            <div>
            <input type="file" name={"myfile"+params.id} id={"myfile"+params.id} onChange={handleReceiptUpload} className={classes.inputbtn} data-pid={params.id}/>
            <label htmlFor={"myfile"+params.id}>
              <IconButton color="primary" aria-label="upload file" component="span" >
                <CloudUploadOutlinedIcon/>
              </IconButton>
            </label>
            </div>);
        },
    },
    { field: 'startDate', headerName: 'Start Date', width: 110 },
    { field: 'endDate', headerName: 'End Date', width: 110 },
    { field: 'storeName', headerName: 'Store', width: 150, renderCell: (params) => (<GridCellExpand limit={14} value={params.value ? params.value.toString() : ''} width={300} />) },
    { field: 'invoiceNo', headerName: 'Invoice Number', width: 200 },
    { field: 'status', headerName: 'Status', width: 110,
      renderCell: (params) => {
          return(
          <Button
            variant="contained"
            className={params.value=="Paid" ? classes.greencolor : classes.redcolor}
            size="small"
            data-pid={params.id}
            onClick={handleStatusChange}
          >
            {params.value}
          </Button>);
      },
    },
    { field: 'total', headerName: 'Total', width: 110 },
    { field: 'attachment', headerName: 'View PDF', width: 110,
        renderCell: (params) => {
            return(
            <Link
              size="small"
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
            </Link>);
        },
    },
    { field: 'notes', headerName: 'Notes', width: 200,
      renderCell: (params) => (<Button onClick={handleNotesClick} data-oid={params.id}>{params.value.substring(0,14) + '...'}</Button>)
    },    
  ];

  const handleStatusChange = (e) => {
    const pid = parseInt(e.currentTarget.dataset.pid);
    let rowdata = invoices.find(p => p.id == pid);
    const status = rowdata.status=='Paid' ? 'UnPaid': 'Paid'
    const newRow = {...rowdata, status}
    API.updateInvoice(token['mr-token'], pid, newRow)
      .then(resp => {
        if(resp.status==200) return resp.json();
        if(resp.status==400) throw JSON.stringify(resp.json());
        else throw 'Unknown reason. Please refresh';
      })
      .then(data => {
        console.log(data);
        alert("Status Changed Successfully");
        setMessage("Status Changed Successfully");
        fetchList();
      })
      .catch(err => {console.log('api error');console.error(err); setMessage('Something went wrong, ' + String(err))});

    console.log(e.target.value);
  }

  const handleReceiptUpload = (e) => {
    if(e.target.files.length==1){
      const selectedFile = e.target.files[0];
      console.log("file is: ", selectedFile)
      
      const pid = parseInt(e.currentTarget.dataset.pid);
      const formData = new FormData();

		  formData.append('receipt', selectedFile);

      API.uploadReceipt(token['mr-token'], pid, formData)
      .then(resp => {
        if(resp.status==200) return resp.json();
        if(resp.status==400) throw JSON.stringify(resp.json());
        else throw 'Unknown reason. Please refresh';
      })
      .then(data => {
        console.log(data);
        alert("File Uploaded Successfully");
        setMessage('File Uploaded Successfully');
        fetchList();
      })
      .catch(err => {console.log('api error');console.error(err); setMessage('Something went wrong, ' + String(err))});
    }
    
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(startDate, endDate);
    (async () => {
      try{
        const resp = await API.generateInvoices(token['mr-token'], {startDate, endDate})
        if(resp.status!=200)
          throw `invalid status ${resp.status} ${resp.statusText}`;
        const result = await resp.json();
        setMessage(`${result['count']} invoices created `, String(result['errors']));
      }
      catch(e){
        console.log("api error");
        console.error(e);
        setMessage('Something went wrong. See logs in admin panel. Please refresh.');
      }
    })();
  }

  useEffect(() => {
    props.setTitle('Invoices');
    fetchList();
  }, []);

  const fetchList = async () => {
    
    try{
      const resp = await API.getInvoiceList(token['mr-token'])
      if(resp.status==200)
        setInvoices(await resp.json());
      else if(resp.status==401) AuthenticationService.handleUnauthorized();
      else throw 'Something went wrong';  
    }
    catch(e){
      console.log("api error");
      console.error(e);
      setMessage('Something went wrong. Please refresh.');
    }
  }

  const handleNotesClose = (e) => {setNotesOpen(false)};

  const handleNotesClick = (e) => {
    const oid = parseInt(e.currentTarget.dataset.oid);
    setNotesRowId(oid);
    const rowdata = invoices.find(o => o.id == oid);
    setNotesText(rowdata.notes);
    setNotesOpen(true);
  }

  const handleNotesSave = (e) => {

    if(notesText=='')
      return;
    const notes = notesText;
    const pid = notesRowId;
    const rowdata = invoices.find(i => i.id == pid);
    const newRow = {...rowdata, notes}
    let badData = false;
    API.updateInvoice(token['mr-token'], pid, newRow)
      .then(resp => {
        if(resp.status==200) return resp.json();
        if(resp.status==400) { badData=true; return resp.json();}
        else throw 'Unknown reason. Please refresh';
      })
      .then(data => {
        if(badData)
          throw JSON.stringify(data);
        console.log(data);
        alert("Notes Updated Successfully");
        setMessage("Notes Updated Successfully");
        fetchList();
      })
      .catch(err => {console.log('api error');console.error(err); setMessage('Something went wrong, ' + String(err))});
    
      setNotesOpen(false);
  }

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      {message!='' && <div style={{color:"red"}}>{message}</div>}
      {usertype==1 && 
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', flexWrap: 'wrap', flexDirection: 'row'}}>
          <TextField
            variant="outlined"
            margin="normal"
            label="Start Date"
            name="startDate"
            type="date"
            size="small"
            value = {startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            label="End Date"
            name="endtDate"
            type="date"
            size="small"
            value = {endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button color="primary" variant="contained" size="small" onClick={handleSubmit}>Generate Invoices</Button>
          <Dialog
            open={notesOpen}
            maxWidth='lg'
            fullWidth={true}
            onClose={handleNotesClose}
          >
            <DialogTitle>Notes</DialogTitle>
            <DialogContent>
            <TextField multiline value={notesText} text='Notes' variant='outlined' rows={4} fullWidth={true} helperText='Notes cannot be empty'
              onChange={(e) => setNotesText(e.target.value)}></TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNotesClose} color="primary">Cancel</Button>
              <Button onClick={handleNotesSave} color="primary" autoFocus>Save</Button>
            </DialogActions>
          </Dialog>
        </div>
      }
      <div style={{ width: '100%', minWidth:'600px', height:'calc(100vh - 100px)'}} className={classes.root}>
        <DataGrid rows={invoices} columns={columns} components={{
          Toolbar: GridToolbar,
        }} disableColumnMenu/>
      </div>
    </div>
  );
}