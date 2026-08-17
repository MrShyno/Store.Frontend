import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import { Subscription } from 'rxjs';

import {
  HealthCheck,
  HealthCheckService
} from '../../../core/services/HealthCheck/health-check';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.html',
  styleUrls: ['./index.css']
})
export class Index implements OnInit, OnDestroy {

  private readonly healthService = inject(HealthCheckService);

  readonly healthChecks = signal<HealthCheck[]>([]);

  readonly healthLoading = signal(true);

  readonly healthError = signal(false);

  private healthSubscription?: Subscription;


  readonly overallStatus = computed(() => {

    const checks = this.healthChecks();

    if (checks.length === 0) {
      return 'Unknown';
    }

    return checks.every(
      x => x.status.toLowerCase() === 'healthy'
    )
      ? 'Healthy'
      : 'Unhealthy';
  });


  readonly allEntries = computed(() => {

    const entries: HealthCheck['entries'] = [];

    for (const health of this.healthChecks()) {

      for (const entry of health.entries) {

        if (!entries.some(x => x.name === entry.name)) {
          entries.push(entry);
        }

      }

    }

    return entries;
  });


  ngOnInit(): void {
    this.loadHealthCheck();
  }

  loadHealthCheck(): void {

    this.healthSubscription?.unsubscribe();

    this.healthLoading.set(true);
    this.healthError.set(false);

    this.healthSubscription =
      this.healthService.getHealthChecks().subscribe({

        next: (data) => {

          console.log('Health Check:', data);

          this.healthChecks.set(data);

          this.healthError.set(false);
          this.healthLoading.set(false);
        },

        error: (error) => {

          console.error(
            'Health Check Error:',
            error
          );

          this.healthChecks.set([]);

          this.healthError.set(true);
          this.healthLoading.set(false);
        }

      });
  }

  getServiceTitle(name: string): string {

    switch (name.toLowerCase()) {

      case 'sql-server':
        return 'SQL Server';

      case 'redis':
        return 'Redis';

      case 'disk-space':
        return 'فضای دیسک';

      case 'server-memory':
        return 'حافظه سرور';

      default:
        return name;
    }
  }


  getServiceIcon(name: string): string {

    switch (name.toLowerCase()) {

      case 'sql-server':
        return 'bx bx-data';

      case 'redis':
        return 'bx bx-server';

      case 'disk-space':
        return 'bx bx-hdd';

      case 'server-memory':
        return 'bx bx-memory-card';

      default:
        return 'bx bx-cube';
    }
  }


  getServiceLabelClass(name: string): string {

    switch (name.toLowerCase()) {

      case 'sql-server':
        return 'bg-label-primary';

      case 'redis':
        return 'bg-label-info';

      case 'disk-space':
        return 'bg-label-warning';

      case 'server-memory':
        return 'bg-label-success';

      default:
        return 'bg-label-secondary';
    }
  }


  getStatusBadgeClass(status: string): string {

    switch (status.toLowerCase()) {

      case 'healthy':
        return 'bg-label-success';

      case 'unhealthy':
        return 'bg-label-danger';

      case 'degraded':
        return 'bg-label-warning';

      default:
        return 'bg-label-secondary';
    }
  }


  getStatusDotClass(status: string): string {

    switch (status.toLowerCase()) {

      case 'healthy':
        return 'status-dot-success';

      case 'unhealthy':
        return 'status-dot-danger';

      case 'degraded':
        return 'status-dot-warning';

      default:
        return 'status-dot-secondary';
    }
  }

  formatDate(date: string | undefined): string {

    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(parsedDate);
  }

  formatDuration(duration: string): string {
    const parts = duration.split(':');

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = Number(parts[2]);

    const totalMilliseconds =
      (hours * 3600 + minutes * 60 + seconds) * 1000;

    return `${totalMilliseconds.toFixed(3)} ms`;
  }

  ngOnDestroy(): void {
    this.healthSubscription?.unsubscribe();
  }
}
