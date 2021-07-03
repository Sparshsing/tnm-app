import API from '../api-service';
import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar} from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import GridCellExpand from './GridCellExpand';


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
  redcolor: {
    background: 'red',
    color: 'white'
  },
  greencolor: {
    background: 'green',
    color: 'white'
  }

});

export default function Invoices(props){
  const classes = useStyles();

  //{ id: 1, style: 'dummy1', size: 'dummy ' },
  //{ id: 2, style: 'dummy2', size: 'dummy ' }
  const [invoices, setInvoices] = useState([]);
  const [token] = useCookies(['mr-token']);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState(getDeafultStartDate());
  const [endDate, setEndDate] = useState(getDeafultEndDate());
  const usertype = props.usertype;

  const columns = [
    { field: 'id', headerName: 'Id', width: 150, hide: true },
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
    { field: 'attachment', headerName: 'Receipt', width: 110,
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
    { field: 'startDate', headerName: 'Start Date', width: 130 },
    { field: 'endDate', headerName: 'End Date', width: 130 },
    { field: 'storeName', headerName: 'Store', width: 170, renderCell: (params) => (<GridCellExpand limit={16} value={params.value ? params.value.toString() : ''} width={300} />) },
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
    { field: 'notes', headerName: 'Notes', width: 200, renderCell: (params) => (<GridCellExpand limit={19} value={params.value ? params.value.toString() : ''} width={300} />) }  
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
        const updatedRows = invoices.map((row) => {
          if (row.id == data.id)
            return data;          
          return row;
        });
        setMessage('Status Updated');
        setInvoices(updatedRows);
      })
      .catch(err => {console.log('api error');console.error(err); setMessage('Something went wrong, ' + String(err))});

    console.log(e.target.value);
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
        }} disableColumnMenu/>
      </div>
    </div>
  );
}