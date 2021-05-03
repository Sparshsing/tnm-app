import './App.css';
import ProductDetails from './components/productDetails';
import TheLayout from './components/TheLayout';
import {BrowserRouter} from 'react-router-dom';


function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        TNM Clothing
  </header> */}
      <TheLayout />
    </div>
  );
}

export default App;
