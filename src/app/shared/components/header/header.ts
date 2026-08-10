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
}
