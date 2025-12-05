import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Opportunity,
  OpportunityService,
} from '../../../../services/crm/opportunities.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../../../modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrl: './opportunities.component.scss',
})
export class OpportunitiesComponent implements OnInit {
  constructor(
    private router: Router,
    private opportunitiesService: OpportunityService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'unique_speaking_code',
    'lead_data',
    'company_name',
    //'assigned_service_manager',
    'contact_name',
    'contact_email',
    'budget',
    'partita_iva',
    'owner',
    'archive',
  ];

  opportunities: Opportunity[] = [];
  isLoading = true;
  error: string | null = null;
  dataSource: any;
  searchTerm: string = '';

  openDetailedView(id: string) {
    console.log(id);
    this.router.navigate(['crm', 'opportunities', id]); //we call it like this because it is a nested url (a children of /crm)
  }

  ngOnInit() {
    this.fetchOpportunities();
  }

  fetchOpportunities(): void {
    this.opportunitiesService.getOpportunities().subscribe({
      next: (data) => {
        this.opportunities = data;
        this.isLoading = false;
        this.dataSource = this.opportunities;
        console.log(this.opportunities);
      },
      error: (err) => {
        this.error = 'Failed to load leads.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.opportunities; // Reset if less than 2 characters
      return;
    }

    this.dataSource = this.opportunities.filter((opportunity) =>
      Object.values(opportunity).some((value) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: 'Sei sicuro di volere archiviare questa opportunity?' },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.archiveOpportunity(id);
      } else {
        console.log('Archiviato.');
      }
    });
  }

  archiveOpportunity(id: number) {
    this.opportunitiesService.archiveOpportunity(id).subscribe({
      next: (data) => {
        console.log('Opportunity archived:', data);
        this.fetchOpportunities(); // Refresh
      },
      error: (err) => {
        console.error('Error archiving lead:', err);
      },
    });
    console.log('archived', id);
  }
}
