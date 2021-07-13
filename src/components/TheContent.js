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
import Invoices from './Invoices';
import HomePage from './Homepage';

function TheContent(props){
  const setTitle = props.setTitle;
  const usertype = props.usertype;

  return (    
        <Switch>
        <Route exact path='/' render={ props => (<HomePage setTitle={setTitle} />)} />
        {usertype!=2 && <Route exact path='/dashboard' render={(props) => (<Dashboard  setTitle={setTitle} usertype={usertype}/>)} />}
        <Route exact path='/products' render={(props) => (<ProductDetails  setTitle={setTitle} usertype={usertype}/>)} />
        {usertype!=2 && <Route exact path='/stores' render={(props) => (<StoreDetails setTitle={setTitle} usertype={usertype}/>)} />}
        {usertype!=0 && <Route exact path='/purchases' render={(props) => (<PurchaseList  setTitle={setTitle}/>)} />}
        {usertype!=0 && <Route exact path='/inventory' render={(props) => (<InventoryList setTitle={setTitle}/>)} />}
        <Route exact path='/orders' render={(props) => (<OrderList setTitle={setTitle} usertype={usertype}/>)} />
        {usertype!=0 && <Route exact path='/printing' render={(props) => (<Printing setTitle={setTitle} usertype={usertype}/>)} />}
        <Route exact path='/accountdetails' render={(props) => (<AccountDetails setTitle={setTitle} usertype={usertype}/>)} />
        {usertype!=2 &&<Route exact path='/invoices' render={(props) => (<Invoices setTitle={setTitle} usertype={usertype}/>)} />}
          {/* <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
          <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
          <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
          <Route path="/" name="Home" render={props => <TheLayout {...props}/>} /> */}
        </Switch>
  );
}

export default TheContent;