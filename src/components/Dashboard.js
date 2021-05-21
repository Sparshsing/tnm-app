import API from '../api-service'
import React, {useState, useEffect} from 'react';
import {Button, TextField, MenuItem, Typography } from '@material-ui/core';
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'

function Dashboard(){

  const [token] = useCookies(['mr-token']);
  const [errormsg, setErrormsg] = useState({});
  const [saved, setSaved, getSaved] = useState(false);
  const [availableProducts, setavailableProducts] = useState([]);
  const [availableStores, setAvailableStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // API.getProductList(token['mr-token'])
    // .then(resp => resp.json())
    // .then(data => {
    //   //console.log(data); 
    //   const sortBy = [ 
    //     {prop:'style', direction: 1}, 
    //     {prop:'size', direction: 1}, 
    //     {prop:'color', direction: 1},
    //   ];

    //   data.sort(function(a,b){
    //     let i = 0, result = 0;
    //     while(i < sortBy.length && result === 0) {
    //       result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
    //       i++;
    //     }
    //     return result;
    //   })
    //   return setavailableProducts(data);
    // })
    // .catch(e => {console.log("api error"); console.error(e)});

    API.getStoreList(token['mr-token'])
    .then(resp => resp.json())
    .then(data => {
      
      data.unshift({storeName:'All', storeCode:'All'});
      console.log(data);
      return setAvailableStores(data);
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

  }

  return (    
        <div>
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
          <strong>Total Orders </strong>{selectedStore}
          </Typography>
          <Typography>
          <strong>Fulfilled </strong>{selectedStore}
          </Typography>
          <Typography>
          <strong>Unfulfilled </strong>{selectedStore}
          </Typography>
          <Typography>
          <strong>OnHold </strong>{selectedStore}
          </Typography>
          <Typography>
          <strong>Out Of Stock </strong>{selectedStore}
          </Typography>
        </div>
  );
}

export default Dashboard;