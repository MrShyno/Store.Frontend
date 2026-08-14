import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {

  isSidebarCollapsed = false;

  activeMenu: string | null = 'dashboard';

  toggleMenu(menu: string): void {
    if (this.activeMenu === menu) {
      this.activeMenu = null;
      return;
    }

    this.activeMenu = menu;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
