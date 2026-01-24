import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-crud',
  templateUrl: './crud.html',
  styleUrl: './crud.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CrudComponent implements OnInit {
  users: User[] = [];
  newUser = { name: '', email: '', phone: '' };
  editingId: number | null = null;
  editingUser = { name: '', email: '', phone: '' };
  nextId = 1;
  searchTerm = '';

  ngOnInit() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '9876543212' }
    ];
    this.nextId = 4;
  }

  // Create
  addUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.phone) {
      alert('Please fill all fields');
      return;
    }

    const user: User = {
      id: this.nextId++,
      ...this.newUser
    };

    this.users.push(user);
    this.newUser = { name: '', email: '', phone: '' };
    alert('User added successfully!');
  }

  // Read - Filtered list
  get filteredUsers(): User[] {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Update
  startEdit(user: User) {
    this.editingId = user.id;
    this.editingUser = { ...user };
  }

  saveEdit() {
    if (this.editingId === null) return;

    const index = this.users.findIndex(u => u.id === this.editingId);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...this.editingUser };
      this.editingId = null;
      this.editingUser = { name: '', email: '', phone: '' };
      alert('User updated successfully!');
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editingUser = { name: '', email: '', phone: '' };
  }

  // Delete
  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(u => u.id !== id);
      alert('User deleted successfully!');
    }
  }

  // Clear all
  clearAll() {
    if (confirm('Are you sure you want to delete all users?')) {
      this.users = [];
      this.nextId = 1;
      alert('All users deleted!');
    }
  }
}
