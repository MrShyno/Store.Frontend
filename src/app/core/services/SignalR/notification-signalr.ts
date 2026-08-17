import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState
} from '@microsoft/signalr';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthenticateService } from '../authenticate';
import { API_CONFIG } from '../../../config/api.config';

interface ForceLogoutPayload {
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationSignalRService {

  private readonly router = inject(Router);
  private readonly authenticateService = inject(AuthenticateService);

  private hubConnection: HubConnection | null = null;
  private isForceLoggingOut = false;

  async start(): Promise<void> {

    if (
      this.hubConnection &&
      (
        this.hubConnection.state === HubConnectionState.Connected ||
        this.hubConnection.state === HubConnectionState.Connecting
      )
    ) {
      return;
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${API_CONFIG.baseUrl}/hubs/notifications`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    this.registerEvents();

    try {

      await this.hubConnection.start();

      console.log('SignalR connected');

    } catch (error) {

      console.error('SignalR connection failed:', error);

    }
  }

  private registerEvents(): void {

    if (!this.hubConnection) {
      return;
    }

    this.hubConnection.on(
      'ForceLogout',
      async (payload: ForceLogoutPayload) => {

        console.log(
          'Force logout received:',
          payload.reason
        );

        await this.forceLogout(payload.reason);
      }
    );
  }

  private async forceLogout(reason: string): Promise<void> {

    if (this.isForceLoggingOut) {
      return;
    }

    this.isForceLoggingOut = true;

    console.warn
      (
        'User will be logged out:',
        reason
      );

    try {

      await firstValueFrom
        (
          this.authenticateService.logout()
        );

    } catch (error) {

      console.error
        (
          'Logout request failed:',
          error
        );

    } finally {

      await this.stop();

      await this.router.navigate(['auth/login']);

      this.isForceLoggingOut = false;
    }
  }

  async stop(): Promise<void> {

    if (!this.hubConnection) {
      return;
    }

    try {

      await this.hubConnection.stop();

    } catch (error) {

      console.error(
        'SignalR stop failed:',
        error
      );

    } finally {

      this.hubConnection = null;
    }
  }
}
