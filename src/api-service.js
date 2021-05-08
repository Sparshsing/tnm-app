export const APIROOT = 'https://sfm-dropshipping.herokuapp.com';
//export const APIROOT = 'http://127.0.0.1:8000';

export default class API{
  static getProducts(token){
    return fetch(APIROOT + '/api/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }).then(resp => resp.json())
  }

  static getStoreDetails(token){
    return fetch(APIROOT + '/api/stores/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }).then(resp => resp.json())
  }

  static getPurchasesList(token){
    return fetch(APIROOT + '/api/purchases/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
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