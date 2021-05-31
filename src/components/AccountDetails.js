import API from '../api-service';
import React, {useState, useEffect} from 'react';
import {Button, TextField} from '@material-ui/core';
import { useCookies } from 'react-cookie';
import {Redirect} from 'react-router-dom';

export default function AccountDetails(props){

  const [token] = useCookies(['mr-token']);
  const [userInfo, setUserInfo] = useCookies(['mr-user']);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [old_password, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [changePassword, setChangePassword] = useState(false);
  const [message, setMessage] = useState('');
  const [errormsg, setErrormsg] = useState({});

  const userId = parseInt(userInfo['mr-user'].split('-')[0])
  useEffect(() => {
    (async () => {
      props.setTitle('My Account');
      try{
        const resp = await API.getAccountDetails(token['mr-token'], userId)
        const data = await resp.json();
        setUsername(data['username']);
        setEmail(data['email']);
        setLastName(data['last_name']);
        setFirstName(data['first_name']);
      }
      catch(e){
        console.log("api error");
        console.error(e);
      }
    })();
  }, [])

  const handleSave = async (e) => {
    try{
      const resp = await API.updateProfile(token['mr-token'], userId, {email, first_name, last_name})
      if(resp.status==200){
        setErrormsg('');
        setMessage('Updated Successfully');
      }
        
      if(resp.status==400){
        console.log('dddd');
        setMessage('Invalid Data');
        setErrormsg(await resp.json());
      }      
    }
    catch(e){
      setMessage('Something went wrong');
      console.log("api error");
      console.error(e);
    }
  }

  const handleChangePassword = async (e) => {
    try{
      const resp = await API.changePassword(token['mr-token'], userId, {password, password2, old_password})
      if(resp.status==200){
        setErrormsg('');
        setMessage('Password Changed Successfully');
      }
        
      if(resp.status==400){
        setMessage('Invalid Data');
        setErrormsg(resp.json());
      }      
    }
    catch(e){
      setMessage('Something went wrong');
      console.log("api error");
      console.error(e);
    }
  }
  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  return(
    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
      <div>
        {changePassword===false ? <Button
          variant="contained"
          color="secondary"
          onClick={(e) => setChangePassword(true)}
        >
        Change Password
        </Button>
        :
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => setChangePassword(false)}
        >
        Back
        </Button>
      }
      </div>
      {message && <h3 style={{color:"red"}}>{message}</h3>}
      {changePassword==false ?
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
        <TextField
          variant="outlined"
          margin="normal"
          disabled
          id="username"
          label="Username"
          name="username"
          value={username}
          inputProps={{maxLength:20}}
          helperText = {errormsg['username'] ? errormsg['orderNo'][0]:''}
          error = {errormsg['username'] ? true: false}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          id="email"
          label="Email"
          name="email"
          value={email}
          onChange={ (e) => setEmail(e.target.value) }
          inputProps={{maxLength:50}}
          helperText = {errormsg['email'] ? errormsg['email'][0]:''}
          error = {errormsg['email'] ? true: false}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          id="first_name"
          label="First Name"
          name="first_name"
          value={first_name}
          onChange={ (e) => setFirstName(e.target.value) }
          inputProps={{maxLength:20}}
          helperText = {errormsg['first_name'] ? errormsg['first_name'][0]:''}
          error = {errormsg['first_name'] ? true: false}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          id="last_name"
          label="Last Name"
          name="last_name"
          value={last_name}
          onChange={ (e) => setLastName(e.target.value) }
          inputProps={{maxLength:20}}
          helperText = {errormsg['last_name'] ? errormsg['last_name'][0]:''}
          error = {errormsg['last_name'] ? true: false}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
        Save Changes
        </Button>
        </div>
        :
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column'}}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="old_password"
            label="old_password"
            name="old_password"
            type="password"
            value={old_password}
            onChange={ (e) => setOldPassword(e.target.value) }
            inputProps={{maxLength:20}}
            helperText = {errormsg['old_password'] ? errormsg['old_password'][0]:''}
            error = {errormsg['old_password'] ? true: false}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="password"
            label="password"
            name="password"
            type="password"
            value={password}
            onChange={ (e) => setPassword(e.target.value) }
            inputProps={{maxLength:20}}
            helperText = {errormsg['password'] ? errormsg['password'][0]:''}
            error = {errormsg['password'] ? true: false}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            id="password2"
            label="password2"
            name="password2"
            type="password"
            value={password2}
            onChange={ (e) => setPassword2(e.target.value) }
            inputProps={{maxLength:20}}
            helperText = {errormsg['password2'] ? errormsg['password2'][0]:''}
            error = {errormsg['password2'] ? true: false}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleChangePassword}
          >
          Confirm
          </Button>
        </div>
      }
    </div>
    
  );
}