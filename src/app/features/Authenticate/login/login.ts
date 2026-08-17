import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthenticateService } from '../../../core/services/authenticate';
import { ToastService } from '../../../core/services/Toast/toast';
import { NotificationSignalRService } from '../../../core/services/SignalR/notification-signalr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  loginForm: FormGroup;

  isLoading = signal(false);
  captchaLoading = signal(false);

  errorMessage = signal('');

  captchaImage = signal('');
  captchaId = signal('');
  constructor(
    private fb: FormBuilder,
    private authService: AuthenticateService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      phone: [
        '',
        [
          Validators.required,
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      rememberMe: [true],

      captchaAnswer: [
        '',
        [
          Validators.required,
          Validators.maxLength(6)
        ]
      ],

      captchaId: [
        '',
        [
          Validators.required
        ]
      ]
    });
  }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {
    this.captchaLoading.set(true);
    this.errorMessage.set('');

    this.authService.generateCaptcha().subscribe({
      next: (response) => {

        if (response.isSuccess && response.data) {

          this.captchaId.set(response.data.captchaId);
          this.captchaImage.set(response.data.image);

          this.loginForm.patchValue({
            captchaId: response.data.captchaId,
            captchaAnswer: ''
          });
        }

        this.captchaLoading.set(false);
      },

      error: (error) => {
        this.captchaLoading.set(false);

        this.captchaImage.set('');
        this.captchaId.set('');

        this.loginForm.patchValue({
          captchaId: '',
          captchaAnswer: ''
        });

        this.toast.error(
          error.error?.message ?? 'دریافت کد امنیتی با خطا مواجه شد.'
        );
      }
    });
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const {
      phone,
      password,
      rememberMe,
      captchaId,
      captchaAnswer
    } = this.loginForm.value;

    this.authService
      .login(
        phone,
        password,
        rememberMe,
        captchaId,
        captchaAnswer
      )
      .subscribe({
        next: async (response) => {

          this.isLoading.set(false);

          if (response.isSuccess) {
            this.toast.success(
              'خوش آمدید!',
              'ورود موفق'
            );

            this.router.navigate([
              '/dashboard/index'
            ]);
          }
        },

        error: (error) => {

          this.isLoading.set(false);

          if (error.error?.Errors?.length > 0) {

            for (const err of error.error.Errors) {
              this.toast.error(err);
            }

          } else {

            this.toast.error(
              error.error?.message ??
              'خطای نامشخص'
            );
          }

          this.generateCaptcha();
        }
      });
  }
}
