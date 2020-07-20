import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const API_URL = 'https://fanfictionfback.herokuapp.com/api/test/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  deleteUser(userId: number){
    return this.http.delete(API_URL + 'deleteuser/' + userId);
  }

  blockUser(userId: number){
    return this.http.post(API_URL + 'blockuser', userId, httpOptions);
  }

  setUserRole(userId: number){
    return this.http.post(API_URL + 'setuserrole', userId, httpOptions);
  }

  getAllUsers(){
    return this.http.get(API_URL + 'getAllUsers');
  }

  setAdminRole(userId: number){
    return this.http.post(API_URL + 'setadmin', userId, httpOptions);
  }

  editUser(userId, userName) {
    return this.http.post(API_URL + 'edituser', {
      id: userId,
      username: userName,
    }, httpOptions);
  }

  getUser(userId: number){
    return this.http.get(API_URL + 'getuser/' + userId);
  }
}
