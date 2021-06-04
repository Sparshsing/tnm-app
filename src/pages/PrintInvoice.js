import API from '../api-service';
import React, {useState, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';
import companylogo from '../components/logo.png';

export default function Invoices(props){

  const [token] = useCookies(['mr-token']);
  const [invoiceDetails, setInvoiceDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US');
  
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
      <table style={{ width: "800px"}}>
        <tr>
          <td><h1 style={{ color: "rgb(47,83,149)"}}>Invoice</h1></td>
          <td></td>
          <td><img src={companylogo} alt='SFM' style={{width:"120px"}}></img></td>
        </tr>
        <tr>
          <td style={{ verticalAlign: "top"}}>
            <div>
              <h4 style={{ color: "rgb(47,83,149)"}}>Invoice Number</h4><div>{invoiceDetails.invoiceNo}</div>
              <h4 style={{ color: "rgb(47,83,149)"}}>Date Of Issue</h4><p>{currentDate}</p>
            </div>
          </td>
          <td style={{ verticalAlign: "top"}}>
            <div>
              <h4 style={{ color: "rgb(47,83,149)"}}>SFM Dropshipping</h4>
              <p>My company address line 1</p>
              <p>My company address line 2</p>
              <p>My company address line 3</p>
              <p>sfmdropshipping@gmail.com</p>
              <p>9988776655</p>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td style={{ verticalAlign: "top"}}>
            <div>
              <h4 style={{ color: "rgb(47,83,149)"}}>Billed To</h4>
              <table>
                {invoiceDetails.store && <tr><td>{invoiceDetails.store.userFullName}</td></tr>}
                <tr><td>{invoiceDetails.storeName}</td></tr>
                {invoiceDetails.store && <tr><td>{invoiceDetails.store.addressLine1}</td></tr>}
                {invoiceDetails.store && <tr><td>{invoiceDetails.store.addressLine2}</td></tr>}
                {invoiceDetails.store && <tr><td>{invoiceDetails.store.city}, {invoiceDetails.store.state}</td></tr>}
                {invoiceDetails.store && <tr><td>{invoiceDetails.store.zipCode}</td></tr>}
                {invoiceDetails.store && <tr><td>{invoiceDetails.store.emailAddress}</td></tr>}
              </table>
            </div>
          </td>
          <td style={{ verticalAlign: "top"}}>
            <div>
              <h4 style={{ color: "rgb(47,83,149)"}}>Overview</h4>
              <table>
              <tr>
                <td>Start Date</td>
                <td>{invoiceDetails.startDate}</td>
              </tr>
              <tr>
                <td>End Date</td>
                <td>{invoiceDetails.endDate}</td>
              </tr>
              <tr>
                <td>Order Count</td>
                <td>{invoiceDetails.items.map(it => it.orderNo).filter((val, i, arr) => arr.indexOf(val) === i).length}</td>
              </tr>
              <tr>
                <td>Item Count</td>
                <td>{invoiceDetails.items.length}</td>
              </tr>
              <tr>
                <td>Invoice Total</td>
                <td>$ {invoiceDetails.total}</td>
              </tr>
              </table>
            </div>
          </td>
          <td></td>
        </tr>
      </table>
      <table style={{ width: '800px', border: '2px solid rgb(47,83,149)', borderCollapse: "collapse", textAlign: "left", marginTop: "10px", marginBottom: "20px"}}>
        <tr style={{ border: '2px solid rgb(47,83,148)'}}>
          <th>Ship Date</th>
          <th>Order Date</th>
          <th>Order Number</th>
          <th>Customer</th>
          <th>Description</th>
          <th style={{textAlign: "right"}}>Amount</th>
        </tr>
        {invoiceDetails.items.map(i => (
          <tr key={i.id}>
            <td>{i.shipDate}</td>
            <td>{i.orderDate}</td>
            <td>{i.orderNo}</td>
            <td>{i.customer}</td>
            <td>{i.description}</td>
            <td style={{textAlign: "right"}}>$ {i.amount}</td>
          </tr>
        ))}
        <tr style={{ fontWeight: "bold", borderTop: "2px solid rgb(47,83,149)"}}>
          <td></td><td></td><td></td><td></td>
          <td style={{ textAlign: "right"}}>Subtotal</td>
          <td style={{ textAlign: "right"}}>$ {invoiceDetails.subTotal}</td>
        </tr>
        <tr style={{ fontWeight: "bold"}}>
          <td></td><td></td><td></td><td></td>
          <td style={{ textAlign: "right"}}>Discount</td>
          <td style={{ textAlign: "right"}}>$ {invoiceDetails.discount}</td>
        </tr>
        <tr style={{ fontWeight: "bold"}}>
          <td></td><td></td><td></td><td></td>
          <td style={{ textAlign: "right"}}>Tax Rate</td>
          <td style={{ textAlign: "right"}}>{invoiceDetails.taxrate}</td>
        </tr>
        <tr style={{ fontWeight: "bold"}}>
          <td></td><td></td><td></td><td></td>
          <td style={{ textAlign: "right"}}>Tax</td>
          <td style={{ textAlign: "right"}}>$ {(invoiceDetails.subTotal - invoiceDetails.discount)*invoiceDetails.taxrate*0.01}</td>
        </tr>
        <tr style={{ fontWeight: "bold"}}>
          <td></td><td></td><td></td><td></td>
          <td style={{ textAlign: "right"}}>Total</td>
          <td style={{ textAlign: "right"}}>$ {invoiceDetails.total}</td>
        </tr>
      </table>
    </div>
  );
}