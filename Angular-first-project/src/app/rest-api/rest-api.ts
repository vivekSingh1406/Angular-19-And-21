import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './rest.service';
import { User } from './todo.model';

@Component({
  selector: 'app-rest-api',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rest-api.html',
  styleUrls: ['./rest-api.css'],
})
export class RestApi implements OnInit {
  users: User[] = [];

  newUser: User = {
    name: '',
    email: '',
    phone: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  // 🔹 GET USERS
  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  // 🔹 CREATE USER
  addUser() {
    if (!this.newUser.name || !this.newUser.email) {
      alert('Name and Email are required!');
      return;
    }

    this.apiService.createUser(this.newUser).subscribe({
      next: (res) => {
        console.log('User created:', res);

        // Add to UI (dummy API won't persist)
        this.users.unshift(res);

        // Reset form
        this.newUser = { name: '', email: '', phone: '' };
      },
      error: (err) => {
        console.error('Error creating user:', err);
      }
    });
  }

}
