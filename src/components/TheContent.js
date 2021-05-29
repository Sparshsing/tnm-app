import {Switch, Route} from 'react-router-dom'
import React from 'react'
import ProductDetails from './productDetails';
import StoreDetails from './StoreDetails';
import PurchaseList from './PurchaseList';
import InventoryList from './InventoryList';
import OrderList from './OrderList';
import Printing from './Printing';
import Dashboard from './Dashboard';
import AccountDetails from './AccountDetails';

function TheContent(props){
  const setTitle = props.setTitle;
  return (    
        <Switch>
        <Route exact path='/' render={ props => <div {...props}>Welcome To SFM Dropshipping</div>} />
        <Route exact path='/dashboard' render={(props) => (<Dashboard {...props} setTitle={setTitle} />)} />
        <Route exact path='/products' render={(props) => (<ProductDetails {...props} setTitle={setTitle} />)} />
        <Route exact path='/stores' render={(props) => (<StoreDetails {...props} setTitle={setTitle} />)} />
        <Route exact path='/purchases' render={(props) => (<PurchaseList {...props} setTitle={setTitle} />)} />
        <Route exact path='/inventory' render={(props) => (<InventoryList {...props} setTitle={setTitle} />)} />
        <Route exact path='/orders' render={(props) => (<OrderList {...props} setTitle={setTitle} />)} />
        <Route exact path='/printing' render={(props) => (<Printing {...props} setTitle={setTitle} />)} />
        <Route exact path='/accountdetails' render={(props) => (<AccountDetails {...props} setTitle={setTitle} />)} />
          {/* <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
          <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
          <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
  <Route path="/" name="Home" render={props => <TheLayout {...props}/>} /> */}
        </Switch>
  );
}

export default TheContent;