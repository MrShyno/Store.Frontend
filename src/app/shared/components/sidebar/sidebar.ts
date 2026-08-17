import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  SidebarMenuItem
} from '../../../models/Sidebar/SidebarMenuItem';

import {
  sidebarMenu
} from '../../../config/sidebar-menu';

import {
  AuthenticateService
} from '../../../core/services/authenticate';


@Component({
  selector: 'app-sidebar',

  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './sidebar.html',

  styleUrl: './sidebar.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Sidebar {

  private readonly authService =
    inject(AuthenticateService);

  readonly isSidebarCollapsed =
    signal(false);

  readonly activeMenu =
    signal<string | null>('dashboard');

  readonly menuItems: readonly SidebarMenuItem[] =
    sidebarMenu;


  readonly visibleMenuItems = computed(() =>
    this.menuItems.filter(item =>
      this.canShowMenu(item)
    )
  );

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(
      collapsed => !collapsed
    );
  }

  toggleMenu(menu: string): void {

    this.activeMenu.update(current =>
      current === menu
        ? null
        : menu
    );
  }

  hasPermission(permission?: string): boolean {

    if (!permission) {
      return true;
    }

    return this.authService.hasPermission(permission);
  }

  canShowMenu(
    item: SidebarMenuItem
  ): boolean {

    if (
      item.permission &&
      this.hasPermission(item.permission)
    ) {
      return true;
    }

    if (item.children?.length) {

      return item.children.some(child =>
        this.canShowMenu(child)
      );
    }

    return !item.permission;
  }


  getVisibleChildren(
    item: SidebarMenuItem
  ): readonly SidebarMenuItem[] {

    return item.children?.filter(child =>
      this.canShowMenu(child)
    ) ?? [];
  }
}
