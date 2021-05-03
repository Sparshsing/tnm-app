import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/* import ReactDOM from 'react-dom';
import { Route, Switch, Redirect, Link, BrowserRouter} from 'react-router-dom';
// Set up pages using the React Router Link element for navigation - instead of <a></a>
const App = () => (
  <div>
    <h1>React Router Example</h1>
    <ul role="nav">
      <li><Link to="/client">Client Side</Link></li>
      <li><Link to="/server">Server Side</Link></li>
    </ul>
     
    <div>
      <Route path='/client' component={Client} />
      <Route path='/server' component={Server} />
    </div>
  </div>
)

// Populate sample pages. 
const Client= () => <h3>What is client side?<body><li>Browser</li><li>Runs on local machine</li><li>React renders user interface</li><li>React Router adds clickable links</li></body></h3>

const Server= () => <h3>What is server side?<li>node.js - JavaScript everywhere!</li></h3>

//Render app into the root HTML DOM node
ReactDOM.render((
  <BrowserRouter>
    <App/>
  </BrowserRouter>
), document.getElementById('root')); */
