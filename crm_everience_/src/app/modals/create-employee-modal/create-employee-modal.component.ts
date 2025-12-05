import { Component,EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Employee, EmployeesService } from '../../services/crm/employees.service';

@Component({
  selector: 'app-create-employee-modal',
  standalone: true,
  imports: [FormsModule, BrowserModule, BrowserAnimationsModule],
  templateUrl: './create-employee-modal.component.html',
  styleUrl: './create-employee-modal.component.scss',
})

export class CreateEmployeeModalComponent {
  @Output() employeeCreated = new EventEmitter<any>();

  newEmployee = {
    id_pnl: null,
    id_client: null,
    first_name: '',
    last_name: '',
    personal_email: '',
    phone: '',
    cost: null,
    birth_date: '',
    birth_place: '',
    codice_fiscale: '',
    years_of_experience: null,
    seniority: '',
    domicile_address: '',
    residence_address: '',
    domicile_province: '',
    residence_province: '',
    domicile_zip_code: '',
    residence_zip_code: '',
    client: '',
    notes: '',
    has_vehicle: 0,
    has_driver_license: 0,
    availability: 0,
    cm_employee: '',
    final_client: '',
    communication_skills: 5,
    autonomy: 5,
    standing: 5,
  };

  selectedSeniority: string = '';
  selectedCommunication: string = '';
  selectedAutonomy: string = '';
  selectedStanding: string = '';

  seniorityList = [
    'Junior',
    'Middle',
    'Senior'
  ];

  missingName: boolean = false;
  missingLastName: boolean = false;
  missingEmailorPhone: boolean = false;
  missingCost: boolean = false;
  missingBirthDate: boolean = false;
  missingCodiceFiscale: boolean = false;
  missingSeniority: boolean = false;
  missingDomicileAddress: boolean = false;
  missingResidenceAddress: boolean = false;
  missingCommunication: boolean = false;
  missingAutonomy: boolean = false;
  missingStanding: boolean = false; 

  createEmployee() {
    // console.log('sgd');
    this.missingName = false;
    this.missingLastName = false;
    this.missingEmailorPhone = false;
    this.missingCost = false;
    this.missingBirthDate = false;
    this.missingCodiceFiscale = false;
    this.missingSeniority = false;
    this.missingDomicileAddress = false;
    this.missingResidenceAddress = false;
    this.missingCommunication = false;
    this.missingAutonomy = false;
    this.missingStanding = false;

    let hasErrors = false;

    if(!this.newEmployee.first_name){
      this.missingName = true;
      hasErrors = true;
    }

    if(!this.newEmployee.last_name){
      this.missingLastName = true;
      hasErrors = true;
    }

    if(!this.newEmployee.personal_email && !this.newEmployee.phone){
      this.missingEmailorPhone = true;
      hasErrors = true;
    }

    if(!this.newEmployee.cost){
      this.missingCost = true;
      hasErrors = true;
    }

    if(!this.newEmployee.birth_date){
      this.missingBirthDate = true;
      hasErrors = true;
    }

    if(!this.newEmployee.codice_fiscale){
      this.missingCodiceFiscale = true;
      hasErrors = true;
    }

    if(!this.newEmployee.seniority){
      this.missingSeniority = true;
      hasErrors = true;
    }

    if(!this.newEmployee.domicile_address){
      this.missingDomicileAddress = true;
      hasErrors = true;
    }

    if(!this.newEmployee.residence_address){
      this.missingResidenceAddress = true;
      hasErrors = true;
    }
    if(this.newEmployee.communication_skills && this.newEmployee.communication_skills == 5){
      this.missingCommunication = true;
      hasErrors = true;
    }
    if(this.newEmployee.autonomy && this.newEmployee.autonomy == 5){
      this.missingAutonomy = true;
      hasErrors = true;
    }
    if(this.newEmployee.standing && this.newEmployee.standing == 5){
      this.missingStanding = true;
      hasErrors = true;
    }

    if(!hasErrors){
      this.employeeCreated.emit(this.newEmployee);
      this.closeModal();
    } else {
      console.log(' Errori di validazione:');
      console.log(this.newEmployee.communication_skills)
    }
  }


  closeModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.remove('active');
    this.resetform();
    this.missingName = false;
    this.missingLastName = false;
    this.missingEmailorPhone = false;
    this.missingCost = false;
    this.missingBirthDate = false;
    this.missingCodiceFiscale = false;
    this.missingSeniority = false;
    this.missingDomicileAddress = false;
    this.missingResidenceAddress = false;
    this.missingCommunication = false;
    this.missingAutonomy = false;
    this.missingStanding = false;
  }

  resetform() {
    this.newEmployee = {
      id_pnl: null,
      id_client: null,
      first_name: '',
      last_name: '', 
      personal_email: '',
      phone: '',
      cost: null,
      birth_date: '',
      birth_place: '',
      codice_fiscale: '',
      years_of_experience: null,
      seniority: '', 
      domicile_address: '',
      residence_address: '',
      domicile_province: '',
      residence_province: '',
      domicile_zip_code: '',
      residence_zip_code: '',
      client: '',
      notes: '',
      has_vehicle: 0,
      has_driver_license: 0,
      availability: 0,
      cm_employee: '', 
      final_client: '',
      communication_skills: 5,
      autonomy: 5,
      standing: 5,
    };
    this.selectedSeniority = '';
    this.selectedCommunication = '';
    this.selectedAutonomy = '';
    this.selectedStanding = '';
  }

  onSeniorityChange(event: Event){
    this.selectedSeniority = (event.target as HTMLSelectElement).value;
    this.newEmployee.seniority = this.selectedSeniority;
  }

  onCommunicationChange(event: Event){
    this.selectedCommunication = (event.target as HTMLSelectElement).value;
    this.newEmployee.communication_skills = Number(this.selectedCommunication);
  }

  onAutonomyChange(event: Event){
    this.selectedAutonomy = (event.target as HTMLSelectElement).value;
    this.newEmployee.autonomy = Number(this.selectedAutonomy);
  }

  onStandingChange(event: Event){
    this.selectedStanding = (event.target as HTMLSelectElement).value;
    this.newEmployee.standing = Number(this.selectedStanding);
  }

}
