import API from './api-service'
import { useCookies, Cookies} from 'react-cookie';


export default class AuthenticationService{

  static signout(){
    console.log('Signing out');
    document.cookie = "mr-user=;expires=" + new Date().toUTCString();
    document.cookie = "mr-token=;expires=" + new Date().toUTCString();
    window.location.reload();
  }

  static handleUnauthorized(){
    console.log('User is not authorized. Logging out');
    this.signout();
  }

  static login(username, password){
   
  }
}