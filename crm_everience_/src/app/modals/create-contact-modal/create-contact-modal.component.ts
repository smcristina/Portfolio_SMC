import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControlName, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-create-contact-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, BrowserModule, BrowserAnimationsModule],
  templateUrl: './create-contact-modal.component.html',
  styleUrl: './create-contact-modal.component.scss',
})
export class CreateContactModalComponent {
  @Output() contactCreated = new EventEmitter<any>();

  newContact = {
    company_name: '',
    contact_name: '',
    contact_mail: '',
    prefix: '',
    contact_phone: '',
    contact_role: '',
    contact_source: '',
  };
  phone_ult: string = '';

  selectedSource: string = '';
  selectedPrefix: string = '+39';

  countries = [
    { name: 'Grecia', prefix: '+30' },
    { name: 'Paesi Bassi', prefix: '+31' },
    { name: 'Belgio', prefix: '+32' },
    { name: 'Francia', prefix: '+33' },
    { name: 'Spagna', prefix: '+34' },
    { name: 'Ungheria', prefix: '+36' },
    { name: 'Italia', prefix: '+39' },
    { name: 'Romania', prefix: '+40' },
    { name: 'Svizzera', prefix: '+41' },
    { name: 'Austria', prefix: '+43' },
    { name: 'Regno Unito', prefix: '+44' },
    { name: 'Danimarca', prefix: '+45' },
    { name: 'Svezia', prefix: '+46' },
    { name: 'Norvegia', prefix: '+47' },
    { name: 'Polonia', prefix: '+48' },
    { name: 'Germania', prefix: '+49' },
    { name: 'Portogallo', prefix: '+351' },
    { name: 'Lussemburgo', prefix: '+352' },
    { name: 'Irlanda', prefix: '+353' },
    { name: 'Islanda', prefix: '+354' },
    { name: 'Albania', prefix: '+355' },
    { name: 'Malta', prefix: '+356' },
    { name: 'Cipro', prefix: '+357' },
    { name: 'Finlandia', prefix: '+358' },
    { name: 'Bulgaria', prefix: '+359' },
    { name: 'Lituania', prefix: '+370' },
    { name: 'Lettonia', prefix: '+371' },
    { name: 'Estonia', prefix: '+372' },
    { name: 'Moldavia', prefix: '+373' },
    { name: 'Armenia', prefix: '+374' },
    { name: 'Bielorussia', prefix: '+375' },
    { name: 'Andorra', prefix: '+376' },
    { name: 'Principato di Monaco', prefix: '+377' },
    { name: 'San Marino', prefix: '+378' },
    { name: 'Ucraina', prefix: '+380' },
    { name: 'Serbia', prefix: '+381' },
    { name: 'Montenegro', prefix: '+382' },
    { name: 'Kosovo', prefix: '+383' },
    { name: 'Croazia', prefix: '+385' },
    { name: 'Slovenia', prefix: '+386' },
    { name: 'Bosnia ed Erzegovina', prefix: '+387' },
    { name: 'Macedonia del Nord', prefix: '+389' },
    { name: 'Repubblica Ceca', prefix: '+420' },
    { name: 'Slovacchia', prefix: '+421' },
    { name: 'Liechtenstein', prefix: '+423' },
  ];
  sources = [
    { id: 1, name: 'Referral' },
    { id: 2, name: 'Eventi' },
    { id: 3, name: 'Social' },
    { id: 4, name: 'Contatto Personale' },
    { id: 5, name: 'Altro' },
  ];


  missingCompanyName: boolean = false;
  missingContactEmailorPhone: boolean = false;
  missingContactName: boolean = false;

  createContact() {
    // if (this.newContact.company_name && 
    //   this.newContact.contact_name && 
    //   this.newContact.contact_mail || this.newContact.contact_phone) {
    //     this.contactCreated.emit(this.newContact);
    //     this.closeModal();
    //     console.log(this.newContact);
    // } else {
    // }

    if(this.selectedPrefix && this.newContact.contact_phone){
      this.phone_ult = this.selectedPrefix + this.newContact.contact_phone
    }

    this.missingCompanyName = false;
    this.missingContactEmailorPhone = false;
    this.missingContactName = false;

    let hasErrors = false;

    if(!this.newContact.company_name){
      this.missingCompanyName = true;
      hasErrors = true;
    }

    if(!this.newContact.contact_name){
      this.missingContactName = true;
      hasErrors = true;
    }


    if(!this.newContact.contact_mail && !this.phone_ult){
        this.missingContactEmailorPhone = true;
        hasErrors = true;
    }

    if(!hasErrors){
      this.newContact.contact_phone = this.phone_ult
      this.contactCreated.emit(this.newContact);
      this.closeModal();
    } else {
      console.log("errore di validazione:")
    }

  }

  closeModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.remove('active');
    this.resetforms();
    this.missingCompanyName = false;
    this.missingContactEmailorPhone = false;
    this.missingContactName = false;
  }

  resetforms(){
    this.newContact = {
      company_name: '',
      contact_name: '',
      contact_mail: '',
      prefix: '+39',
      contact_phone: '',
      contact_role: '',
      contact_source: ''
    };
    this.selectedSource = '';
    this.selectedPrefix = '';
    this.phone_ult = '';
  }

  onSourceChange(event: Event) {
    this.selectedSource = (event.target as HTMLSelectElement).value;
    this.newContact.contact_source = this.selectedSource;
  }

  onPrefixChange(event: Event){
    this.selectedPrefix = (event.target as HTMLSelectElement).value;
    this.newContact.prefix = this.selectedPrefix;
  }

}
