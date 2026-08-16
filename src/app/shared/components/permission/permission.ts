import {
  Component,
  inject,
  input
} from '@angular/core';

import { AuthenticateService } from '../../../core/services/authenticate';

@Component({
  selector: 'app-permission',
  standalone: true,
  templateUrl: './permission.html'
})
export class Permission {

  private readonly authService = inject(AuthenticateService);

  readonly permission = input<string | null>(null);

  hasPermission(): boolean {
    const permission = this.permission();

    if (!permission) {
      return true;
    }

    return this.authService.hasPermission(permission);
  }
}
