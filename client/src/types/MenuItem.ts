export interface MenuItem {
  label: string;
  icon: any;
  route: string;
  class?: string;
  requiresAdmin: boolean;
  requiresAuth?: boolean;
  subsections?: MenuItem[];
}
