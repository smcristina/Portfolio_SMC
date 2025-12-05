import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-contracts-data-modal',
  standalone: true,
  imports: [FormsModule, BrowserModule, BrowserAnimationsModule],
  templateUrl: './contracts-data-modal.component.html',
  styleUrl: './contracts-data-modal.component.scss',
})
export class ContractsDataModalComponent {
  closeModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.remove('active');
  }
}
