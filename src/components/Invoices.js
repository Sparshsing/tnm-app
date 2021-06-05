import API from '../api-service';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar} from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'

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

export default function Invoices(props){

  //{ id: 1, style: 'dummy1', size: 'dummy ' },
  //{ id: 2, style: 'dummy2', size: 'dummy ' }
  const [invoices, setInvoices] = useState([]);
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);
  const [printInvoice, setPrintInvoice] = useState(-1);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState(getDeafultStartDate());
  const [endDate, setEndDate] = useState(getDeafultEndDate());
  const usertype = parseInt(userInfo['mr-user'].split('-')[1]);

  const columns = [
    { field: 'id', headerName: 'Id', width: 150, hide: true },
    { field: 'startDate', headerName: 'Start Date', width: 150 },
    { field: 'endDate', headerName: 'End Date', width: 150 },
    { field: 'storeName', headerName: 'Store', width: 150 },
    { field: 'invoiceNo', headerName: 'Invoice Number', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'receipt', headerName: 'Receipt', width: 150,
        renderCell: (params) => {
            return(
            <Button
              variant="contained"
              size="small"
              data-pid={params.id}
              onClick={handleOpenReceipt}
              style={{ marginLeft: 16 }}
            >
              Open
            </Button>);
        },
        },
    { field: 'notes', headerName: 'Notes', width: 150 }  
  ];

  const handleOpenReceipt = (e) => {
    const pid = parseInt(e.currentTarget.dataset.pid);
    console.log(pid);
    setPrintInvoice(pid);
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
        setMessage('Something went wrong. Please refresh.');
      }
    })();
  }

  useEffect(() => {
    (async () => {
      props.setTitle('Invoices');
      try{
        const resp = await API.getInvoiceList(token['mr-token'])
        if(resp.status!=200)
          throw `invalid status ${resp.status} ${resp.statusText}`;
        const data = await resp.json();
        setInvoices(data);
      }
      catch(e){
        console.log("api error");
        console.error(e);
        setMessage('Something went wrong. Please refresh.');
      }
    })();
  }, []);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(printInvoice!=-1)
    return (<Redirect to={{pathname:'/printinvoice', state: {invoiceid: printInvoice}}}></Redirect>);
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
          /><Button color="primary" variant="contained" size="small" onClick={handleSubmit}>Generate Invoices</Button>
      </div>}
      <div style={{ width: '100%', minWidth:'600px', height:'calc(100vh - 100px)'}}>
        <DataGrid rows={invoices} columns={columns} components={{
          Toolbar: GridToolbar,
        }} />
      </div>
    </div>
  );
}