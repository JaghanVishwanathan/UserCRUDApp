import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  editUser(id: number): void {
    // Navigate to edit page
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id);
    this.loadUsers();
  }
}
