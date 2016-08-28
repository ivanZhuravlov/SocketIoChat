import { Component, Input , OnInit } from '@angular/core';

import { User } from './app.user';
import { UserService } from './user.service';

@Component({
  selector: 'user-list',
  template: `
  <h2>Connected Users</h2>
  <ul>
    <li *ngFor="let user of users" > {{user.id}} </li>
  </ul>
  `,
  providers: [UserService]
})
export class UsersListComponent implements OnInit{
    users : Object[];

    constructor(private userService: UserService) {}

    getUsers(): void {
        this.userService.getUsers().then( (users) => {
          this.users = users;
          console.log("users " +users);
        });
    }
    ngOnInit() {
      this.getUsers();
    }
}