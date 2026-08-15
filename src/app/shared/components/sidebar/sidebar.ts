import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { SidebarMenuItem } from '../../../models/Sidebar/SidebarMenuItem';
import { sidebarMenu } from '../../../config/sidebar-menu';
import { AuthenticateService } from '../../../core/services/authenticate';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
     RouterModule,
     RouterLink
    ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  private authService = inject(AuthenticateService);

  isSidebarCollapsed = false;
  activeMenu: string | null = 'dashboard';

  menuItems = sidebarMenu;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMenu(menu: string): void {
    if (this.activeMenu === menu) {
      this.activeMenu = null;
      return;
    }

    this.activeMenu = menu;
  }

  hasPermission(permission?: string): boolean {
    if (!permission) {
      return true;
    }

    return this.authService.hasPermission(permission);
  }

  canShowMenu(item: SidebarMenuItem): boolean {

    if (item.permission && this.hasPermission(item.permission)) {
      return true;
    }

    if (item.children?.length) {
      return item.children.some(child =>
        this.canShowMenu(child)
      );
    }

    return !item.permission;
  }

  getVisibleChildren(item: SidebarMenuItem): SidebarMenuItem[] {
    return item.children?.filter(child =>
      this.canShowMenu(child)
    ) ?? [];
  }
}

