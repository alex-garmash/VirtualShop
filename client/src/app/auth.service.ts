import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';



@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private Endpoint = 'http://localhost:3000/api/';

    constructor(private http: HttpClient) {
    }
/** function registred new user **/
    registerUser(user) {
        return this.http.post<any>(`${this.Endpoint}users`, user);
    }
/** function do login **/
    login(user) {
        return this.http.post<any>(`${this.Endpoint}login`, user);
    }
/** function check if user email and ID already exist in DB **/
    checkLogin(obj) {
        return this.http.post<any>(`${this.Endpoint}users/regAuth`, obj);
    }
}
