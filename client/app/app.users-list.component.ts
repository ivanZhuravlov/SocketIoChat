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
    <li *ngFor="let user of users" ><button (click)="beginChat(user.name)"> {{user.name}} </button></li>
  </ul>
  <div chats></div>
  `
})
export class UsersListComponent implements OnInit{
    @ViewChild(UserChatDirective) chatAnchor: UserChatDirective;
    users :   Object[];
    openChats : Object = {};
    
    constructor(private userService: UserService) {}

    getUsers(): void {
        this.userService.getUsers().then( (users) => {
          this.users = users;
        });
    }

    ngOnInit() {
      this.userService.setSocket(io.connect("http://localhost:8080"));
      let self:UsersListComponent = this;  
      this.userService.getSocket().on('update',function(data){
        self.getUsers();
      });
      this.getUsers();
    }

    isNotCurrentUser(id:String){
      return id != this.userService.getSocket().id;
    }

    beginChat(id:string){
      if(this.openChats[id]){
        return;
      }
      
      this.openChats[id] = id;
      this.chatAnchor.createChat(UserChatComponent,id);
    }
}