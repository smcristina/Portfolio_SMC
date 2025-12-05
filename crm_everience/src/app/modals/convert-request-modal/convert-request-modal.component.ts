import { Component, Input } from '@angular/core';
import { RequestService } from '../../services/crm/requests.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-convert-request-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './convert-request-modal.component.html',
  styleUrl: './convert-request-modal.component.scss',
})
export class ConvertRequestModalComponent {
  @Input() requestId!: number;
  serviceTypology: string = '';

  constructor(private requestService: RequestService, private router: Router) {}

  onConvert() {
    if (!this.requestId) return;
    console.log('-->', this.requestId, this.serviceTypology);
    this.requestService
      .convertRequest(this.requestId, this.serviceTypology)
      .subscribe({
        next: (res) => {
          console.log('Conversione completata:', res);
          this.closeModal();
          this.router.navigate(['crm', 'sales-contracts']);
        },
        error: (err) => {
          console.error('Errore nella conversione:', err);
        },
      });
  }

  showType() {
    console.log(this.serviceTypology);
  }

  closeModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.remove('active');
  }
}
