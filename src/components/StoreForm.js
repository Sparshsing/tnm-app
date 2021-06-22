import API from '../api-service'
import React, {useState, useEffect} from 'react';
import {Button, TextField, FormLabel, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom'
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

export default function StoreForm(props){

  const classes = useStyles();
  const [token] = useCookies(['mr-token']);

  const [errormsg, setErrormsg] = useState({});
  const [data, setData] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if(props.mode!='update')
      return;

    const getStore = async () => {      
      try{
        const resp = await API.getStore(token['mr-token'], props.id)
        if(resp.status==200){
          const store = await resp.json();
          console.log("retreiving data");
          setData(store);
        }
        else throw 'Could not get the store details';        
      }
      catch(e){
        console.log("api error");
        console.error(e);
        setErrormsg({'form': String(e)});
      }
    }
    getStore();

  }, []);

  const updateStore = async (id, dataObject) => {
    try{
      const resp = await API.updateStore(token['mr-token'], id, dataObject);
      console.log("response status ", resp.status);
      if(resp.status==200){
        setSaved(true);
        alert("Saved Succesfully");
        props.setMode('none');
      }
        
      else if(resp.status==400){
        console.log(resp);
        const errors = await resp.json();
        setErrormsg(errors);
      }
      else throw 'Failed due to unknown reasons';
    }
    catch(error){
      console.log("api error");
      console.error(error);
      setErrormsg({'form': String(error)});
    }
  }

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);    
    let dataObject = {};    
    formData.forEach((value, key) => dataObject[key] = value);
    console.log("sending data");
    dataObject = {...data, ...dataObject};
    console.log(dataObject);
    if(props.mode=='update')
      updateStore(props.id, dataObject);
    else
      console.error("only update available");
  };

  const handleGoBack = (e) => {
    props.setMode('none');
  }
  
  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(saved)
    return (<Redirect to='/stores'></Redirect>);
  if(props.mode=='update' && Object.keys(data).length === 0)
    return (<div>Loading...</div>);
  return(
    <div>
      <div style={{display:'flex', justifyContent: "space-between"}}>
        <Typography variant="h4">{props.mode=='update' ? 'Update':'Add'}</Typography>
        <Button variant="contained" color="primary" onClick={handleGoBack}>Go back</Button>
      </div>
    <form className={classes.form} onSubmit={handleSubmit} >
      { Object.keys(errormsg).length!=0 && <FormLabel error={true} >Invalid data {errormsg['form']}</FormLabel>}
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="storeName"
        label="Store Name"
        name="storeName"
        disabled = {props.mode=='update' ? true:false}
        helperText = {errormsg['storeName'] ? errormsg['storeName'][0]:''}
        error = {errormsg['storeName'] ? true: false}
        defaultValue = {props.mode=='update' ? data['storeName']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        type="email"
        id="emailAddress"
        label="Email Address"
        name="emailAddress"
        helperText = {errormsg['emailAddress'] ? errormsg['emailAddress'][0]:''}
        error = {errormsg['emailAddress'] ? true: false}
        defaultValue = {props.mode=='update' ? data['emailAddress']:''}
      />
      <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="addressLine1"
      label="Address Line 1"
      name="addressLine1"
      inputProps={{maxLength:50}}
      helperText = {errormsg['addressLine1'] ? errormsg['addressLine1'][0]:''}
      error = {errormsg['addressLine1'] ? true: false}
      defaultValue = {props.mode=='update' ? data['addressLine1']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"        
        fullWidth
        id="addressLine2"
        label="addressLine2"
        name="addressLine2"
        helperText = {errormsg['addressLine2'] ? errormsg['addressLine2'][0]:''}
        error = {errormsg['addressLine2'] ? true: false}
        defaultValue = {props.mode=='update' ? data['addressLine2']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="city"
        label="City"
        name="city"
        helperText = {errormsg['city'] ? errormsg['city'][0]:''}
        error = {errormsg['city'] ? true: false}
        defaultValue = {props.mode=='update' ? data['city']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="state"
        label="State"
        name="state"
        inputProps={{maxLength:2}}
        helperText = {errormsg['state'] ? errormsg['state'][0]:''}
        error = {errormsg['state'] ? true: false}
        defaultValue = {props.mode=='update' ? data['state']:''}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="zipCode"
        label="Zip Code"
        name="zipCode"
        type="number"
        inputProps={{step:1, max:99999}}
        helperText = {errormsg['zipCode'] ? errormsg['zipCode'][0]:''}
        error = {errormsg['zipCode'] ? true: false}
        defaultValue = {props.mode=='update' ? data['zipCode']:''}
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