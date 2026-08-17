import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationSignalRService } from './core/services/SignalR/notification-signalr';
import { AuthenticateService } from './core/services/authenticate';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Store.Frontend');
}
