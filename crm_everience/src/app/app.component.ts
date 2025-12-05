import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService } from './services/theme.service';
import { getAuth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Your App Title';
  showNavigation: boolean = true;
  currentTheme: string = 'light';
  private authSubscription: Subscription | undefined;

  constructor(private router: Router, private themeService: ThemeService) {}

  ngOnInit() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // User is logged in
        this.router.navigate(['home']);
      } else {
        // No user, redirect to login
        this.router.navigate(['login']);
      }
    });

    this.currentTheme = this.themeService.getCurrentTheme();
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}
