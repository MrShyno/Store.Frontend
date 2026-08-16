import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HealthEntry {
  id: number;
  name: string;
  status: string;
  description: string | null;
  duration: string;
  tags: string[];
}

export interface HealthCheck {
  id: number;
  status: string;
  onStateFrom: string;
  lastExecuted: string;
  uri: string;
  name: string;
  discoveryService: string | null;
  entries: HealthEntry[];
  history: unknown[];
}

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:7071/health-ui-api';

  getHealthChecks(): Observable<HealthCheck[]> {
    return this.http.get<HealthCheck[]>(this.apiUrl);
  }
}
