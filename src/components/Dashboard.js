import API from '../api-service'
import React, {useState, useEffect} from 'react';
import {Button, TextField, MenuItem, Typography, Divider, Paper } from '@material-ui/core';
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'

const getDeafultStartDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  //d.toISOString().split('T')[0];
  const offset = d.getTimezoneOffset()
  const d2 = new Date(d.getTime() - (offset*60*1000))
  return d2.toISOString().split('T')[0]
}

function Dashboard(props){

  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);
  const usertype = props.usertype;

  const [errormsg, setErrormsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [availableStores, setAvailableStores] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  
  const [startDate, setStartDate] = useState(getDeafultStartDate());
  const [endDate, setEndDate] = useState('');
  const [recievedData, setRecievedData] = useState({});

  useEffect(() => {
    (async () => {
      props.setTitle('Dashboard');
      try{
        const resp = await API.getStoreList(token['mr-token']);
        let stores = await resp.json();
        if(stores.length==0){
          throw 'No stores available';
        }
        if(usertype==0){
          const userid = userInfo['mr-user'].split('-')[0];
          stores = stores.filter(s => s.user==userid);
        }
        else
          stores.unshift({storeName:'All', storeCode:'All'});
        setAvailableStores(stores);
        let defaultStore = stores[0].storeCode;
        if(usertype==1)
          defaultStore = 'All';
        setSelectedStore(defaultStore);
        displaysummary(defaultStore, startDate, endDate);
      }catch(e){
        console.log("api error");
        console.error(e);
        setErrormsg('Something went wrong. Please refresh');
      }

      if(usertype==1){
        try{
          const invdata = await API.getInventoryList(token['mr-token']);
          //console.log(invdata);
          setInventory(invdata);
        }      
        catch(e){
          console.log("api error");
          console.error(e);
          setErrormsg('Something went wrong. Please refresh');
        }
      }
      setLoading(false);
    })();
  }, []
  );

  const storeChanged = (e) => {
    console.log(e.target.value);
    setSelectedStore(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(startDate, endDate);
    console.log(selectedStore, typeof(startDate))
    displaysummary(selectedStore, startDate, endDate);    
  }

  const displaysummary = (store, startDate, endDate) =>{
    console.log(store);
    if(store==''){
      setErrormsg('Please choose a store');
      return;
    }
    const params = {store, startDate, endDate}
    API.getOverview(token['mr-token'], params)
    .then(resp => {
      if(resp.status==200)
        return resp.json();
      else
        throw 'Something went wrong. Please make sure store is selected.';
    })
    .then(data => {setRecievedData(data)})
    .catch(err => {
      console.log(err);
      setErrormsg(String(err));
    });
  }

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(loading)
    return (<div>Loading. Please wait</div>);
  return (
        <div>
          {errormsg && <h3 style={{color:"red"}}>{errormsg}</h3>}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: "center"}}>
          <TextField
          variant="outlined"
          margin="normal"
          required
          select
          style={{minWidth: "250px"}}
          label="Store"
          name="store"
          value={selectedStore}
          onChange={storeChanged}
          >
            {availableStores.map((option) => (
              <MenuItem key={option.storeCode} value={option.storeCode}>
                {option.storeName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            label="Start Date"
            name="startDate"
            type="date"
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
            value = {endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
          Submit
          </Button>
          </div>
          <Paper style={{padding:"10px", margin: "5px", marginTop: "15px"}}>
            <Typography variant="h4">
              <strong>Orders Summary</strong>
            </Typography>
            <Typography>
            <strong>Total Orders &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>{recievedData.total}
            </Typography>
            <Typography>
            <strong>Fulfilled &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>{recievedData.fulfilled}
            </Typography>
            <Typography>
            <strong>Unfulfilled &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>{recievedData.unfulfilled}
            </Typography>
            <Typography>
            <strong>OnHold &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>{recievedData.onhold}
            </Typography>
            <Typography>
            <strong>Out Of Stock &nbsp;&nbsp;&nbsp;&nbsp;: </strong>{recievedData.outofstock}
            </Typography>
          </Paper>
          { usertype==1 &&
          <div>
            <Paper style={{padding:"10px", margin: "5px", marginTop: "15px"}}>
            <Typography variant="h4">
              <strong>General</strong>
            </Typography>
              <Typography>
                <strong>Products &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>
                {inventory.length>0 && [...new Set(inventory.map(i => i.style))].length}
              </Typography>
              <Typography>
              <strong>Store Count &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: </strong>{recievedData.storecount}
              </Typography>
            </Paper>
            <Paper style={{padding:"10px", margin: "5px", marginTop: "15px"}}>
              <Typography variant="h4">
                <strong>Inventory Needs</strong>
              </Typography>
              <table style={{padding: "20px"}}>
              {inventory.length>0 && inventory.filter(inv => inv.needToPurchase>0).map( (i) => (
                  <tr key={i.sfmId}>
                    <td><strong>{i.style} - {i.size} - {i.color} {}</strong></td>
                    <td><strong>: </strong>{i.needToPurchase}</td>
                  </tr>
              ))}
              </table>
            </Paper>
          </div>
          }
      </div>
  );
}

export default Dashboard;