import './App.css';
import ProductDetails from './components/productDetails';
import Dashboard from './components/Dashboard';
import {BrowserRouter} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        TNM Clothing
  </header> */}
      <Dashboard />
    </div>
  );
}

export default App;
