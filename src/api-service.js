export const APIROOT = 'https://sfm-dropshipping.herokuapp.com';
//export const APIROOT = 'http://127.0.0.1:8000';
//export const APIROOT = 'https://api.sfmdropship.com';

export default class API{
  static getProductList(token){
    return fetch(APIROOT + '/api/products/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
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

  static deleteProduct(token, id){
    return fetch(APIROOT + '/api/products/' + id + '/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
    })
  }

  static getStoreList(token){
    return fetch(APIROOT + '/api/stores/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
  }

  static getStore(token, id){
    return fetch(APIROOT + '/api/stores/' + id + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
  }

  static updateStore(token, id, data){
    return fetch(APIROOT + '/api/stores/' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static getPurchasesList(token, urlparams){
    return fetch(APIROOT + '/api/purchases/?' + urlparams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
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

  static deletePurchase(token, id){
    return fetch(APIROOT + '/api/purchases/' + id + '/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
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

  static getPrintingList(token){
    return fetch(APIROOT + '/api/printing/', {
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

  static deleteOrder(token, id){
    return fetch(APIROOT + '/api/orders/' + id + '/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
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

  static getInvoiceList(token){
    return fetch(APIROOT + '/api/invoices/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
  }

  static getInvoice(token, id){
    return fetch(APIROOT + '/api/invoices/' + id + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
  }

  static updateInvoice(token, id, data){
    return fetch(APIROOT + '/api/invoices/' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static generateInvoices(token, data){
    return fetch(APIROOT + '/api/invoices/generate_invoices/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static uploadOrdersFile(token, data){
    return fetch(APIROOT + '/api/orders/import_ordersfile/',
			{
				method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
				body: data,
			}
		)
  }

  static uploadShippingFile(token, data){
    return fetch(APIROOT + '/api/orders/import_shippingfile/',
			{
				method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
				body: data,
			}
		)
  }

  static uploadPurchasesFile(token, data){
    return fetch(APIROOT + '/api/purchases/import_file/',
			{
				method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
				body: data,
			}
		)
  }

  static uploadProductsFile(token, data){
    return fetch(APIROOT + '/api/products/import_file/',
			{
				method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
				body: data,
			}
		)
  }

  static uploadInventoryFile(token, data){
    return fetch(APIROOT + '/api/inventory/import_file/',
			{
				method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${token}`
        },
				body: data,
			}
		)
  }

  static getOverview(token, data){
    return fetch(APIROOT + '/api/orders/get_overview/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static signinUser(credentials){
    return fetch(APIROOT + '/api-token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
  }

  static getAccountDetails(token, id){
    return fetch(APIROOT + '/api/accounts/' + id + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
  }

  static updateProfile(token, id, data){
    return fetch(APIROOT + '/api/accounts/update_profile/' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }

  static changePassword(token, id, data){
    return fetch(APIROOT + '/api/accounts/change_password' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    })
  }
}