import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  @Output() logout = new EventEmitter<void>();
  currentTime = new Date();

  onLogout(): void {
    this.logout.emit();
  }

  openDropdown: 'notifications' | 'user' | null = null;

  toggleDropdown(type: 'notifications' | 'user'): void {
    this.openDropdown =
      this.openDropdown === type ? null : type;
  }

  closeDropdown(): void {
    this.openDropdown = null;
  }
}
