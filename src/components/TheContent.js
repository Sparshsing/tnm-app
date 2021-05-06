import {Switch, Route} from 'react-router-dom'
import React from 'react'
import ProductDetails from './productDetails';
import Dashboard from './Dashboard'

function TheContent(){

  return (    
        <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/Products' component={ProductDetails} />
          
          {/* <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
          <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
          <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
  <Route path="/" name="Home" render={props => <TheLayout {...props}/>} /> */}
        </Switch>
  );
}

export default TheContent;