import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.scss',
})
export class VendorsComponent {
  constructor(private router: Router) {}
  displayedColumns: string[] = [
    'vendor_name',
    'province',
    'service_category',
    'standard_daily_cost',
    'maggiorazione_non_feriale',
  ];

  vendors = [
    {
      id: 5,
      id_pnl: 3,
      vendor_name: 'FIRSTONE',
      province: 'Firenze',
      service_category: 'Stampanti e Telefoni',
      standard_daily_cost: 180,
      maggiorazione_non_feriale: '30-50%',
      cm_vendor: 'F5',
    },
  ];

  dataSource = this.vendors;
  searchTerm: string = ''; // Stores user input

  openDetailedView(id: string) {
    console.log(id);
    this.router.navigate(['crm', 'vendors', id]); //we call it like this because it is a nested url (a children of /crm)
  }

  handleNewVendor(newVendor: any) {
    this.vendors.push(newVendor);
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.vendors; // Reset if less than 2 characters
      return;
    }

    this.dataSource = this.vendors.filter((vendor) =>
      Object.values(vendor).some((value) =>
        value.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }
  export() {
    console.log('excel');
  }
}
