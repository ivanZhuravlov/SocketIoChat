import { Component, Input , OnInit, ViewChild } from '@angular/core';
import * as io from 'socket.io-client'
import { Router } from '@angular/router'

import { User } from './app.user';
import { UserService } from './user.service';
import { UserChatComponent } from './app.user-chat.component';
import { UserChatDirective } from './app.user-chat.directive';

@Component({
  selector: 'user-list',
  directives: [UserChatComponent, UserChatDirective],
  entryComponents : [UserChatComponent],
  template: `
  <h2>Connected Users</h2>
  <h3>Click on user name to start chat</h3>
  <ul>
    <li *ngFor="let user of users" ><a (click)="beginChat(user.name)"> {{user.name}} </a></li>
  </ul>
  <div chats></div>
  `
})
export class UsersListComponent implements OnInit{
    @ViewChild(UserChatDirective) chatAnchor: UserChatDirective;
    users :   Object[];
    
    constructor(private userService: UserService, private router: Router ) {}

    getUsers(): void {
        this.userService.getUsers().then( (users) => {
          this.users = users;
        });
    }

    ngOnInit() {
      UserService.socket = io.connect("http://localhost:8080");
      let self:UsersListComponent = this;  
      UserService.socket.on('update',function(data){
        self.getUsers();
      });
      this.getUsers();
    }

    isNotCurrentUser(id:String){
      return id != UserService.socket.id;
    }

    beginChat(id:String){
      this.chatAnchor.createChat(UserChatComponent,id);
    }
}