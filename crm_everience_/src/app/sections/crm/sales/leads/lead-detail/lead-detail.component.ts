import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from '../../../../../modals/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { LeadService } from '../../../../../services/crm/leads.service';
import { ClientService } from '../../../../../services/crm/clients.service';
 
@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.scss',
})
export class LeadDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private leadService: LeadService,
    private clientService: ClientService,
    private router: Router,
    private dialog: MatDialog
  ) {}
 
  isLoading = true;
  error: string | null = null;
 
  lead: any = [];
  id!: number;
  editing: boolean = false;
 
  parsedData: string = '';
  parsedLastData: string = '';
 
  selectedClient: number = 0;
  isLoadingClients: any;
  clients: any = [];
 
  selectedActivity: string = '';
  selectedSilo: string = '';
 
  ngOnInit() {
    this.fetchClients();
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
 
    console.log('ID from route:', id);
 
    if (id) {
      this.id = id;
      this.leadService.getLeadById(Number(id)).subscribe((data) => {
        this.lead = data;
        console.log(this.lead, 'and data:', data);
 
        if (this.lead.lead_data) {
          const date = new Date(this.lead.lead_data);
          this.parsedData = date.toISOString().split('T')[0];
        }
 
        if (this.lead.last_activity_date) {
          const date = new Date(this.lead.last_activity_date);
          this.parsedLastData = date.toISOString().split('T')[0];
        }
        // Inizializza i valori dei select con i dati del lead
        this.initializeSelectValues();
      });
    }
  }
 
  // Nuovo metodo per inizializzare i valori dei select
  initializeSelectValues() {
    // Inizializza selectedClient
    if (this.lead.id_client) {
      this.selectedClient = this.lead.id_client;
    }
 
    // Inizializza selectedSilo
    if (this.lead.silo) {
      this.selectedSilo = this.lead.silo;
    }
 
    // Inizializza selectedActivity
    if (this.lead.activity_description) {
      this.selectedActivity = this.lead.activity_description;
    }
  }
 
  editLead() {
    this.editing = !this.editing;
  }
 
  saveChanges() {
    this.lead.id_client = this.selectedClient;
    this.lead.silo = this.selectedSilo;
    this.lead.activity_description = this.selectedActivity;
    this.lead.notes = this.lead.notes;
 
    this.leadService.modifyLead(this.id, this.lead).subscribe(() => {
      this.router.navigate(['crm', 'leads']);
    });
  }
 
  navigationBack() {
    this.router.navigate(['crm', 'leads']);
  }
 
  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }
 
  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: 'Conferma conversione Lead > Opportunità' },
    });
 
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        //here convert to
      } else {
        console.log('Cancelled.');
      }
    });
  }
 
  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next: (data: any) => {
        this.clients = data;
        console.log(data, '>', this.clients);
 
        if (this.lead && Object.keys(this.lead).length > 0) {
          this.initializeSelectValues();
        }
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
 
  //campi a tendine
  onClientChange(event: Event) {
    this.selectedClient = Number((event.target as HTMLSelectElement).value);
    this.lead.id_client = this.selectedClient;
    // this.newLead.contact_name = this.selectedClient;
    console.log(this.selectedClient);
  }
 
  onActivityChange(event: Event) {
    this.selectedActivity = (event.target as HTMLSelectElement).value;
    this.lead.activity_description = this.selectedActivity;
  }
 
  onSiloChange(event: Event) {
    this.selectedSilo = (event.target as HTMLSelectElement).value;
    this.lead.silo = this.selectedSilo;
  }
}
 