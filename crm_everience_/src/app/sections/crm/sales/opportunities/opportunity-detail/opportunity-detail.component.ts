import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OpportunityService } from '../../../../../services/crm/opportunities.service';
import { UserService } from '../../../../../services/crm/users.service';
import { ClientService } from '../../../../../services/crm/clients.service';

@Component({
  selector: 'app-opportunity-detail',
  templateUrl: './opportunity-detail.component.html',
  styleUrl: './opportunity-detail.component.scss',
})
export class OpportunityDetailComponent {
  opportunity: any = {};
  editing: boolean = false;
  parsedData: any;
  selectedManager: string = '';
  serviceManagerList: any[] = [];

  constructor(
    private route: ActivatedRoute,
    //private itemService: ItemService,
    private router: Router,
    private opportunitiesService: OpportunityService,
    private clientService: ClientService,
    private userService: UserService
  ) {}

  selectedActivity: string = '';
  id!: number;
  updatedOpportunity: any = {};

  selectedClient: number = 0;
  isLoadingClients: any;
  clients: any = [];

  ngOnInit() {
    this.fetchServiceManagers();

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (id) {
      this.id = id;
      // this.getOpportunity(id);
      this.opportunitiesService.getOpportunityById(id).subscribe((data) => {
        this.opportunity = data;

        // Inizializza i valori dei dropdown con i dati salvati
        this.selectedManager = data.assigned_service_manager || '';
        this.selectedActivity = data.activity_description || '';

        if (this.opportunity.opportunity_date) {
          const date = new Date(this.opportunity.opportunity_date);
          this.parsedData = date.toISOString().split('T')[0];
        }
      });

      this.initializeSelectValues();
    }

    this.fetchClients();
  }

  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next: (data: any) => {
        this.clients = data;

        if (this.opportunity && Object.keys(this.opportunity).length > 0) {
          this.initializeSelectValues();
        }
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  initializeSelectValues() {
    // Inizializza selectedClient
    if (this.opportunity.id_client) {
      this.selectedClient = this.opportunity.id_client;
    }
  }

  getOpportunity(id: any): void {
    this.opportunitiesService.getOpportunityById(id).subscribe({
      next: (data) => {
        this.opportunity = data;
        console.log(this.opportunity);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  editOpportunity() {
    this.editing = !this.editing;
  }

  navigationBack() {
    this.router.navigate(['crm', 'opportunities']);
  }

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }

  onManagerChange(event: Event) {
    this.selectedManager = (event.target as HTMLSelectElement).value;
    this.opportunity.assigned_service_manager = this.selectedManager;
    // this.missingSM = false;
  }

  onClientChange(event: Event) {
    this.selectedClient = Number((event.target as HTMLSelectElement).value);
    this.opportunity.id_client = this.selectedClient;
    // this.newLead.contact_name = this.selectedClient;
  }

  fetchServiceManagers(): void {
    // Assuming you have a service to fetch service managers
    this.userService.getServiceManagers().subscribe({
      next: (data: any[]) => {
        this.serviceManagerList = data;
        console.log('Service Managers loaded:', this.serviceManagerList);
      },
      error: (err: any) => {
        console.error('Error fetching service managers:', err);
      },
    });
  }

  onActivityChange(event: Event) {
    this.selectedActivity = (event.target as HTMLSelectElement).value;
    this.opportunity.activity_description = this.selectedActivity;
  }

  saveChanges() {
    this.opportunity.assigned_service_manager = this.selectedManager;
    this.opportunity.activity_description = this.selectedActivity;
    this.opportunity.id_client = this.selectedClient;
    console.log('--->', this.opportunity, this.clients);

    this.opportunitiesService
      .modifyOpportunity(this.id, this.opportunity)
      .subscribe(() => {
        this.editing = false;
        this.router.navigate(['crm', 'opportunities']);
      });
  }
}
