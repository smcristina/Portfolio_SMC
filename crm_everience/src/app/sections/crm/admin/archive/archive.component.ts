import { Component, OnInit } from '@angular/core';
import { Lead, LeadService } from '../../../../services/crm/leads.service';
import { ConfirmationModalComponent } from '../../../../modals/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
})
export class ArchiveComponent implements OnInit {
  constructor(private router: Router, private leadService: LeadService) {}
  displayedColumns: string[] = [
    'unique_speaking_code',
    'lead_data',
    'company_name',
    'sales_owner',
    'contact_email',
    'budget',
    'owner',
    'undo',
  ];

  leads: Lead[] = [];
  isLoading = true;
  error: string | null = null;
  dataSource = this.leads;
  searchTerm: string = '';

  ngOnInit(): void {
    this.fetchArchivedLeads();
  }

  fetchArchivedLeads(): void {
    this.leadService.getArchivedLeads().subscribe({
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

  restoreLead(id: number) {
    this.leadService.restoreLead(id).subscribe({
      next: (data) => {
        console.log('Lead archived:', data);
        this.fetchArchivedLeads();
      },
      error: (err) => {
        console.error('Error archiving lead:', err);
      },
    });
    console.log('archived', id);
  }

  openDetailedView(id: string) {
    console.log(id);
    this.router.navigate(['crm', 'leads', id]);
  }

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }
  handleNewLead(newLead: any) {
    this.leads.push(newLead);
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.leads;
      return;
    }

    this.dataSource = this.leads.filter((lead) =>
      Object.values(lead).some((value) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }
}
