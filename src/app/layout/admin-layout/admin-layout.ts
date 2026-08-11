import { Sidebar } from './../../shared/components/sidebar/sidebar';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthenticateService } from '../../core/services/authenticate';
import { Router } from '@angular/router';
import { Header } from '../../shared/components/header/header';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Sidebar],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {
  constructor(private authService: AuthenticateService, private router: Router) {}
  // Handle logout event from Header component
}
