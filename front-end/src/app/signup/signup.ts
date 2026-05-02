import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class Signup {

  userName: string = '';
  password: string = '';
  email: string = '';
  mobileNumber: string = '';
  country: string = '';

  isLoading: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    const payload = {
      userName: this.userName,
      password: this.password,
      email: this.email,
      mobileNumber: this.mobileNumber,
      country: this.country
    };

    this.isLoading = true;

    this.auth.signUp(payload).subscribe({

      next: (res: any) => {
        this.isLoading = false;

        const text = typeof res === 'string' ? res : JSON.stringify(res || '');

        if (text && text.toLowerCase().includes('success')) {
          alert('Registration successful');
          this.router.navigate(['/signin']);
        } else {
          alert(text || 'Registration failed');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error || err?.message || 'Registration failed';
        alert(msg);
      }
    });
  }
}