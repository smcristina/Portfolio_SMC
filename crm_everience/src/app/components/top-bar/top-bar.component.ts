import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
})
export class TopBarComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog
  ) {}
  navigateBackToHome() {
    this.router.navigate(['/']);
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: 'Sei sicuro di voler uscire?' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.logout();
      } else {
        console.log('Cancelled.');
      }
    });
  }

  logout() {
    this.userService
      .logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => console.log(error));
  }
}
