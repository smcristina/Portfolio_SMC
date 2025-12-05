import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-create-client-modal',
  standalone: true,
  imports: [FormsModule, BrowserModule, BrowserAnimationsModule],
  templateUrl: './create-client-modal.component.html',
  styleUrl: './create-client-modal.component.scss',
})
export class CreateClientModalComponent {
  @Output() clientCreated = new EventEmitter<any>();

  newClient = {
    company_name: '',
    address: '',
    municipality: '',
    zip_code: '',
    province: '',
    city: '',
    partita_iva: '',
    codice_fiscale: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    pec: '',
    sdi_code: '',
    billing_email: '',
    contact_role: '',
    ateco: '',
  };

  //clientsList = ['Galileo', 'Alten'];
  provincesList = [
    'Agrigento',
    'Alessandria',
    'Ancona',
    'Aosta',
    'Arezzo',
    'Ascoli Piceno',
    'Asti',
    'Avellino',
    'Bari',
    'Barletta-Andria-Trani',
    'Belluno',
    'Benevento',
    'Bergamo',
    'Biella',
    'Bologna',
    'Bolzano',
    'Brescia',
    'Brindisi',
    'Cagliari',
    'Caltanissetta',
    'Campobasso',
    'Carbonia-Iglesias',
    'Caserta',
    'Catania',
    'Catanzaro',
    'Chieti',
    'Como',
    'Cosenza',
    'Cremona',
    'Crotone',
    'Cuneo',
    'Enna',
    'Fermo',
    'Ferrara',
    'Firenze',
    'Foggia',
    'Forlì-Cesena',
    'Frosinone',
    'Genova',
    'Gorizia',
    'Grosseto',
    'Imperia',
    'Isernia',
    'La Spezia',
    "L'Aquila",
    'Latina',
    'Lecce',
    'Lecco',
    'Livorno',
    'Lodi',
    'Lucca',
    'Macerata',
    'Mantova',
    'Massa-Carrara',
    'Matera',
    'Messina',
    'Milano',
    'Modena',
    'Monza e della Brianza',
    'Napoli',
    'Novara',
    'Nuoro',
    'Oristano',
    'Padova',
    'Palermo',
    'Parma',
    'Pavia',
    'Perugia',
    'Pesaro e Urbino',
    'Pescara',
    'Piacenza',
    'Pisa',
    'Pistoia',
    'Pordenone',
    'Potenza',
    'Prato',
    'Ragusa',
    'Ravenna',
    'Reggio Calabria',
    'Reggio Emilia',
    'Rieti',
    'Rimini',
    'Roma',
    'Rovigo',
    'Salerno',
    'Sassari',
    'Savona',
    'Siena',
    'Siracusa',
    'Sondrio',
    'Sud Sardegna',
    'Taranto',
    'Teramo',
    'Terni',
    'Torino',
    'Trapani',
    'Trento',
    'Treviso',
    'Trieste',
    'Udine',
    'Varese',
    'Venezia',
    'Verbano-Cusio-Ossola',
    'Vercelli',
    'Verona',
    'Vibo Valentia',
    'Vicenza',
    'Viterbo',
  ];
  // selectedClient: string = '';
  selectedProvince: string = '';


  missingCompanyName: boolean = false;
  missingContactEmail: boolean = false;
  

  createClient() {
    // if (this.newClient.company_name && this.newClient.contact_email) {
    //   this.clientCreated.emit(this.newClient);
    //   this.closeModal();
    //   console.log(this.newClient);
    // } else {
    // }
    this.missingCompanyName = false;
    this.missingContactEmail = false;

    let hasErrors = false;

    if (!this.newClient.company_name) {
      this.missingCompanyName = true;
      hasErrors = true;
    }

    if (!this.newClient.contact_email) {
      this.missingContactEmail = true;
      hasErrors = true;
    }

    if (!hasErrors) {
      this.clientCreated.emit(this.newClient);
      this.closeModal();
    } else {
      console.log(' Errori di validazione:');
    }
  }

  closeModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.remove('active');
    this.resetform();
    this.missingCompanyName = false;
    this.missingContactEmail = false;
  }

  resetform(){
    this.newClient = {
      company_name: '',
      address: '',
      municipality: '',
      zip_code: '',
      province: '',
      city: '',
      partita_iva: '',
      codice_fiscale: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      pec: '',
      sdi_code: '',
      billing_email: '',
      contact_role: '',
      ateco: '',
    };
    this.selectedProvince = '';
  }

  onProvinceChange(event: Event) {
    this.selectedProvince = (event.target as HTMLSelectElement).value;
    this.newClient.province = this.selectedProvince;
  }
  
}
