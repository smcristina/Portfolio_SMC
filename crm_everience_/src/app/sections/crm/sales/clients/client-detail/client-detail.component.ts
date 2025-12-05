import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Client,
  ClientService,
} from '../../../../../services/crm/clients.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
})
export class ClientDetailComponent {
  editing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    // private itemService: ItemService,
    private router: Router,
    private clientService: ClientService
  ) {}

  client: any;
  id!: number;
  dataSource: any = '';
  searchTerm: string = '';
  isLoading: boolean = false;
  error: string | null = null;
  parsedData: string = '';

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    
    console.log('ID from route:', id);

    if (id) {
      this.id=id;
      this.clientService.getClientById(id).subscribe((data) => {
        this.client = data;

        /*if (this.client.lead_data) {
          const date = new Date(this.client.lead_data);
          this.parsedData = date.toISOString().split('T')[0];
        }*/
      });
    }
  }

  editClient() {
    this.editing = !this.editing;
  }

  saveChanges() {
      this.clientService.modifyClient(this.id, this.client).subscribe(() => {
        
        this.router.navigate(['crm', 'clients']);
      });
      
  }

  navigationBack() {
    this.router.navigate(['crm', 'clients']);
  }
}
