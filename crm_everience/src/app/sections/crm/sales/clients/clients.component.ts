import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Client,
  ClientService,
} from '../../../../services/crm/clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  constructor(
    private router: Router, 
    private clientService: ClientService) {}
  displayedColumns: string[] = [
    'company_name',
    'partita_iva',
    'ateco',
    'contact_name',
    'contact_email',
    'address',
  ];

  clients: Client[] = [];

  dataSource: any = '';
  searchTerm: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = false;
        this.dataSource = this.clients;
      },
      error: (err) => {
        this.error = 'Failed to load clients';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  createClient(newClient: any): void {
    this.clientService.createClient(newClient).subscribe({
      next: (response) => {
        console.log('Client created successfully', response);
        this.fetchClients(); // Refresh the client list
      },
      error: (error) => {
        console.error('Error creating client:', error);
      },
    });
  }

  openDetailedView(id: string) {
    console.log(id);
    this.router.navigate(['crm', 'clients', id]); //we call it like this because it is a nested url (a children of /crm)
  }

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }
  handleNewClient(newClient: any) {
    this.clients.push(newClient);
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.clients;
      return;
    }

    this.dataSource = this.clients.filter((client) =>
      Object.values(client).some((value) =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }
}
