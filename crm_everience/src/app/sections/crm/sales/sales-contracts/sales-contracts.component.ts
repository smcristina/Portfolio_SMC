import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../../../modals/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {
  SalesContract,
  SalesContractsService,
} from '../../../../services/crm/sales-contracts.service';

@Component({
  selector: 'app-sales-contracts',
  templateUrl: './sales-contracts.component.html',
  styleUrl: './sales-contracts.component.scss',
})
export class SalesContractsComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private salesContractsService: SalesContractsService
  ) {}

  displayedColumns: string[] = [
    'unique_speaking_code',
    'company_name',
    'start_date',
    'end_date',
    'contract_typology',
    'activity_description',
    'archive',
  ];

  client_contracts: SalesContract[] = [];
  dataSource: SalesContract[] = [];
  searchTerm: string = '';

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts() {
    this.salesContractsService.getSalesContracts().subscribe({
      next: (contracts) => {
        this.client_contracts = contracts;
        this.dataSource = contracts;
      },
      error: (err) => {
        console.error('Error loading contracts:', err);
      },
    });
  }

  openDetailedView(id: string) {
    console.log(id);
    this.router.navigate(['crm', 'sales-contracts', id]); //we call it like this because it is a nested url (a children of /crm)
  }

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }
  handleNewClient(newClient: any) {
    this.client_contracts.push(newClient);
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.client_contracts;
      return;
    }
    this.dataSource = this.client_contracts.filter((contract) =>
      Object.values(contract).some((value) =>
        String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: { message: 'Sei sicuro di volere archiviare questo contratto?' },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.archiveContract();
      } else {
        console.log('Cancelled.');
      }
    });
  }

  archiveContract() {
    //update of contract_client -lead- archived property from 0 to 1
    console.log('archiviato');
  }
}
