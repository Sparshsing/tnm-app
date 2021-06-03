import API from '../api-service';
import React, {useState, useEffect} from 'react';
import { DataGrid, GridToolbar, setGridPageStateUpdate} from '@material-ui/data-grid';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import companylogo from '../components/logo.png';
import StoreDetails from '../components/StoreDetails';

export default function Invoices(props){

  const [token] = useCookies(['mr-token']);
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    (async () => {
      if(!props.location.state){
        console.log('did not recieve invoice id');
        setError(true);
        return;
      }
      try{
        const id = props.location.state.invoiceid;
        console.log('invoice id ',id);
        const resp = await API.getInvoice(token['mr-token'], id);
        if(resp.status!=200)
          throw `invalid status ${resp.status} ${resp.statusText}`;
        
        const invoice = await resp.json();
        console.log(invoice);
        setInvoiceDetails(invoice);
        setLoading(false);
      }
      catch(e){
        console.log("api error");
        console.error(e);
        setError(true);
      }
    })();
  }, []);

  if(!token['mr-token'])
    return (<Redirect to='/signin'></Redirect>);
  if(error)
    return (<h2>Something Went Wrong</h2>);
  if(loading){
    return (<div>Loading. Please wait.</div>);
  }
  return(
    <div>
      <h2>Invoice</h2>
      <img src={companylogo} alt='SFM' style={{width:"120px"}}></img>
      <h4>InvoiceNumber</h4><div>{invoiceDetails.invoiceNo}</div>
      <div>
        <h4>SFM Dropshipping</h4>
        <p>My company address line 1</p>
        <p>My company address line 2</p>
        <p>My company address line 3</p>
        <p>sfmdropshipping@gmail.com</p>
        <p>9988776655</p>
      </div>

      <div>
        <h4>Billed To</h4>        
        {invoiceDetails.store && <p>{invoiceDetails.store.userFullName}</p>}
        <p>{invoiceDetails.storeName}</p>
        {invoiceDetails.store && <p>{invoiceDetails.store.addressLine1}</p>}
        {invoiceDetails.store && <p>{invoiceDetails.store.addressLine2}</p>}
        {invoiceDetails.store && <p>{invoiceDetails.store.city}, {invoiceDetails.store.state}</p>}
        {invoiceDetails.store && <p>{invoiceDetails.store.zipCode}</p>}
      </div>

      <table style={{ width: '90%', border: '1px solid black'}}>
        <tr>
          <th>Ship Date</th>
          <th>Order Date</th>
          <th>Order Number</th>
          <th>Customer</th>
          <th>Description</th>
          <th>Amount</th>
        </tr>
        {invoiceDetails.items.map(i => (
          <tr key={i.id}>
            <td>{i.shipDate}</td>
            <td>{i.orderDate}</td>
            <td>{i.orderNo}</td>
            <td>{i.customer}</td>
            <td>{i.description}</td>
            <td>{i.amount}</td>
          </tr>
        ))}
        <tr>
          <td></td><td></td><td></td><td></td>
          <td>Subtotal</td>
          <td>{invoiceDetails.subTotal}</td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td>
          <td>Discount</td>
          <td>{invoiceDetails.discount}</td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td>
          <td>Tax Rate</td>
          <td>{invoiceDetails.taxrate}</td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td>
          <td>Tax</td>
          <td>{(invoiceDetails.subTotal - invoiceDetails.discount)*invoiceDetails.taxrate*0.01}</td>
        </tr>
        <tr>
          <td></td><td></td><td></td><td></td>
          <td>Total</td>
          <td>$ {invoiceDetails.total}</td>
        </tr>
      </table>
      

    </div>
  );
}