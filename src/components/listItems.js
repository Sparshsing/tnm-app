import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Store, SettingsApplications, Receipt, ViewCarousel, HomeWork, ShoppingCart, PlaylistAddCheck, ImportantDevices} from '@material-ui/icons';
import {Link} from 'react-router-dom'
import {APIROOT} from '../api-service'

export const mainListItems = (
  <div>
    <ListItem button component={Link} to='/dashboard'>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button button component={Link} to='/orders'>
      <ListItemIcon>
        <PlaylistAddCheck />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
    <ListItem button button component={Link} to='/printing'>
      <ListItemIcon>
        <ImportantDevices />
      </ListItemIcon>
      <ListItemText primary="Printing" />
    </ListItem>
    <ListItem button component={Link} to='/stores'>
      <ListItemIcon>
        <Store />
      </ListItemIcon>
      <ListItemText primary="Stores" />
    </ListItem>
    <ListItem button component={Link} to='/inventory'>
      <ListItemIcon>
        <HomeWork />
      </ListItemIcon>
      <ListItemText primary="Inventory" />
    </ListItem>
    <ListItem button component={Link} to='/purchases'>
      <ListItemIcon>
        <ShoppingCart />
      </ListItemIcon>
      <ListItemText primary="Purchases" />
    </ListItem>
    <ListItem button component={Link} to='/products'>
      <ListItemIcon>
        <ViewCarousel />
      </ListItemIcon>
      <ListItemText primary="Products" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Receipt />
      </ListItemIcon>
      <ListItemText primary="Invoice" />
    </ListItem>
  </div>
);

export const staffListItems = (
  <div>
    <ListItem button button component={Link} to='/orders'>
      <ListItemIcon>
        <PlaylistAddCheck />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
    <ListItem button button component={Link} to='/printing'>
      <ListItemIcon>
        <ImportantDevices />
      </ListItemIcon>
      <ListItemText primary="Printing" />
    </ListItem>    
    <ListItem button component={Link} to='/inventory'>
      <ListItemIcon>
        <HomeWork />
      </ListItemIcon>
      <ListItemText primary="Inventory" />
    </ListItem>
    <ListItem button component={Link} to='/purchases'>
      <ListItemIcon>
        <ShoppingCart />
      </ListItemIcon>
      <ListItemText primary="Purchases" />
    </ListItem>
    <ListItem button component={Link} to='/products'>
      <ListItemIcon>
        <ViewCarousel />
      </ListItemIcon>
      <ListItemText primary="Products" />
    </ListItem>    
  </div>
);

export const clientListItems = (
  <div>
    <ListItem button component={Link} to='/dashboard'>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button button component={Link} to='/orders'>
      <ListItemIcon>
        <PlaylistAddCheck />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>    
    <ListItem button component={Link} to='/stores'>
      <ListItemIcon>
        <Store />
      </ListItemIcon>
      <ListItemText primary="Stores" />
    </ListItem>    
    <ListItem button component={Link} to='/products'>
      <ListItemIcon>
        <ViewCarousel />
      </ListItemIcon>
      <ListItemText primary="Products" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <Receipt />
      </ListItemIcon>
      <ListItemText primary="Invoice" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Advanced</ListSubheader>
    <ListItem button component="a" href={APIROOT+"/admin"}>
      <ListItemIcon>
        <SettingsApplications />
      </ListItemIcon>
      <ListItemText primary="Django Admin" />
    </ListItem>
  </div>
);