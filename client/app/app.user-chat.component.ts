import { Component, Input , OnInit } from '@angular/core';
//import * as io from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';

import { User } from './app.user';
import { UserService } from './user.service';

@Component({
  selector: 'ct',
  template: `
    <div>
    <h2>{{receiverName}}</h2>
    <form (ngSubmit)="sendMessage()">
        <ul>
            <li *ngFor="let item of messages">
            {{item}}
            </li>
        </ul>
        <input [(ngModel)]="message"  autocomplete="off" [ngModelOptions]="{standalone: true}" required/>
        <button>Send</button>
    </form>
    </div>
  `
})
export class UserChatComponent implements OnInit{

    private receiverName: String;
    private sub:        any;
    private message:    String;
    private messages:   String[] = [];
    private initialMessage:string;

    constructor(private userService: UserService ) {}

    ngOnInit() {
        let self:UserChatComponent = this;
        this.userService.getSocket().on('globalMessage',function(data){
            if(self.receiverName == data.senderName || ( self.userService.getName() == data.senderName && self.receiverName == data.receiverName ) ){
                self.messages.push(data.message);
            }
        });
        if(self.initialMessage != ''){
            self.messages.push(self.initialMessage);
        }
    }

    public setReceiverName(name:String){
        this.receiverName = name;
    }

    public setInitialMessage(initialMessage:string){
        this.initialMessage = initialMessage;
    }

    sendMessage(){
        var message = { message : this.message, id : this.userService.getSocket().id , token : this.userService.getToken(), receiverName : this.receiverName , senderName : this.userService.getName() };
        this.userService.getSocket().emit('globalMessage',message);
        this.message = '';
    }
}