import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css'],
})
export class Signin {

  userName: string = '';
  password: string = '';

  isLoading: boolean = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {

    if (!this.userName || !this.password) {
      alert('Please fill all fields');
      return;
    }

    const payload = {
      userName: this.userName,
      password: this.password
    };

    this.isLoading = true;

    this.auth.signIn(payload).subscribe({

      next: (res: any) => {
        this.isLoading = false;
        const text = typeof res === 'string' ? res : JSON.stringify(res || '');
        if (text && text.toLowerCase().includes('successful')) {
          this.auth.setUser({ userName: this.userName });
          this.router.navigate(['/product']);
        } else {
          alert(text || 'Sign in failed');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error || err?.message || 'Invalid username or password';
        alert(msg);
      }
    });
  }
}