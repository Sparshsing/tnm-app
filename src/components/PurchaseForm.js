import API from '../api-service'
import React, {useState, useEffect} from 'react';
import {Button, TextField, FormLabel, Typography, MenuItem, Dialog, DialogTitle, DialogActions} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useCookies } from 'react-cookie'
import { setGridPageSizeStateUpdate } from '@material-ui/data-grid';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({    
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function PurchaseForm(props){

  const classes = useStyles();
  const [token] = useCookies(['mr-token']);
  const [errormsg, setErrormsg] = useState({});
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState([]);
  const [availableStyles, setAvailableStyles] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  let badData = false;
  console.log("opened form");
  console.log(availableStyles);
  console.log(availableProducts);

  useEffect(() => {
    API.getProductList(token['mr-token'])
    .then(data => {
      const styles = data.map( d => d.style);
      setAvailableStyles([...new Set(styles)]);
      const sizes = data.map( d => d.size)
      setAvailableSizes([...new Set(sizes)]);
      const colors = data.map( d => d.color);
      setAvailableColors([...new Set(colors)]);      
      setAvailableProducts(data.map( d => d.sfmId));
    })
    .catch(e => {console.log("api error"); console.error(e)});    
  }, []
  );

  const handleClose = (e) => {setOpen(false)}

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);    
    let dataObject = {};    
    console.log(formData);
    formData.forEach((value, key) => dataObject[key] = value);
    console.log("sending data");
    const sfmId = dataObject['style'] + '-' + dataObject['size'] + '-' + dataObject['color']
    setSubmittedData(dataObject);
    if(!availableProducts.find(x => x==sfmId)){
      setOpen(true);
      return;
    }
    saveData(dataObject);    
  };

  const handleConfirm = (e) => {
    saveData(submittedData);
  }

  const saveData = (dataObject) => {
    console.log(dataObject);
    if(props.mode=='update')
      API.updatePurchase(token['mr-token'], props.id, dataObject)
      .then(resp => {
        if(resp.status==400) {console.log(resp); setSaved(false); badData=true; } 
        if(resp.status==200) { setSaved(true); }
        return resp.json()
      })
      .then(data => {if(badData) setErrormsg(data)})
      .catch(error => {console.log("api error"); console.error(error)});
    else
      API.addPurchase(token['mr-token'], dataObject)
      .then(resp => {
        console.log("saving",resp.status);
        if(resp.status==400) {console.log(resp); setSaved(false); badData=true; } 
        if(resp.status==201) { setSaved(true); }
        return resp.json()
      })
      .then(data => {if(badData) setErrormsg(data)})
      .catch(error => {console.log("api error"); console.error(error)});      
  }  

  const handleGoBack = (e) => {
    props.setMode('none');
  }
  
  if(saved)
    return(<div>Saved Succcesfully <Button onClick={handleGoBack}>Go back to Purchases</Button></div>);
  else
  return(
    <div>
      <div style={{display:'flex'}}>
        <Typography>{props.mode=='update' ? 'Update':'Add'}</Typography>
        <Button onClick={handleGoBack}>Go back</Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">"The Product does not Exist. New Product will be created. Continue?"</DialogTitle>
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>
      <form className={classes.form} onSubmit={handleSubmit} >
      { Object.keys(errormsg).length!=0 && <FormLabel error={true} >Invalid data</FormLabel>}
      
      <TextField
        variant="outlined"
        margin="normal"
        required
        select
        fullWidth
        id="status"
        label="Status"
        name="status"
        helperText = {errormsg['status'] ? errormsg['status'][0]:''}
        error = {errormsg['status'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['status']:''}
      >
        <MenuItem key={0} value={'In Transit'}>In Transit</MenuItem>
        <MenuItem key={1} value={'Received'}>Received</MenuItem>
      </TextField>
      <Autocomplete
      id="styleCombo"
      options={availableStyles}
      freeSolo
      getOptionLabel={(option) => option}
      fullWidth      
      renderInput={(params) => 
        <TextField {...params} 
        variant="outlined"
        margin="normal"
        required
        id="style"
        label="Style"
        name="style"
        disabled = {props.mode=='update' ? true:false}
        helperText = {errormsg['style'] ? errormsg['style'][0]:''}
        error = {errormsg['style'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['style']:''}
        />}
      />

      <Autocomplete
      id="sizeCombo"
      options={availableSizes}
      freeSolo
      getOptionLabel={(option) => option}
      renderInput={(params) => 
        <TextField {...params} 
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
        defaultValue = {props.mode=='update' ? props.data['size']:''}
        />}
      />
      <Autocomplete
      id="colorCombo"
      options={availableColors}
      freeSolo
      getOptionLabel={(option) => option}
      renderInput={(params) => 
        <TextField {...params} 
        variant="outlined"
        margin="normal"
        required
        id="color"
        label="Color"
        name="color"
        disabled = {props.mode=='update' ? true:false}
        helperText = {errormsg['color'] ? errormsg['color'][0]:''}
        error = {errormsg['color'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['color']:''}
        />}
      />
      
      <TextField
        variant="outlined"
        margin="normal"        
        fullWidth
        id="company"
        label="Company"
        name="company"
        helperText = {errormsg['company'] ? errormsg['company'][0]:''}
        error = {errormsg['company'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['company']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="warehouse"
        label="Warehouse"
        name="warehouse"
        helperText = {errormsg['warehouse'] ? errormsg['warehouse'][0]:''}
        error = {errormsg['warehouse'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['warehouse']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="ordered"
        label="Ordered"
        name="ordered"
        type="number"
        helperText = {errormsg['ordered'] ? errormsg['ordered'][0]:''}
        error = {errormsg['ordered'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['ordered']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="orderDate"
        label="order Date"
        name="orderDate"
        type="date"
        helperText = {errormsg['orderDate'] ? errormsg['orderDate'][0]:''}
        error = {errormsg['orderDate'] ? true: false}
        InputLabelProps={{
          shrink: true,
        }}
        defaultValue = {props.mode=='update' ? props.data['orderDate']:''}
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
    </div>); 
}