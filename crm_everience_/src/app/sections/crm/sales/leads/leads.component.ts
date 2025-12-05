import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lead, LeadService } from '../../../../services/crm/leads.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../../../modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.scss',
})
export class LeadsComponent implements OnInit {
  constructor(
    private router: Router,
    private leadService: LeadService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'unique_speaking_code',
    'company_name',
    'lead_data',
    'budget',
    'owner',
    'archive',
  ];

  leads: Lead[] = [];
  isLoading = true;
  error: string | null = null;
  dataSource: any;
  searchTerm: string = '';

  ngOnInit(): void {
    this.fetchLeads();
  }

  fetchLeads(): void {
    this.leadService.getLeads().subscribe({
      next: (data) => {
        this.leads = data;
        this.isLoading = false;
        this.dataSource = this.leads;
        console.log('show me leads:', this.leads, this.dataSource);
      },
      error: (err) => {
        this.error = 'Failed to load leads.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  openDetailedView(id: string) {
    this.router.navigate(['crm', 'leads', id]); //we call it like this because it is a nested url (a children of /crm)
  }

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }

  handleNewLead(newLead: any) {
    this.fetchLeads();
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.leads;
      return;
    }

    this.dataSource = this.leads.filter((lead) =>
      Object.values(lead).some((value) =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: 'Sei sicuro di volere archiviare questa lead?' },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.archiveLead(id);
      } else {
        console.log('Archiviato.');
      }
    });
  }

  archiveLead(id: number) {
    this.leadService.archiveLead(id).subscribe({
      next: (data) => {
        console.log('Lead archived:', data, id);
        this.fetchLeads();
      },
      error: (err) => {
        console.error('Error archiving lead:', err);
      },
    });
  }
}
