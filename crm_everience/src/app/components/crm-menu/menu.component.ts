import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserService } from '../../services/user.service';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private auth: Auth
  ) {}

  mockRole: string = 'Admin';
  currentUser?: User;
  subMenuIsVisible: boolean = false;
  selectedSubMenu: string = '';

  ngOnInit() {
    // Listen for Firebase Auth state
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // user.uid is the Firebase UID
        this.userService.getCurrentUser(user.uid).subscribe((u) => {
          this.currentUser = u;
        });
      } else {
        this.currentUser = undefined;
      }
    });
  }

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

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.currentUser?.role || '');
  }
}
