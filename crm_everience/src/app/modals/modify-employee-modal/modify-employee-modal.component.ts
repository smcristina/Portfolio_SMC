import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeesService} from '../../services/crm/employees.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modify-employee-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modify-employee-modal.component.html',
  styleUrl: './modify-employee-modal.component.scss'
})
export class ModifyEmployeeModalComponent implements OnInit {
  @Input() employee: any;
  @Output() employeeUpdated = new EventEmitter<any>();
  editing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeesService
  ){}

  // employee: any;
  dataSource: any = '';
  isLoading: boolean = false;
  error: string | null = null;
  parsedData: string = '';
  selectedSeniority: string = '';
  selectedCommunication: string = '';
  selectedStanding: string = '';
  selectedAutonomy: string = '';
  employees: Employee[] = [];

  seniorityList = [
    'Junior',
    'Middle',
    'Senior'
  ];

  ngOnInit(){
    this.fetchEmployee();
  }

  editEmployee(){
    this.editing = !this.editing;
  }

  saveChanges(id: number){
    this.initializeSelectedValues();
    console.log(this.employee);

    this.employeeService.modifyEmployee(id, this.employee).subscribe({
      next: (res: any) => {
      console.log('Salvato con successo', res);
      this.employeeUpdated.emit(this.employee);
      this.closeModal();
    },
    error: (error: any) => {
      console.error('Errore nel salvataggio', error);
    }
    });
  }

  closeModal(){
    const modal = document.querySelector('.modal-edit-container');
    modal?.classList.remove('active');
  }


  onSeniorityChange(event: Event){
    this.selectedSeniority = (event.target as HTMLSelectElement).value;
    this.employee.seniority = this.selectedSeniority;
  }

  onCommunicationChange(event: Event){
    this.selectedCommunication = (event.target as HTMLSelectElement).value;
    this.employee.communication_skills = this.selectedCommunication;
  }

  onAutonomyChange(event: Event){
    this.selectedAutonomy = (event.target as HTMLSelectElement).value;
    this.employee.autonomy = this.selectedAutonomy;
  }

  onStandingChange(event: Event){
    this.selectedStanding = (event.target as HTMLSelectElement).value;
    this.employee.standing = this.selectedStanding;
  }


  initializeSelectedValues(){
    if(this.employee.seniority){
      this.selectedSeniority = this.employee.seniority
    }
    if(this.employee.communication_skills){
      this.selectedCommunication = this.employee.communication_skills
    }
    if(this.employee.autonomy){
      this.selectedAutonomy = this.employee.autonomy
    }
    if(this.employee.standing){
      this.selectedStanding = this.employee.standing
    }
  }


  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return ''; // Handle invalid date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get formattedDate(): string {
    return this.formatDateForInput(this.employee.birth_date);
  }
  set formattedDate(value: string) {
    this.employee.birth_date = value;
  }


  fetchEmployee(): void {
    this.isLoading = true;
    this.error = null;

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data || [];
        this.isLoading = false;
        this.dataSource = this.employees;
        
        if (this.employees.length === 0) {
          console.warn('No employees in response');
        }
      },
      error: (err) => {
        console.error('HTTP Error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        this.error = 'Failed to load employees';
        this.isLoading = false;
      },
    });
  }

}