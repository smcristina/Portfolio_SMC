import { Component, OnInit } from '@angular/core';
import { ConfirmationModalComponent } from '../../../../modals/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UserRole, UserService } from '../../../../services/crm/users.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnInit {
  constructor(private dialog: MatDialog, private userService: UserService) {}

  disabledDisplayedColumns: string[] = [
    'name',
    'email',
    'role',
    'status',
    'enable',
    'delete',
  ];
  enabledDisplayedColumns: string[] = [
    'name',
    'email',
    'role',
    'status',
    'disable',
    'delete',
  ];

  enabledUsersList = [];
  disabledUsersList = [];
  rolesList: UserRole[] = [];
  newUsers = [];

  ngOnInit() {
    this.fetchEnabledUsers();
    this.fetchDisabledUsers();
    this.fetchRoles();
  }

  fetchEnabledUsers(): void {
    this.userService.getEnabledUsers().subscribe({
      next: (data: any) => {
        this.enabledUsersList = data;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  fetchDisabledUsers(): void {
    this.userService.getDisabledUsers().subscribe({
      next: (data: any) => {
        this.disabledUsersList = data;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  fetchRoles(): void {
    this.userService.getUserRoles().subscribe({
      next: (roles) => {
        this.rolesList = roles;
      },
      error: (err) => console.error(err),
    });
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: "Sei sicuro di voler eliminare quest'utente?" },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        //here convert to
      } else {
        console.log('Cancelled.');
      }
    });
  }

  enableUser(user: any) {
    if (!user.user_role_name) {
      alert("Seleziona un ruolo prima di attivare l'utente");
      return;
    }

    this.userService.activateUser(user.id, user.user_role_name).subscribe({
      next: () => {
        this.fetchDisabledUsers();
        this.fetchEnabledUsers();
      },
      error: (err) => console.error(err),
    });
  }

  disableUser(id: number) {
    this.userService.deactivateUser(id).subscribe({
      next: () => {
        this.fetchDisabledUsers();
        this.fetchEnabledUsers();
      },
      error: (err) => console.error(err),
    });
  }
}
