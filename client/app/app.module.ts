import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }         from './app.component';
import { UserService }          from './user.service'
import { UsersListComponent}    from './app.users-list.component'
import { UserChatComponent}    from './app.user-chat.component'
import { AuthComponent }        from './app.auth.component'
import { routing }              from './app.routing'

@NgModule({
  imports:      [ BrowserModule , FormsModule , HttpModule , routing ],
  declarations: [ AppComponent , UsersListComponent , AuthComponent, UserChatComponent ],
  providers :   [ UserService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }