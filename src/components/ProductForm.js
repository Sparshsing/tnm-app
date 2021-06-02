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

export default function ProductForm(props){

  const classes = useStyles();
  const [token] = useCookies(['mr-token']);
  const [userInfo] = useCookies(['mr-userInfo']);

  const [errormsg, setErrormsg] = useState({});
  const [data, setData] = useState({});
  const [saved, setSaved, getSaved] = useState(false);
  let badData = false;
  console.log("opened form");

  useEffect(() => {
    if(props.mode!='update')
      return;

    const getproduct = async () => {      
      try{
        const resp = await API.getProduct(token['mr-token'], props.id)
        if(resp.status==200){
          const product = await resp.json();
          console.log("retreiving data");
          setData(product);
        }
        else throw 'Could not get the product details';        
      }
      catch(e){
        console.log("api error");
        console.error(e);
        setErrormsg({'form': String(e)});
      }
    }
    getproduct();

  }, []);

  const updateProduct = async (id, dataObject) => {
    try{
      const resp = await API.updateProduct(token['mr-token'], id, dataObject);
      console.log("response status ", resp.status);
      if(resp.status==200)
        setSaved(true);
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

  const addProduct = async (dataObject) => {    
    try{
      const resp = await API.addProduct(token['mr-token'], dataObject);
      console.log("response status ", resp.status);
      if(resp.status==201)
        setSaved(true);
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
      updateProduct(props.id, dataObject);
    else
      addProduct(dataObject);
  };

  const handleGoBack = (e) => {
    props.setMode('none');
  }
  
  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(parseInt(userInfo['mr-user'].split('-')[1])!=1)
    return (<Redirect to='/'></Redirect>);
  if(saved)
    return (<Typography variant="h6">Saved Succcesfully <Button variant="contained" color="primary" onClick={handleGoBack}>Go back</Button></Typography>);
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
        id="style"
        label="Style"
        name="style"
        disabled = {props.mode=='update' ? true:false}
        helperText = {errormsg['style'] ? errormsg['style'][0]:''}
        error = {errormsg['style'] ? true: false}
        defaultValue = {props.mode=='update' ? data['style']:''}
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
        defaultValue = {props.mode=='update' ? data['size']:''}
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
      defaultValue = {props.mode=='update' ? data['color']:''}
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
        defaultValue = {props.mode=='update' ? data['sku']:''}
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
        defaultValue = {props.mode=='update' ? data['cost']:''}
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
        defaultValue = {props.mode=='update' ? data['price']:''}
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