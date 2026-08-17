import { Sidebar } from './../../shared/components/sidebar/sidebar';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AuthenticateService } from '../../core/services/authenticate';
import { Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { NotificationSignalRService } from '../../core/services/SignalR/notification-signalr';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Sidebar ,RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {
  private notificationSignalRService = inject(NotificationSignalRService);
  private authenticateService = inject(AuthenticateService);
  constructor(private authService: AuthenticateService, private router: Router) {}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  async ngOnInit(): Promise<void> {
    if (this.authenticateService.isLoggedIn()) {
      await this.notificationSignalRService.start();
    }
  }
}
