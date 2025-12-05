import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeadService } from '../../services/crm/leads.service';
import { Client, ClientService } from '../../services/crm/clients.service';
import { UserService, User } from '../../services/crm/users.service';
import { ContactService } from '../../services/crm/contacts.service';

// export interface NewLead {
//     id?: number | null;
//     id_client?: number | null;
//     id_user: number;
//     company_name: string;
//     contact_name: string,
//     contact_email?: string;
//     contact_phone?: number;
//     contact_role?: string;
//     notes: string;
//     budget: number;
//     archived?: number;
//     closure_type?: string;
//     activity_description: string,
//     lead_data: Date;
//     converted?: number;
//     silo: string,    //user: 'currentUser',
//     unique_speaking_code?: string;
//     last_activity_date?: Date;
//     owner?: string;
//     };
@Component({
  selector: 'app-create-lead-modal',
  standalone: true,
  imports: [FormsModule, BrowserModule, BrowserAnimationsModule],
  templateUrl: './create-lead-modal.component.html',
  styleUrl: './create-lead-modal.component.scss',
})
export class CreateLeadModalComponent {
  @Output() leadCreated = new EventEmitter<any>();
  isLoadingClients: any;
  isLoadingOwners: any;

  // currentUser: User | null = null;

  constructor(
    private leadService: LeadService,
    private clientService: ClientService,
    private userService: UserService,
    private contactService: ContactService
  ) {}

  
  newLead: any = {
    activity_description: '',
    budget: 0,
    silo: '',
    // contact_name: '',
    //user: 'currentUser',
    id_client: 0,
    id_user: 0,
    contact_name: '',
    lead_data: new Date(),
    owner: '',
    notes: '',
    // company_name: '',
  };
  
  // newLead: NewLead = {};

  clients: any = [];
  selectedClient: number = 0;
  selectedActivity: string = '';
  selectedSilo: string = '';
  selectedOwner: number = 0; // va riempito
  users: any = [];
  missingFields: boolean = false;
  // selectedUser: string = 'currentUser';
  
  // contactsName: ContactService[] = [];
  contacts: any = [];
  selectedContactName: string = '';

  ngOnInit(): void {
    this.fetchClients();
    this.fetchUsers();
    this.fetchClientsContactName();
    // this.setCurrentUserAsOwner
  }

  // // Imposta l'utente corrente come owner predefinito
  // setCurrentUserAsOwner(): void {
  //   this.currentUser = this.authService.getCurrentUserSync();

  //   if (this.currentUser) {
  //     this.selectedOwner = this.currentUser.id;
  //     this.newLead.id_user = this.currentUser.id;
  //     this.newLead.owner = `${this.currentUser.first_name} ${this.currentUser.last_name}`;

  //     console.log('Utente corrente impostato come owner:', this.currentUser);
  //   } else {
  //     // Se non c'è un utente corrente, sottoscrivi all'observable
  //     this.authService.currentUser$.subscribe(user => {
  //       if (user) {
  //         this.currentUser = user;
  //         this.selectedOwner = user.id;
  //         this.newLead.id_user = user.id;
  //         this.newLead.owner = `${user.first_name} ${user.last_name}`;

  //         console.log('Utente corrente caricato e impostato come owner:', user);
  //       }
  //     });
  //   }
  // }

  createLead() {
    // Validate required fields
    if (
      !this.newLead.id_client ||
      !this.newLead.activity_description ||
      !this.newLead.silo
    ) {
      this.missingFields = true;
      return;
    }
 
    this.leadService.createLead(this.newLead).subscribe({
      next: (res: any) => {
        console.log('Lead created successfully:', res);
        this.leadCreated.emit(this.newLead);
        this.resetForm();
        this.closeModal();
      },
      error: (err: any) => {
        console.error('Failed to create lead', err);
        console.error('Errore completo:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        console.error('Error object:', err.error);
      },
    });
  }

  closeModal() {
    this.resetForm();
    const modal = document.querySelector('.modal-container');
    modal?.classList.remove('active');
  }

  resetForm() {
    this.newLead = {
      activity_description: '',
      budget: 0,
      silo: '',
      // contact_name: '',
      //user: 'currentUser',
      id_client: 0,
      id_user: 0,
      notes: '',
      lead_data: new Date(),
      // company_name: '',
      owner: '',
    };
    this.selectedClient = 0;
    this.selectedActivity = '';
    this.selectedSilo = '';
    this.selectedOwner = 0;
    this.selectedContactName = '';
    
  }

 onClientChange(event: Event): void {
  this.selectedClient = Number((event.target as HTMLSelectElement).value);
  this.newLead.id_client = this.selectedClient;

  const selected = this.clients.find((client: Client) => client.id === this.selectedClient);

  if (selected?.company_name) {
    this.contactService.getContactName(selected.company_name).subscribe({
      next: (data: any) => {
        this.contacts = data;
        console.log('Referenti trovati:', data);
      },
      error: (err: any) => {
        console.error('Errore nel recupero referenti:', err);
      }
    });
  }
}

  onActivityChange(event: Event) {
    this.selectedActivity = (event.target as HTMLSelectElement).value;
    this.newLead.activity_description = this.selectedActivity;
  }

  onSiloChange(event: Event) {
    this.selectedSilo = (event.target as HTMLSelectElement).value;
    this.newLead.silo = this.selectedSilo;
  }

  onOwnerChange(event: Event) {
    this.selectedOwner = Number((event.target as HTMLSelectElement).value);
    this.newLead.id_user = this.selectedOwner;
  }
   
  onContactNameChange(event: Event): void {
    this.selectedContactName = (event.target as HTMLSelectElement).value;
    this.newLead.contact_name = this.selectedContactName;
    console.log('Referente selezionato:', this.selectedContactName);
  }


  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next: (data: any) => {
        this.clients = data;
        console.log(data, '>', this.clients);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  fetchUsers(): void {
    this.isLoadingOwners = true;
    this.userService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        this.isLoadingOwners = false;
        console.log(data, '>', this.users);
      },
      error: (err: any) => {
        this.isLoadingOwners = false;
        console.error(err);
      },
    });
  }
  
   fetchClientsContactName(): void {
    if(!this.selectedClient)

    this.contactService.getContactName(this.selectedContactName).subscribe({
      next: (data: any) => {
        this.contacts = data;
        console.log('contatti trovati', data);
      },
      error: (err: any) => {
        console.error('errore nel recupero dei fetchClientsContactName', err);
      },
    });
  }
}
