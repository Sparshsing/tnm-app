import {Switch, Route} from 'react-router-dom'
import React from 'react'
import ProductDetails from './productDetails';
import StoreDetails from './StoreDetails';
import PurchaseList from './PurchaseList';
import InventoryList from './InventoryList';
import OrderList from './OrderList';
import Dashboard from './Dashboard'

function TheContent(){

  return (    
        <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/products' component={ProductDetails} />
        <Route exact path='/stores' component={StoreDetails} />
        <Route exact path='/purchases' component={PurchaseList} />
        <Route exact path='/inventory' component={InventoryList} />
        <Route exact path='/orders' component={OrderList} />
          {/* <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
          <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
          <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
  <Route path="/" name="Home" render={props => <TheLayout {...props}/>} /> */}
        </Switch>
  );
}

export default TheContent;