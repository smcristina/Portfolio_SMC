import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketing-menu',
  templateUrl: './marketing-menu.component.html',
  styleUrl: './marketing-menu.component.scss',
})
export class MarketingMenuComponent {
  constructor(private router: Router) {}

  mockRole: string = 'Admin';

  subMenuIsVisible: boolean = false;
  selectedSubMenu: string = '';

  showSubmenu(submenu: string) {
    this.subMenuIsVisible = true;
    this.selectedSubMenu = submenu;
  }

  hideSubMenu() {
    this.subMenuIsVisible = false;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.hideSubMenu();
  }
}
