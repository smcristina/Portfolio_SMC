import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  showNavigation: boolean = true; // Controls whether the navigation is visible
  currentTheme: string = 'light';
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router, private themeService: ThemeService) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  navigateBack() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme(); // Update the theme after toggling
  }

  getIcon() {
    return this.currentTheme === 'light' ? 'fa-sun' : 'fa-moon';
  }
}
