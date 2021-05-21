import API from '../api-service'
import React, {useState, useEffect} from 'react';
import {Button, TextField, FormLabel, Typography, MenuItem, FormControl, InputLabel, Input, FormHelperText} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useCookies } from 'react-cookie'
import { Redirect } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({    
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function OrderUpdateForm(props){

  const classes = useStyles();
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-user']);
  const [errormsg, setErrormsg] = useState({});
  const [saved, setSaved, getSaved] = useState(false);
  const [data, setData] = useState({});
  const [dataReturned, setDataReturned] = useState(false);
  const [availableProducts, setavailableProducts] = useState([]);
  const [availableStores, setAvailableStores] = useState([]);
  const states = ['', 'Shipped', 'Printed', 'Fulfilled', 'Unfulfilled', 'On Hold']


  let badData = false;
  console.log("opened form");
  const usertype = parseInt(userInfo['mr-user'].split('-')[1]);

  useEffect(() => {

    API.getOrder(token['mr-token'], props.id)
    .then(resp => resp.json())
    .then(result => {
      console.log("initializing formdata");
      setData(result);
      setDataReturned(true)
    })
    .catch(e =>{console.log("api error");console.error(e)});

    API.getProductList(token['mr-token'])
    .then(resp => resp.json())
    .then(data => {
      //console.log(data); 
      const sortBy = [ 
        {prop:'style', direction: 1}, 
        {prop:'size', direction: 1}, 
        {prop:'color', direction: 1},
      ];

      data.sort(function(a,b){
        let i = 0, result = 0;
        while(i < sortBy.length && result === 0) {
          result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
          i++;
        }
        return result;
      })
      return setavailableProducts(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});

    API.getStoreList(token['mr-token'])
    .then(resp => resp.json())
    .then(data => {
      //console.log(data); 
      
      return setAvailableStores(data);
    })
    .catch(e => {console.log("api error"); console.error(e)});
  }, []
  );

  const handleClientFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);    
    let dataObject = {};    
    formData.forEach((value, key) => dataObject[key] = value);
    let splitArray = dataObject['sfmId'].split("-");
    dataObject['style'] = splitArray.slice(0, splitArray.length-2).join('-');
    dataObject['size'] = splitArray[splitArray.length-2];
    dataObject['color'] = splitArray[splitArray.length-1];
    dataObject = {...data, ...dataObject}
    console.log(dataObject);
    API.updateOrder(token['mr-token'], props.id, dataObject)
    .then(resp => {
      if(resp.status==400) {console.log(resp); setSaved(false); badData=true; } 
      if(resp.status==200) { setSaved(true); }
      return resp.json()
    })
    .then(data => {if(badData) setErrormsg(data)})
    .catch(error => {console.log("api error"); console.error(error)});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);    
    let dataObject = {};    
    formData.forEach((value, key) => dataObject[key] = value);
    let splitArray = dataObject['sfmId'].split("-");
    dataObject['style'] = splitArray.slice(0, splitArray.length-2).join('-');
    dataObject['size'] = splitArray[splitArray.length-2];
    dataObject['color'] = splitArray[splitArray.length-1];
    if(dataObject['saleDate'] == "")
      dataObject['saleDate'] = null;
    if(dataObject['shipDate'] == "")
      dataObject['shipDate'] = null;
    console.log("sending data");
    console.log(dataObject);

    API.updateOrder(token['mr-token'], props.id, dataObject)
    .then(resp => {
      if(resp.status==400) {console.log(resp); setSaved(false); badData=true; } 
      if(resp.status==200) { setSaved(true); }
      return resp.json()
    })
    .then(data => {if(badData) setErrormsg(data)})
    .catch(error => {console.log("api error"); console.error(error)});
  };

  const handleGoBack = (e) => {
    props.setMode('none');
  }
  console.log('rendering');
  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(saved)
    return(<div>Saved Succcesfully <Button onClick={handleGoBack}>Go back to Orders</Button></div>);
  if(!dataReturned)
    return <div>Loading</div>
  return(
    <div>
      <div style={{display:'flex'}}>
        <Typography>Update</Typography>
        <Button onClick={handleGoBack}>Go back</Button>
      </div>
      {usertype==0 ?
          <form className={classes.form} onSubmit={handleClientFormSubmit} >
          { Object.keys(errormsg).length!=0 && <FormLabel error={true} >Invalid data {errormsg['form']}</FormLabel>}      
          <FormLabel>Order Id: {data['orderId']} ------ Order No: {data['orderNo']}</FormLabel>
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            select
            required
            id="sfmId"
            label="Style - Size - Color"
            name="sfmId"
            helperText = {errormsg['sfmId'] ? errormsg['sfmId'][0]:''}
            error = {errormsg['sfmId'] ? true: false}
            defaultValue = {data['sfmId']}
          >
          {availableProducts.map((option) => (
            <MenuItem key={option.sfmId} value={option.sfmId}>
              {option.sfmId}
            </MenuItem>
          ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="design"
            label="design"
            name="design"
            helperText = {errormsg['design'] ? errormsg['design'][0]:''}
            error = {errormsg['design'] ? true: false}
            defaultValue = {data['design']}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
        :
        <form className={classes.form} onSubmit={handleSubmit} >
          { Object.keys(errormsg).length!=0 && <FormLabel error={true} >Invalid data {errormsg['form']}</FormLabel>}      
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            select
            fullWidth
            id="store"
            label="Store Name"
            name="store"
            helperText = {errormsg['store'] ? errormsg['store'][0]:''}
            error = {errormsg['store'] ? true: false}
            defaultValue = {data['store']}
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
            select
            id="orderStatus"
            label="Order Status"
            name="orderStatus"
            helperText = {errormsg['orderStatus'] ? errormsg['orderStatus'][0]:''}
            error = {errormsg['orderStatus'] ? true: false}
            defaultValue = {data['orderStatus']}
          >
          {states.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="saleDate"
            label="Sale Date"
            name="saleDate"
            type="date"
            helperText = {errormsg['saleDate'] ? errormsg['saleDate'][0]:''}
            error = {errormsg['saleDate'] ? true: false}
            defaultValue = {data['saleDate']}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="orderNo"
            label="Order No"
            name="orderNo"
            inputProps={{maxLength:20}}
            helperText = {errormsg['orderNo'] ? errormsg['orderNo'][0]:''}
            error = {errormsg['orderNo'] ? true: false}
            defaultValue = {data['orderNo']}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="recipientName"
            label="Recipient Name"
            name="recipientName"
            inputProps={{maxLength:50}}
            helperText = {errormsg['recipientName'] ? errormsg['recipientName'][0]:''}
            error = {errormsg['recipientName'] ? true: false}
            defaultValue = {data['recipientName']}
            type="hidden"
          />
          

          {/*
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="style"
            label="Style"
            name="style"
            disabled = {props.mode=='update' ? true:false}
            helperText = {errormsg['style'] ? errormsg['style'][0]:''}
            error = {errormsg['style'] ? true: false}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="size"
            label="Size"
            name="size"
            disabled = {props.mode=='update' ? true:false}
            helperText = {errormsg['size'] ? errormsg['size'][0]:''}
            error = {errormsg['size'] ? true: false}
          />
          <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="color"
          label="Color"
          name="color"
          disabled = {props.mode=='update' ? true:false}
          helperText = {errormsg['color'] ? errormsg['color'][0]:''}
          error = {errormsg['color'] ? true: false}
          /> */}
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            select
            required
            id="sfmId"
            label="Style - Size - Color"
            name="sfmId"
            helperText = {errormsg['sfmId'] ? errormsg['sfmId'][0]:''}
            error = {errormsg['sfmId'] ? true: false}
            defaultValue = {data['sfmId']}
          >
          {availableProducts.map((option) => (
            <MenuItem key={option.sfmId} value={option.sfmId}>
              {option.sfmId}
            </MenuItem>
          ))}
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="design"
            label="design"
            name="design"
            helperText = {errormsg['design'] ? errormsg['design'][0]:''}
            error = {errormsg['design'] ? true: false}
            defaultValue = {data['design']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            required
            select
            id="processing"
            label="Processing"
            name="processing"
            inputProps={{maxLength:1}}
            helperText = {errormsg['processing'] ? errormsg['processing'][0]:''}
            error = {errormsg['processing'] ? true: false}
            defaultValue = {data['processing']}
          >
            <MenuItem key={0} value={'N'}>No</MenuItem>
            <MenuItem key={1} value={'Y'}>Yes</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            select
            id="printed"
            label="Printed"
            name="printed"
            inputProps={{maxLength:1}}
            helperText = {errormsg['printed'] ? errormsg['printed'][0]:''}
            error = {errormsg['printed'] ? true: false}
            defaultValue = {data['printed']}
          >
            <MenuItem key={0} value={'N'}>No</MenuItem>
            <MenuItem key={1} value={'Y'}>Yes</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            required
            select
            id="shipped"
            label="Shipped"
            name="shipped"
            inputProps={{maxLength:1}}
            helperText = {errormsg['shipped'] ? errormsg['shipped'][0]:''}
            error = {errormsg['shipped'] ? true: false}
            defaultValue = {data['shipped']}
          >
            <MenuItem key={0} value={'N'}>No</MenuItem>
            <MenuItem key={1} value={'Y'}>Yes</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="sfmNotes"
            label="SFM Notes"
            name="sfmNotes"
            helperText = {errormsg['sfmNotes'] ? errormsg['sfmNotes'][0]:''}
            error = {errormsg['sfmNotes'] ? true: false}
            defaultValue = {data['sfmNotes']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="Buyer Name"
            label="buyerName"
            name="buyerName"
            helperText = {errormsg['buyerName'] ? errormsg['buyerName'][0]:''}
            error = {errormsg['buyerName'] ? true: false}
            defaultValue = {data['buyerName']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            type="email"
            id="buyerEmail"
            label="Buyer Email"
            name="buyerEmail"
            helperText = {errormsg['buyerEmail'] ? errormsg['buyerEmail'][0]:''}
            error = {errormsg['buyerEmail'] ? true: false}
            defaultValue = {data['buyerEmail']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="buyerComments"
            label="Buyer Comments"
            name="buyerComments"
            helperText = {errormsg['buyerComments'] ? errormsg['buyerComments'][0]:''}
            error = {errormsg['buyerComments'] ? true: false}
            defaultValue = {data['buyerComments']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="giftMessages"
            label="Gift Messages"
            name="giftMessages"
            helperText = {errormsg['giftMessages'] ? errormsg['giftMessages'][0]:''}
            error = {errormsg['giftMessages'] ? true: false}
            defaultValue = {data['giftMessages']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="sku"
            label="SKU"
            name="sku"
            inputProps={{maxLength:20}}
            helperText = {errormsg['sku'] ? errormsg['sku'][0]:''}
            error = {errormsg['sku'] ? true: false}
            defaultValue = {data['sku']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="shipDate"
            label="shipDate"
            name="shipDate"
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            helperText = {errormsg['shipDate'] ? errormsg['shipDate'][0]:''}
            error = {errormsg['shipDate'] ? true: false}
            defaultValue = {data['shipDate']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="priorityShip"
            label="priorityShip"
            name="priorityShip"
            helperText = {errormsg['priorityShip'] ? errormsg['priorityShip'][0]:''}
            error = {errormsg['priorityShip'] ? true: false}
            defaultValue = {data['priorityShip']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="customerPaidShipping"
            label="Customer Paid Shipping $"
            name="customerPaidShipping"
            type="number"
            inputProps={{step:0.01}}
            helperText = {errormsg['customerPaidShipping'] ? errormsg['customerPaidShipping'][0]:''}
            error = {errormsg['customerPaidShipping'] ? true: false}
            defaultValue = {data['customerPaidShipping']}
          />
          <TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="trackingNumber"
            label="Tracking Number"
            name="trackingNumber"
            helperText = {errormsg['trackingNumber'] ? errormsg['trackingNumber'][0]:''}
            error = {errormsg['trackingNumber'] ? true: false}
            defaultValue = {data['trackingNumber']}
          />
          {/*<TextField
            variant="outlined"
            margin="normal"        
            fullWidth
            id="productAvailability"
            label="Product Availability"
            name="productAvailability"
            helperText = {errormsg['productAvailability'] ? errormsg['productAvailability'][0]:''}
            error = {errormsg['productAvailability'] ? true: false}
          />*/}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      }
    </div>); 
}