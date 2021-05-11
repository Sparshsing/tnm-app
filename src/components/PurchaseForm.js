import API from '../api-service'
import React, {useState} from 'react';
import {Button, TextField, FormLabel, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useCookies } from 'react-cookie'

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
  const [saved, setSaved, getSaved] = useState(false);
  let badData = false;
  console.log("opened form");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);    
    let dataObject = {};    
    formData.forEach((value, key) => dataObject[key] = value);
    console.log("sending data");
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
  };

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
    <form className={classes.form} onSubmit={handleSubmit} >
      { Object.keys(errormsg).length!=0 && <FormLabel error={true} >Invalid data</FormLabel>}
      
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="status"
        label="Status"
        name="status"
        helperText = {errormsg['status'] ? errormsg['status'][0]:''}
        error = {errormsg['status'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['status']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="style"
        label="Style"
        name="style"
        helperText = {errormsg['style'] ? errormsg['style'][0]:''}
        error = {errormsg['style'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['style']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="size"
        label="Size"
        name="size"
        helperText = {errormsg['size'] ? errormsg['size'][0]:''}
        error = {errormsg['size'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['size']:''}
      />
      <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="color"
      label="Color"
      name="color"
      helperText = {errormsg['color'] ? errormsg['color'][0]:''}
      error = {errormsg['color'] ? true: false}
      defaultValue = {props.mode=='update' ? props.data['color']:''}
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