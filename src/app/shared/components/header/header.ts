import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticateService } from '../../../core/services/authenticate';
import { RouterLink } from '@angular/router';
import { Permission } from '../permission/permission';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    Permission,
    RouterLink
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  private readonly authService = inject(AuthenticateService);

  @Output() logout = new EventEmitter<void>();

  openDropdown: 'notifications' | 'user' | null = null;

  currentTime = new Date();

  get user() {
    return this.authService.getCurrentUser();
  }

  onLogout(): void {
    this.logout.emit();
    this.closeDropdown();
  }

  toggleDropdown(type: 'notifications' | 'user'): void {
    this.openDropdown =
      this.openDropdown === type
        ? null
        : type;
  }

  closeDropdown(): void {
    this.openDropdown = null;
  }
}
