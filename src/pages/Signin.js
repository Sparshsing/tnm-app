import React, {useState, useContext, useEffect, useRef} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import API from '../api-service'
import { FormLabel } from '@material-ui/core';
import { useCookies} from 'react-cookie';
import { Redirect } from "react-router-dom";
import { FirstPage } from '@material-ui/icons';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        SFM Dropshipping
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errormsg, setErrormsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useCookies(['mr-token']);
  const [userInfo, setUserInfo] = useCookies(['mr-user']);
  useEffect( () => {    
    
  }, [token, userInfo]);

  const signinClicked = (e) => {
    e.preventDefault();
    setLoading(true);
    API.signinUser({username, password})
    .then(resp =>{
      if(resp.status==200)
        return resp.json();
      if(resp.status==400)
        throw 'Invalid username or passord';
      else
        throw 'Something went wrong';
    } )
    .then(data => {
      setLoading(false);
      let utype = 0;
      if(data.is_superuser)
        utype = 1;
      else if(data.is_staff)
        utype = 2;

      // userinfo needs to be set FirstPage, because async functions no batching, and we need userinfo
      // if token loads late, it will redirect for 1-2 times but it will work, but not with userinfo
      setUserInfo('mr-user',`${data.user_id}-${utype}`);
      setToken('mr-token', data.token);      
      
    })
    .catch(error => {
      console.error(error);
      setErrormsg(String(error));
      setLoading(false);
    });
  }

  if(token['mr-token'])
    return (<Redirect to='/'></Redirect>);
  if(loading)
    return (<p>Loading... Please wait.</p>)
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={signinClicked}>
          {errormsg && <FormLabel error={true} >{errormsg}</FormLabel>}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            autoComplete="email"
            onChange={ (e) => setUsername(e.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={ (e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}            
          >
            Sign In
          </Button>
          {/*<Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>*/}
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}