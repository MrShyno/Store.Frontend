import { ToastService } from './../../../../core/services/Toast/toast';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  DatePipe
} from '@angular/common';

import {
  AuthenticateService
} from '../../../../core/services/authenticate';

import {
  UserService
} from '../../../../core/services/Users/user-service';


interface UserSession {

  id: number;

  userAgent: string;

  refreshToken: string;

  location: string;

  loginDate: string;
}


interface UserSessionsResponse {
  data: UserSession[];
  isSuccess: boolean;
  status: string;
  message: string;
  errors: string[];
}


@Component({
  selector: 'app-user-session-list',

  standalone: true,

  imports: [
    DatePipe,
  ],

  templateUrl: './user-session-list.html',

  styleUrl: './user-session-list.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSessionList implements OnInit {

  private readonly authService =
    inject(AuthenticateService);

  private readonly userService =
    inject(UserService);

  private readonly toast =
    inject(ToastService);

  readonly sessions = signal<UserSession[]>([]);

  readonly loading = signal(false);

  readonly errorMessage = signal('');

  readonly currentUserId = signal<number | null>(null);


  readonly sessionCount = computed(() =>
    this.sessions().length
  );

  ngOnInit(): void {

    const userId = this.getCurrentUserId();

    if (!userId) {

      this.errorMessage.set(
        'اطلاعات کاربر جاری در دسترس نیست.'
      );

      return;
    }

    this.currentUserId.set(userId);

    this.loadSessions();
  }

  private getCurrentUserId(): number | null {

    /*
     * این قسمت را با API واقعی AuthenticateService
     * خودتان هماهنگ کنید.
     */

    return this.authService.getCurrentUser()?.id ?? null;
  }

  loadSessions(): void {

    const userId = this.currentUserId();

    if (!userId) {
      return;
    }

    this.loading.set(true);

    this.errorMessage.set('');

    this.userService
      .getUserSessionsByUserId(userId)
      .subscribe({

        next: response => {

          if (!response.isSuccess) {

            this.sessions.set([]);

            this.errorMessage.set(
              response.message ||
              'دریافت نشست‌ها انجام نشد.'
            );

            this.loading.set(false);

            return;
          }

          this.sessions.set(
            response.data ?? []
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(error);

          this.sessions.set([]);

          this.errorMessage.set(
            'دریافت نشست‌های کاربر با خطا مواجه شد.'
          );

          this.loading.set(false);
        }
      });
  }

  revokeSession(session: UserSession): void {

    const confirmed =
      window.confirm(
        'آیا از منقضی کردن این نشست مطمئن هستید؟'
      );

    if (!confirmed) {
      return;
    }

    this.loading.set(true);

    this.userService
      .revokeSession(session.refreshToken)
      .subscribe({

        next: response => {

          if (response.isSuccess) {

            this.toast.success(
              'نشست منقضی شد.'
            );

            this.loadSessions();

            return;
          }

          this.loading.set(false);

          this.toast.error(
            response.message ||
            'عملیات انجام نشد.'
          );
        },

        error: error => {

          console.error(error);

          this.loading.set(false);

          this.toast.error(
            'عملیات با خطا مواجه شد.'
          );
        }
      });
  }
}
