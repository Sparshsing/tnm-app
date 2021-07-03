import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { mainListItems, staffListItems, clientListItems , secondaryListItems } from './listItems';
import companylogo from './logo.png';
// import Chart from './Chart';
// import Deposits from './Deposits';

import {Route, BrowserRouter, Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import TheContent from './TheContent';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    backgroundColor: "rgb(47,83,149)",
    paddingRight: 24, // keep right padding when drawer closed
    paddingBottom: "5px",
    paddingTop: "10px",
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    padding: '5px',
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    paddingLeft: '0px',
    paddingRight: '0px',
    },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function TheLayout() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [title, setTitle] = React.useState('Home');
  const [token, setToken, removeToken] = useCookies(['mr-token']);
  const [userInfo, setUserInfo, removeUserInfo] = useCookies(['mr-user']);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSignOut = (e) => {
    console.log('signing out');
    removeToken('mr-token');
    removeUserInfo('mr-user');
  }

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);

  let usertype=0;
  if(userInfo['mr-user'])
    usertype = parseInt(userInfo['mr-user'].split('-')[1]);
  

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
          <img src={companylogo} alt='SFM logo' style={{width:"120px"}}></img>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {usertype==0 && <List>{clientListItems}</List>}
        {usertype==1 && <List>{mainListItems}</List>}
        {usertype==2 && <List>{staffListItems}</List>}
        <Divider />
        <ListItem button component={Link} to='/accountDetails'>
          <ListItemIcon>
            <AccountCircleRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="My Account" />
        </ListItem>
        <ListItem button onClick={handleSignOut}>
          <ListItemIcon>
            <ExitToAppIcon color="secondary"/>
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItem>
        <Divider />
        {usertype==1 && <List>{secondaryListItems}</List> }
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth={false} className={classes.container}>
          <TheContent setTitle={setTitle}/>
        </Container>
      </main>
    </div>
  );
}