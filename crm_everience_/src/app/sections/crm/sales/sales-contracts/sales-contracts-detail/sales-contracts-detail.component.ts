import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SalesContract,
  SalesContractsService,
} from '../../../../../services/crm/sales-contracts.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from '../../../../../services/crm/users.service';

@Component({
  selector: 'app-sales-contracts-detail',
  templateUrl: './sales-contracts-detail.component.html',
  styleUrl: './sales-contracts-detail.component.scss',
})
export class SalesContractsDetailComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private salesContractsService: SalesContractsService,
    private usersService: UserService
  ) {}

  contract: any = {};
  editing = false;
  backFill: string = '';
  serviceManager: any = {};

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.salesContractsService.getSalesContractById(+id).subscribe({
        next: (data: SalesContract) => {
          this.contract = data;
          this.backFill = this.contract.back_fill == 0 ? 'No' : 'Si';
          this.fetchServiceManagers();
        },
        error: (err) => {
          console.error('Error fetching contract', err);
          // fallback if needed
          this.contract = {};
        },
      });
    }
  }

  editRequest() {
    this.editing = !this.editing;
  }

  fetchServiceManagers(): void {
    console.log(this.contract.assigned_service_manager, this.contract);
    this.usersService
      .getServiceManagerById(Number(this.contract.assigned_service_manager))
      .subscribe({
        next: (data: any) => {
          this.serviceManager = data;
          console.log('Service Managers loaded:', this.serviceManager);
        },
        error: (err: any) => {
          console.error('Error fetching service managers:', err);
        },
      });
  }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Handle invalid date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //getters and setters for date formats
  get formattedDateRequest(): string {
    return this.formatDateForInput(this.contract.request_date);
  }
  set formattedDateRequest(value: string) {
    this.contract.request_date = value;
  }

  get formattedStartDate(): string {
    return this.formatDateForInput(this.contract.start_date);
  }
  set formattedStartDate(value: string) {
    this.contract.start_date = value;
  }

  get formattedEndDate(): string {
    return this.formatDateForInput(this.contract.end_date);
  }
  set formattedEndDate(value: string) {
    this.contract.end_date = value;
  }

  export() {
    const DATA = this.pdfContent.nativeElement;
    html2canvas(DATA).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`contratto_${this.contract.unique_speaking_code}.pdf`);
    });
  }
}
