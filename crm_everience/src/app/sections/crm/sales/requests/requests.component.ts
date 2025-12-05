import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Request,
  RequestService,
} from '../../../../services/crm/requests.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss',
})
export class RequestsComponent implements OnInit {
  constructor(private router: Router, private requestService: RequestService) {}
  displayedColumns: string[] = [
    'request_code',
    'lead_data',
    'company_name',
    'sales_owner',
    'contact_email',
    'budget',
    'partita_iva',
    'has_pnl',
    'owner',
    'archive',
  ];

  requests: Request[] = [];
  dataSource = this.requests;
  searchTerm: string = '';
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    //here we get the dataSource (opportunities list)
    //and show only the ones that are converted_to_request == false
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.requestService.getRequests().subscribe({
      next: (data) => {
        this.requests = data;
        console.log(data, this.requests);
        this.isLoading = false;
        this.dataSource = this.requests;
      },
      error: (err) => {
        this.error = 'Failed to load requests.';
        this.isLoading = false;
        console.error(err, 'no req');
      },
    });
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.requests;
      return;
    }

    this.dataSource = this.requests.filter((request) =>
      Object.values(request).some((value) =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  openDetailedView(id: string) {
    console.log(id);
    this.router.navigate(['crm', 'requests', id]); //we call it like this because it is a nested url (a children of /crm)
  }

  addPNL(id: string) {
    this.router.navigate(['crm', 'pnl', id]);
  }
}
