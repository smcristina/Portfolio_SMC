import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../../services/crm/users.service';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../services/crm/leads.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CreateOpportunityRequest,
  OpportunityService,
} from '../../services/crm/opportunities.service';

@Component({
  selector: 'app-convert-lead-modal',
  standalone: true,
  imports: [FormsModule, BrowserModule, BrowserAnimationsModule, CommonModule],
  templateUrl: './convert-lead-modal.component.html',
  styleUrl: './convert-lead-modal.component.scss',
})
export class ConvertLeadModalComponent {
  @Output() leadCreated = new EventEmitter<any>();
  @Output() opportunityCreated = new EventEmitter<any>();

  isLoadingServiceManager: boolean = false;
  serviceManagerList: any[] = [];
  selectedManager: string = '';
  selectedOption: string = '';
  selectedSilo: string = '';
  missingSM: boolean = false;
  missingContractData: boolean = false;
  users: any = [];
  id!: number;

  newOpportunity: any = {
    // service_manager_assegnato: '',
    id_lead: 0, // Richiesto dal backend
    assigned_service_manager: '', //  Corrispondenza corretta
    opportunity_date: new Date(), //  Anche se verrà sovrascritto dal backend
    new_sale: 0, //  Invece di new_contract
    archived: 0, // Default
    converted: 0,
  };

  // opportunityConversion = [];

  constructor(
    private userService: UserService,
    private leadService: LeadService,
    private router: Router,
    private opportunitiesService: OpportunityService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  // convertLead() {
  //   this.newOpportunity.service_manager_assegnato = this.selectedManager;
  //   this.newOpportunity.new_contract = this.selectedOption;

  //   if (!this.newOpportunity.service_manager_assegnato) {
  //     this.missingSM = true;
  //   }
  //   if (!this.newOpportunity.new_contract) {
  //     this.missingContractData = true;
  //   } else {
  //     this.missingContractData = false;
  //     this.missingSM = false;
  //     console.log(this.newOpportunity);

  //     // proceed with conversion logic
  //   }
  // }

  convertLead() {
    // Reset errori
    this.missingSM = false;
    this.missingContractData = false;

    // Validazione
    let hasErrors = false;

    if (this.selectedManager == '' || this.selectedManager == null) {
      this.missingSM = true;
      hasErrors = true;
    }

    if (!this.selectedOption) {
      this.missingContractData = true;
      hasErrors = true;
    }

    // Se validazione OK, procedi
    if (!hasErrors) {
      this.saveOnChanges();
    } else {
      console.log(' Errori di validazione:', {
        selectedManager: this.selectedManager,
        selectedOption: this.selectedOption,
        missingSM: this.missingSM,
        missingContractData: this.missingContractData,
      });
    }
  }

  saveOnChanges() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const leadId = idParam ? Number(idParam) : null;

    console.log('ID Lead dalla route:', leadId);

    if (!leadId) {
      console.error(' ID del lead non trovato nella route');
      return;
    }

    // Prepara i dati nel formato corretto per il backend
    const opportunityData: CreateOpportunityRequest = {
      id_lead: leadId, // ID del lead da convertire
      assigned_service_manager: this.selectedManager, // Service Manager selezionato
      new_sale: this.selectedOption === 'Si' ? 1 : 0, // Converte "Si"/"No" in 1/0
      archived: 0, // Default
      converted: 0, // Default
      // opportunity_date viene creata automaticamente dal backend
    };

    console.log('Dati opportunity da inviare:', opportunityData);

    // Prima converti il lead
    this.leadService.convertLead(leadId).subscribe({
      next: () => {
        console.log('Lead convertito con successo');

        // Poi crea l'opportunity
        this.opportunitiesService.createOpportunity(opportunityData).subscribe({
          next: (res: any) => {
            console.log('Opportunity creata con successo:', res);
            this.opportunityCreated.emit(res);
            this.closeModal();

            this.router.navigate(['crm/opportunities']);
          },
          error: (err: any) => {
            console.error('Errore creazione opportunity:');
            console.error('Status:', err.status);
            console.error('Message:', err.message);
            console.error('Error details:', err.error);
            console.error('Full error:', err);

            let errorMsg = "Errore nella creazione dell'opportunity.";
            if (err.error?.message) {
              errorMsg += ` Dettagli: ${err.error.message}`;
            }
          },
        });
      },
      error: (err: any) => {
        console.error('Errore conversione lead:', err);
      },
    });
  }

  closeModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.remove('active');
  }

  onManagerChange(event: Event) {
    this.selectedManager = (event.target as HTMLSelectElement).value;
    // this.newOpportunity.service_manager_assegnato = this.selectedManager;
    this.missingSM = false;
  }

  onActivityChange(event: Event) {
    this.selectedOption = (event.target as HTMLSelectElement).value;
    // this.newOpportunity.new_contract = this.selectedOption;
    this.missingContractData = false;
  }

  fetchUsers(): void {
    this.isLoadingServiceManager = true;

    this.userService.getServiceManagers().subscribe({
      next: (data: any[]) => {
        this.serviceManagerList = data;
        // this.users = data;

        // Filtra solo gli utenti con user_role = 5 (Service Managers)
        // this.serviceManagerList = this.users.filter((user: any) => user.id_user_role === 5);

        // console.log('All users:', this.users);
        // console.log('Service Managers (filtered):', this.serviceManagerList);

        console.log('Service Managers loaded:', this.serviceManagerList);

        this.isLoadingServiceManager = false;
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
        this.isLoadingServiceManager = false;
      },
    });
  }
}
