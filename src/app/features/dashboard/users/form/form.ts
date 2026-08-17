import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  UserService
} from '../../../../core/services/Users/user-service';
import { ToastService } from '../../../../core/services/toast/toast';


type UserFormMode = 'create' | 'edit' | 'view';

@Component({
  selector: 'app-user-form',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],

  templateUrl: './form.html',

  styleUrls: ['./form.css']
})
export class UserForm implements OnInit {

  private readonly fb = inject(FormBuilder);

  private readonly http = inject(UserService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  private readonly toast = inject(ToastService);


  // -----------------------------
  // State
  // -----------------------------

  form!: FormGroup;

  mode: UserFormMode = 'create';

  userId: number | null = null;


  submitting = false;

  // -----------------------------
  // Computed state
  // -----------------------------

  get isCreateMode(): boolean {
    return this.mode === 'create';
  }

  get isEditMode(): boolean {
    return this.mode === 'edit';
  }

  get isViewMode(): boolean {
    return this.mode === 'view';
  }


  get pageTitle(): string {

    if (this.isCreateMode) {
      return 'افزودن کاربر';
    }

    if (this.isEditMode) {
      return 'ویرایش کاربر';
    }

    return 'مشاهده کاربر';
  }


  get submitText(): string {

    if (this.isCreateMode) {
      return 'ایجاد کاربر';
    }

    return 'ذخیره تغییرات';
  }


  ngOnInit(): void {

    this.createForm();

    this.resolveMode();
  }


  // -----------------------------
  // Form
  // -----------------------------

  private createForm(): void {

    this.form = this.fb.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],

      email: [
        '',
        [
          Validators.email,
          Validators.maxLength(200)
        ]
      ],

      nationalCode: [
        '',
        [
          Validators.maxLength(10)
        ]
      ],

      password: [
        '',
        []
      ]

    });
  }


  // -----------------------------
  // Mode
  // -----------------------------

  private resolveMode(): void {

    const url = this.route.snapshot.url;

    if (url.some(segment => segment.path === 'create')) {

      this.mode = 'create';

      this.applyCreateMode();

      return;
    }


    if (url.some(segment => segment.path === 'edit')) {

      this.mode = 'edit';

      this.userId =
        Number(this.route.snapshot.paramMap.get('id'));

      this.applyEditMode();

      this.loadUser();

      return;
    }


    if (url.some(segment => segment.path === 'view')) {

      this.mode = 'view';

      this.userId =
        Number(this.route.snapshot.paramMap.get('id'));

      this.applyViewMode();

      this.loadUser();

      return;
    }
  }


  // -----------------------------
  // Mode configuration
  // -----------------------------

  private applyCreateMode(): void {

    const passwordControl =
      this.form.get('password');

    passwordControl?.setValidators([
      Validators.required,
      Validators.minLength(8)
    ]);

    passwordControl?.updateValueAndValidity();
  }


  private applyEditMode(): void {

    this.form.get('password')?.clearValidators();

    this.form.get('password')?.updateValueAndValidity();
  }


  private applyViewMode(): void {

    this.form.disable();
  }


  // -----------------------------
  // Load User
  // -----------------------------

  private loadUser(): void {

    if (!this.userId) {
      return;
    }

    this.http
      .getUserById
      (
        this.userId
      )
      .subscribe({
        next: response => {

          this.form.patchValue({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phone: response.data.phone,
            email: response.data.email,
            nationalCode: response.data.nationalCode
          });

        },

        error: error => {

          console.error(error);
          this.toast.error('دریافت اطلاعات کاربر با خطا مواجه شد.');
        }

      });
  }


  // -----------------------------
  // Submit
  // -----------------------------

  onSubmit(): void {

    if (this.isViewMode) {
      return;
    }

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.submitting = true;

    if (this.isCreateMode) {

      this.createUser();

      return;
    }


    if (this.isEditMode) {

      this.updateUser();

      return;
    }
  }


  // -----------------------------
  // Create
  // -----------------------------

  private createUser(): void {

    const payload = {

      firstName:
        this.form.value.firstName,

      lastName:
        this.form.value.lastName,

      phone:
        this.form.value.phone,

      email:
        this.form.value.email,

      meliCode:
        this.form.value.nationalCode,

      password:
        this.form.value.password

    };


    this.http
      .createUser
      (
        payload
      )
      .subscribe({

        next: response => {

          this.submitting = false;

          this.toast.success('کاربر با موفقیت ایجاد شد.');

          this.form.reset();

          setTimeout(() => {
            this.router.navigate(['/dashboard/users/list']);
          }, 800);
        },

        error: error => {

          console.error(error);

          this.toast.error('ایجاد کاربر با خطا مواجه شد.');

          this.submitting = false;
        }

      });
  }


  // -----------------------------
  // Update
  // -----------------------------

  private updateUser(): void {

    if (!this.userId) {
      return;
    }


    const payload = {

      id: this.userId,

      firstName:
        this.form.value.firstName,

      lastName:
        this.form.value.lastName,

      phone:
        this.form.value.phone,

      email:
        this.form.value.email,

      meliCode:
        this.form.value.nationalCode

    };


    this.http
      .updateUser(
        payload
      )
      .subscribe({

        next: response => {

          this.submitting = false;

          this.toast.success('اطلاعات کاربر با موفقیت بروزرسانی شد.');

          setTimeout(() => {
            this.router.navigate(['/users']);
          }, 800);
        },

        error: error => {

          console.error(error);
          this.toast.error('ویرایش کاربر با خطا مواجه شد.');
          this.submitting = false;
        }

      });
  }


  // -----------------------------
  // Navigation
  // -----------------------------

  goBack(): void {

    this.router.navigate(['/users']);
  }


  // -----------------------------
  // Validation helper
  // -----------------------------

  hasError(
    controlName: string,
    error: string
  ): boolean {

    const control =
      this.form.get(controlName);

    return !!(
      control &&
      control.hasError(error) &&
      (control.touched || control.dirty)
    );
  }
}
