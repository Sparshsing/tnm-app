
const TOKEN = "cdc0fc87b5854f55c0d90663036ef7574efe9b53";
//const apiRoot = 'https://sfm-dropshipping.herokuapp.com'
export const APIROOT = 'http://127.0.0.1:8000';

export default class API{
  static getProducts(){
    return fetch(APIROOT + '/api/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${TOKEN}`
      }
    }).then(resp => resp.json())
  }

  static signinUser(credentials){
    return fetch(APIROOT + '/auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    }).then(resp => resp.json())
  }
}