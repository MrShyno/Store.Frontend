export interface SidebarMenuItem {
  title: string;
  icon?: string;
  route?: string;
  permission?: string;
  children?: SidebarMenuItem[];
}
