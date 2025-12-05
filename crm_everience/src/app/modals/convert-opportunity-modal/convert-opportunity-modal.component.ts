import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClientService } from '../../services/crm/clients.service';
import { OpportunityService } from '../../services/crm/opportunities.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-convert-opportunity-modal',
  standalone: true,
  imports: [FormsModule, BrowserModule, BrowserAnimationsModule],
  templateUrl: './convert-opportunity-modal.component.html',
  styleUrl: './convert-opportunity-modal.component.scss',
})
export class ConvertOpportunityModalComponent {
  constructor(
    private clientService: ClientService,
    private opportunityService: OpportunityService,
    private router: Router
  ) {}

  @Input() opportunityId!: number;
  @Output() leadCreated = new EventEmitter<any>();

  newRequest = {
    id_opportunity: 0,
    contract_typology: '',
    address: '',
    employee_seniority: '',
    clock_in: '09:00',
    clock_out: '18:00',
    final_client: '',
    start_date: '',
    end_date: '',
    resources_quantity: 0,
    week_working_days: '',
    service_duration: 0,
    back_fill: 0,
    description: '',
    status: '',
    budget: 0,
    has_pnl: 0,
    archived: 0,
  };

  workModes = [
    { value: 'onsite', label: 'In sede' },
    { value: 'ibrido', label: 'Ibrido' },
    { value: 'remote', label: 'Remoto' },
  ];

  skillsets = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'fullstack', label: 'Fullstack' },
    { value: 'designer', label: 'Designer' },
  ];

  contractTypes = [
    'Tirocinio curriculare',
    'Tirocinio extracurriculare',
    'Apprendistato',
    'Tempo determinato',
    'Tempo indeterminato',
    'Collaborazione occasionale',
    'Partiva Iva',
  ];

  clients: any = [];
  selectedClient: string = '';
  selectedContract: string = '';
  selectedOption: string = '';
  selectedSilo: string = '';
  backFillSelected: boolean = false;
  hasBackfill: boolean = false;
  dateError: string = '';
  timeError: string = '';
  allowedTimes: string[] = [];
  missingContractTypology: boolean = false;
  missingSeniority: boolean = false;
  missingResourcesQuantity: boolean = false;
  missingServiceDuration: boolean = false;
  missingWeekWorkingDays: boolean = false;
  missingFinalClient: boolean = false;
  missingAddress: boolean = false;

  ngOnInit(): void {
    this.fetchClients();
    this.generateAllowedTimes();
  }

  onClientChange(event: Event) {
    this.selectedClient = (event.target as HTMLSelectElement).value;
    this.newRequest.final_client = this.selectedClient;
    // this.newLead.contact_name = this.selectedClient;
    console.log(this.selectedClient);
  }

  onContractChange(event: Event) {
    this.selectedContract = (event.target as HTMLSelectElement).value;
    this.newRequest.contract_typology = this.selectedContract;
  }

  onActivityChange(event: Event) {
    this.selectedOption = (event.target as HTMLSelectElement).value;
    //this.newRequest.new_contract = this.selectedOption;
  }

  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next: (data: any) => {
        this.clients = data;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  generateAllowedTimes() {
    const startHour = 7;
    const endHour = 21;
    for (let h = startHour; h <= endHour; h++) {
      this.allowedTimes.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < endHour)
        this.allowedTimes.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }

  validateDatesAndTimes(): boolean {
    const { start_date, end_date, clock_in, clock_out } = this.newRequest;

    this.dateError = '';
    this.timeError = '';

    // Check dates
    if (!start_date || !end_date) {
      this.dateError = 'Inserisci sia la data di inizio che la data di fine.';
      return false;
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (start > end) {
      this.dateError = 'La data di inizio non può essere dopo la data di fine.';
      return false;
    }

    // Check times only if both are filled
    if (clock_in && clock_out) {
      const [inHours, inMinutes] = clock_in.split(':').map(Number);
      const [outHours, outMinutes] = clock_out.split(':').map(Number);

      const inTime = new Date();
      inTime.setHours(inHours, inMinutes, 0, 0);

      const outTime = new Date();
      outTime.setHours(outHours, outMinutes, 0, 0);

      if (inTime >= outTime) {
        this.timeError =
          'Il Clock In non può essere uguale o successivo al Clock Out.';
        return false;
      }
    }

    return true;
  }

  convertOpportunity() {
    const opportunityId = this.opportunityId;

    this.missingContractTypology=false;
    this.missingSeniority=false;
    this.missingResourcesQuantity=false;
    this.missingServiceDuration=false;
    this.missingWeekWorkingDays=false;
    this.missingFinalClient=false;
    this.missingAddress=false;

    let hasErrors = false;


    if (!this.newRequest.contract_typology) {
      this.missingContractTypology = true;
      hasErrors = true;
    }

    if(!this.newRequest.employee_seniority){
      this.missingSeniority = true;
      hasErrors= true;
    }

    if(!this.newRequest.resources_quantity){
      this.missingResourcesQuantity=true;
      hasErrors = true;
    }

    if(!this.newRequest.service_duration){
      this.missingServiceDuration = true;
      hasErrors = true;
    }

    if(!this.newRequest.week_working_days){
      this.missingWeekWorkingDays = true;
      hasErrors = true;
    }

    if(!this.newRequest.final_client){
      this.missingFinalClient = true;
      hasErrors = true;
    }

    if(!this.newRequest.address){
      this.missingAddress = true;
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }


    if (!this.validateDatesAndTimes()) {
      return;
    }

    this.opportunityService
      .convertOpportunityToRequest(opportunityId, this.newRequest)
      .subscribe({
        next: () => {
          console.log('Opportunity converted and request created');
          this.leadCreated.emit(this.newRequest);
          console.log(this.newRequest);
          this.router.navigate(['crm', 'requests']);
        },
        error: (err) => console.error('Error converting opportunity', err),
      });
    console.log(opportunityId, this.newRequest);
  }

  closeModal() {
    this.hasBackfill = false;
    const modal = document.querySelector('.modal-container');
    modal?.classList.remove('active');
    this.newRequest = {
      id_opportunity: 0,
      contract_typology: '',
      address: '',
      employee_seniority: '',
      clock_in: '',
      clock_out: '',
      final_client: '',
      start_date: '',
      end_date: '',
      resources_quantity: 0,
      week_working_days: '',
      service_duration: 0,
      back_fill: 0,
      description: '',
      status: '',
      budget: 0,
      has_pnl: 0,
      archived: 0,
    };
    this.dateError = '';
    this.timeError = '';
    this.missingContractTypology = false;
    this.missingSeniority = false;
    this.missingResourcesQuantity = false;
    this.missingServiceDuration = false;
    this.missingWeekWorkingDays = false;
    this.missingFinalClient = false;
    this.missingAddress = false;
  }
}
