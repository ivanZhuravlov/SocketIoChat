import { Component, Input , OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './app.user';
import { UserService } from './user.service';

@Component({
  selector: 'app-auth',
  template: `
  <h2>Please Log In</h2>
  <form (ngSubmit)="logIn()">
    <label for="name">      User Name   </label> <input [(ngModel)]="name"  [ngModelOptions]="{standalone: true}" name="name" required>
    <label for="password">  Password    </label> <input [(ngModel)]="password"  [ngModelOptions]="{standalone: true}" id="password" type="password" required> 
    <button type="submit">Log In</button>
  </form>
  <h2>Or Sign In</h2>
  <form (ngSubmit)="signUp()">
    <label for="newName">       User Name   </label> <input [(ngModel)]="newName"  [ngModelOptions]="{standalone: true}" name="newName" required>          
    <label for="newPassword">   Password    </label> <input [(ngModel)]="newPassword"  [ngModelOptions]="{standalone: true}" id="newPassword" type="password" required>
    <button type="submit">Sign In</button>
  </form>
  `,
  providers: [UserService]
})
export class AuthComponent {

    private name        : String;
    private password    : String;
    private newName     : String;
    private newPassword : String;
    private token       : String;

    constructor( private userService : UserService , private router: Router ){

    }

    logIn(){
        this.userService.authenticate(this.name, this.password)
        .then( (token) =>{
            //Save token and go to chat
            this.token = token;
            this.router.navigate(['/users']);
        })
        .catch( function(err){
            //Handle Error
            console.log(err);
        });
    }

    signUp(){
        this.userService.signUp(this.newName, this.newPassword)
        .then( (token) => {
            //Save token and go to chat
            this.token = token;
            this.router.navigate(['/users']);
        })
        .catch(function(err){
            //Handle Error
            console.log(err);
        });
    }
}