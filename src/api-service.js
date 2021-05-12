export const APIROOT = 'https://sfm-dropshipping.herokuapp.com';
//export const APIROOT = 'http://127.0.0.1:8000';

export default class API{
  static getProductList(token){
    return fetch(APIROOT + '/api/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }).then(resp => resp.json())
  }

  static getProduct(token, id){
    return fetch(APIROOT + '/api/products/' + id + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
  }

  static addProduct(token, data){
    return fetch(APIROOT + '/api/products/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static updateProduct(token, id, data){
    return fetch(APIROOT + '/api/products/' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static getStoreList(token){
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

  static getPurchase(token, id){
    return fetch(APIROOT + '/api/purchases/' + id + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
  }

  static addPurchase(token, data){
    return fetch(APIROOT + '/api/purchases/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static updatePurchase(token, id, data){
    return fetch(APIROOT + '/api/purchases/' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static getInventoryList(token){
    return fetch(APIROOT + '/api/inventory/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }).then(resp => resp.json())
  }

  static getOrderList(token){
    return fetch(APIROOT + '/api/orders/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    }).then(resp => resp.json())
  }

  static getOrder(token, id){
    return fetch(APIROOT + '/api/orders/' + id + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
  }

  static addOrder(token, data){
    return fetch(APIROOT + '/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static updateOrder(token, id, data){
    return fetch(APIROOT + '/api/orders/' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
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