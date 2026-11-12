import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthenticateService
} from '../../../core/services/authenticate';

import {
  ToastService
} from '../../../core/services/toast/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {

  registerForm: FormGroup;

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
    this.registerForm = this.fb.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],

      phone: [
        '',
        [
          Validators.required
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ],

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

    this.registerForm.addValidators(
      (form) => {

        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;

        if (
          password &&
          confirmPassword &&
          password !== confirmPassword
        ) {
          return {
            passwordMismatch: true
          };
        }

        return null;
      }
    );
  }

  ngOnInit(): void {
    this.generateCaptcha();
  }

  generateCaptcha(): void {

    this.captchaLoading.set(true);
    this.errorMessage.set('');

    this.authService.generateCaptcha().subscribe({

      next: (response) => {

        if (
          response.isSuccess &&
          response.data
        ) {

          this.captchaId.set(
            response.data.captchaId
          );

          this.captchaImage.set(
            response.data.image
          );

          this.registerForm.patchValue({
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

        this.registerForm.patchValue({
          captchaId: '',
          captchaAnswer: ''
        });

        this.toast.error(
          error.error?.message ??
          'دریافت کد امنیتی با خطا مواجه شد.'
        );
      }

    });
  }

  onSubmit(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const {
      firstName,
      lastName,
      phone,
      password,
      captchaId,
      captchaAnswer
    } = this.registerForm.value;

    this.authService
      .register(
        firstName,
        lastName,
        phone,
        password,
        captchaId,
        captchaAnswer
      )
      .subscribe({

        next: (response) => {

          this.isLoading.set(false);

          if (response.isSuccess) {

            this.toast.success(
              'حساب کاربری شما با موفقیت ایجاد شد.',
              'ثبت نام موفق'
            );

            this.router.navigate([
              '/auth/login'
            ]);
          }
        },

        error: (error) => {

          this.isLoading.set(false);

          if (
            error.error?.Errors?.length > 0
          ) {

            for (
              const err of error.error.Errors
            ) {
              this.toast.error(err);
            }

          } else {

            this.toast.error(
              error.error?.message ??
              'ثبت نام با خطا مواجه شد.'
            );
          }

          this.generateCaptcha();
        }

      });
  }
}
