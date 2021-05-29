import API from '../api-service'
import React, {useState, useEffect} from 'react';
import {Button, TextField, MenuItem, Typography, Divider } from '@material-ui/core';
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'

function Dashboard(props){

  props.setTitle('DashBoard');

  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);
  const [errormsg, setErrormsg] = useState({});
  const [saved, setSaved, getSaved] = useState(false);
  const [availableProducts, setavailableProducts] = useState([]);
  const [availableStores, setAvailableStores] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedStore, setSelectedStore] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recievedData, setRecievedData] = useState({});

  const usertype = parseInt(userInfo['mr-user'].split('-')[1]);

  useEffect(() => {

    API.getStoreList(token['mr-token'])
    .then(resp => resp.json())
    .then(data => {
      
      data.unshift({storeName:'All', storeCode:'All'});
      return setAvailableStores(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});

    API.getInventoryList(token['mr-token'])
    .then(data => {
      console.log(data);
      return setInventory(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});

  }, []
  );

  const storeChanged = (e) => {
    console.log(e.target.value);
    setSelectedStore(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(selectedStore, typeof(startDate))
    const store = usertype==1 ? selectedStore : availableStores.filter(s => s.user==userInfo['mr-user'].split('-')[0])[0].storeCode;
    console.log(store);
    if(store=='')
      return;
    const params = {store, startDate, endDate}
    API.getOverview(token['mr-token'], params)
    .then(resp => {
      if(resp.status==200)
        return resp.json();
      else
        throw 'something went wrong';
    })
    .then(data => {setRecievedData(data)})
    .catch(e => console.log(e));
    
  }

  return (    
        <div>
        { usertype==1 &&
          <TextField
          variant="outlined"
          margin="normal"
          required
          select
          fullWidth
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
          }
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
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
          fullWidth
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
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>

          <Typography>
          <strong>Total Orders : </strong>{recievedData.total}
          </Typography>
          <Typography>
          <strong>Fulfilled : </strong>{recievedData.fulfilled}
          </Typography>
          <Typography>
          <strong>Unfulfilled : </strong>{recievedData.unfulfilled}
          </Typography>
          <Typography>
          <strong>OnHold : </strong>{recievedData.onhold}
          </Typography>
          <Typography>
          <strong>Out Of Stock : </strong>{recievedData.outofstock}
          </Typography>
          <Divider/>
          { usertype==1 &&
          <div>
            <Typography>
              <strong>Products : </strong> {[...new Set(inventory.map(i => i.style))].length}
            </Typography>
            <Typography>
            <strong>Store Count : </strong>{recievedData.storecount}
            </Typography>          
            <Typography>
            <strong>Inventory Needs :</strong>
            </Typography>
            <Divider/>
            <Typography>
            <ul>
            {inventory.filter(inv => inv.needToPurchase>0).map( (i) => (
                <li key={i.sfmId}>
                  <strong>{i.style} - {i.size} - {i.color} : </strong>{i.needToPurchase}
                </li>
            ))}
            </ul>
            </Typography>
          </div>
          }
      </div>
  );
}

export default Dashboard;