import { Component } from '@angular/core';
import { MarketingComponent } from '../marketing/marketing.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss',
})
export class ContractsComponent {
  currentRoute: string = '';
  constructor(private router: Router) {}
  displayedColumns: string[] = [
    'employee-name',
    //'lead_data',
    'company_name',
    'sales_owner',
    'contact_email',
    'budget',
    'owner',
  ];

  leads = [
    {
      id: 1,
      id_client: 3, //this gets us the company data so we get from here the company name
      company_name: 'Everience',
      sales_owner: 'Enrico Puflo',
      contact_email: 'enricopuflito@gmail.com',
      contact_phone: 11234587123,
      notes: '',
      budget: 10000,
      archived: '',
      closure_type: '',
      activity_description: 'ProjectWorks',
      lead_data: '12/05/2023',
      converted_to_oppportunity: '',
      silo: 'Directo',
      unique_speaking_code: 'DIR-12-05-23-01',
      last_activity_date: '16-05-2023',
      owner: 'Paula Artusso',
      service_tipology: '?',
      stato: '',
      //??? pnl?
      first_name: 'Ruso',
      last_name: 'Russolo',
      //request data
      start_date: '2025-02-26T00:00:00.000Z',
      end_date: '2025-06-26T00:00:00.000Z',
    },
    {
      id: 2,
      id_client: 5, //this gets us the company data so we get from here the company name
      company_name: 'Galileo',
      sales_owner: 'Laura Bossi',
      contact_email: 'bossi.l@gmail.com',
      contact_phone: 1145780123,
      notes: '',
      budget: 20000,
      archived: '',
      closure_type: '',
      activity_description: 'T&M',
      lead_data: '23/07/2024',
      converted_to_oppportunity: '',
      silo: 'Indirecto',
      unique_speaking_code: 'GRP-30-04-24-05',
      last_activity_date: '16-05-2023',
      owner: 'Paula Artusso',
      service_tipology: '???',
      stato: '',
      first_name: 'Russo',
      last_name: 'Rusinho',
      start_date: '2025-02-26T00:00:00.000Z',
      end_date: '2025-12-26T00:00:00.000Z',
    },
  ];

  dataSource = this.leads;
  searchTerm: string = ''; // Stores user input
  endDateStr: string = '';
  isHighPriority: boolean = false;

  openDetailedView(id: string) {
    console.log(id);
    // show contract data
    // //we call it like this because it is a nested url (a children of /crm)
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
      this.dataSource = this.leads; // Reset if less than 2 characters
      return;
    }

    this.dataSource = this.leads.filter((lead) =>
      Object.values(lead).some((value) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  getContractPriority(endDateStr: string): 'low' | 'medium' | 'high' {
    const now = new Date();
    const endDate = new Date(endDateStr);

    const yearDiff = endDate.getFullYear() - now.getFullYear();
    const monthDiff = endDate.getMonth() - now.getMonth();
    const totalMonthDiff = yearDiff * 12 + monthDiff;

    if (totalMonthDiff > 6) {
      return 'low';
    } else if (totalMonthDiff > 3) {
      return 'medium';
    } else {
      this.isHighPriority = true;
      return 'high';
    }
  }
}
