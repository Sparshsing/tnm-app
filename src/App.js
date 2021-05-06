import './App.css';
import React from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie'

const loading = (
  <div className="loading-symbol">
    Loading Please wait
  </div>
)

// Pages
const Signin = React.lazy(() => import('./pages/Signin'));
const TheLayout = React.lazy(() => import('./components/TheLayout'));

function App() {

  return (
    <CookiesProvider>
      <HashRouter>
            <React.Suspense fallback={loading}>
              <Switch>
                <Route exact path="/signin" name="Login Page" render={props => <Signin {...props}/>} />              
                <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />
              </Switch>
            </React.Suspense>
      </HashRouter>
    </CookiesProvider>
  );
}

export default App;
