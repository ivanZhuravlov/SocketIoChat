import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from './app.user';

@Injectable()
export class UserService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private options = new RequestOptions({ headers: this.headers });

    private serverUrl = 'http://localhost:8080'

    constructor(private http: Http) { }

    getUsers(): Promise<User[]> {
        return this.http.get(this.serverUrl+'/users')
        .toPromise()
        .then(response => response.json().data as User[])
        .catch(this.handleError);
    }

    authenticate( name, password ): Promise<String> {
        var body = { name : name , password : password };
        return this.http.post(this.serverUrl+'/authenticate',body, this.options)
        .toPromise()
        .then(response =>response.json().token as String)
        .catch(this.handleError);
    }

    signUp( name, password ): Promise<String> {
        var body = { name : name , password : password };
        return this.http.post(this.serverUrl+'/users',body, this.options)
        .toPromise()
        .then(response => response.json().token as String)
        .catch(this.handleError);
    }

    me( token ): Promise<User> {
        return this.http.post(this.serverUrl+'/me',{ token: token }, this.options)
        .toPromise()
        .then(response => response.json().data as User)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
         console.error('An error occurred', error);
         //TODO show error message to user 
         return Promise.reject(error.message || error);
    } 
}