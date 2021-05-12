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

export default function ProductForm(props){

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
      API.updateProduct(token['mr-token'], props.id, dataObject)
      .then(resp => {
        if(resp.status==400) {console.log(resp); setSaved(false); badData=true; } 
        if(resp.status==200) { setSaved(true); }
        return resp.json()
      })
      .then(data => {if(badData) setErrormsg(data)})
      .catch(error => {console.log("api error"); console.error(error)});
    else
      API.addProduct(token['mr-token'], dataObject)
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
    return(<div>Saved Succcesfully <Button onClick={handleGoBack}>Go back to Products</Button></div>);
  else
  return(
    <div>
      <div style={{display:'flex'}}>
        <Typography>{props.mode=='update' ? 'Update':'Add'}</Typography>
        <Button onClick={handleGoBack}>Go back</Button>
      </div>
    <form className={classes.form} onSubmit={handleSubmit} >
      { Object.keys(errormsg).length!=0 && <FormLabel error={true} >Invalid data {errormsg['form']}</FormLabel>}      
      
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
        disabled = {props.mode=='update' ? true:false}
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
      disabled = {props.mode=='update' ? true:false}
      helperText = {errormsg['color'] ? errormsg['color'][0]:''}
      error = {errormsg['color'] ? true: false}
      defaultValue = {props.mode=='update' ? props.data['color']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"        
        fullWidth
        id="sku"
        label="SKU"
        name="sku"
        disabled = {props.mode=='update' ? true:false}
        helperText = {errormsg['sku'] ? errormsg['sku'][0]:''}
        error = {errormsg['sku'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['sku']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="cost"
        label="Cost"
        name="cost"
        type="number"
        inputProps={{step:0.01}}
        helperText = {errormsg['cost'] ? errormsg['cost'][0]:''}
        error = {errormsg['cost'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['cost']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="price"
        label="Price"
        name="price"
        type="number"
        inputProps={{step:0.01}}
        helperText = {errormsg['price'] ? errormsg['price'][0]:''}
        error = {errormsg['price'] ? true: false}
        defaultValue = {props.mode=='update' ? props.data['price']:''}
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