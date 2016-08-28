import { Component } from '@angular/core';

import { User } from './app.user';

@Component({
  selector: 'chat-app',
  template: `
  <h1> {{title}} </h1>
  <router-outlet></router-outlet>
  `
})

export class AppComponent { 
    title = 'Super Chat';
}