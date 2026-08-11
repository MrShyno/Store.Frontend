import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthenticateService } from '../../../core/services/authenticate';
import { ToastService } from '../../../core/services/toast/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  ngOnInit() {
    console.log(document.cookie);
  }
  constructor
    (
      private fb: FormBuilder,
      private authService: AuthenticateService,
      private router: Router,
      private toast: ToastService
    ) {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const { phone, password } = this.loginForm.value;

    this.authService.login(phone, password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.isSuccess) {
          this.toast.success('خوش آمدید!', 'ورود موفق');
          this.router.navigate(['/dashboard/index']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.error.Errors?.length > 0) {
          for (const err of error.error.Errors) {
            this.toast.error(err);
          }
        } else {
          this.toast.error(error.error.message ?? 'خطای نامشخص');
        }
      }
    });
  }
}
