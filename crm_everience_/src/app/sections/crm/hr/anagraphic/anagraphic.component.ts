import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../../../modals/confirmation-modal/confirmation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {
  Employee,
  EmployeesService,
} from '../../../../services/crm/employees.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateSkillsModalComponent } from '../../../../modals/create-skills-modal/create-skills-modal.component';
import { ModifyEmployeeModalComponent } from '../../../../modals/modify-employee-modal/modify-employee-modal.component';

@Component({
  selector: 'app-anagraphic',
  templateUrl: './anagraphic.component.html',
  styleUrl: './anagraphic.component.scss',
})
export class AnagraphicComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private employeeService: EmployeesService
  ) {}

  displayedColumns: string[] = [
    'name',
    'seniority',
    'residence_province',
    'client',
    'final_client',
    'start_date',
    'end_date',
    'cost',
    'availability',
    'edit',
    'skills',
    'delete',
  ];

  employees: Employee[] = [];

  dataSource: any = '';
  searchTerm: string = '';
  id?: number;
  isLoading: boolean = false;
  error: string | null = null;
  employee: any;
  selectedEmployee: any = null;
  editModalOpen: boolean = false;
  selectedEmployeeId!: number;
  skillsModalOpen: boolean = false;

  ngOnInit(): void {
    this.fetchEmployee();
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

  openDetailedView(id: string) {
    console.log(id);
    this.router.navigate(['crm', 'anagraphic', 'employee-detail', id]);
  }

  openModal() {
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }
  openSkillsModal(emp: any) {
    this.selectedEmployee = emp;
    this.skillsModalOpen = true;
    const modal = document.querySelector('.modal-skills-container');
    modal?.classList.add('active');
  }

  openEditModal(emp: any) {
    const modal = document.querySelector('.modal-edit-container');
    modal?.classList.add('active');

    if (emp) {
      this.employeeService.getOneEmployee(emp).subscribe({
        next: (data) => {
          this.employee = data;
          console.log(this.employee);
        },
      });
    }
  }

  handleNewClient(newEmployee: any) {
    this.employees.push(newEmployee);
  }

  createEmployee(newEmployee: any): void {
    this.employeeService.newEmployee(newEmployee).subscribe({
      next: (response) => {
        console.log('Employee created successfully', response);
        this.fetchEmployee();
      },
      error: (error) => {
        console.error('Error creating employee:', error);
      },
    });
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.employees; // Reset if less than 2 characters
      return;
    }

    this.dataSource = this.employees.filter((employee) =>
      Object.values(employee).some((value) =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  addSkillsToEmployee(emp: any) {
    this.selectedEmployee = emp;
    this.skillsModalOpen = true;
    // console.log(emp);
  }

  deleteEmployee(emp: any) {
    console.log(emp);

    if (emp) {
      this.employeeService.deleteEmployee(emp).subscribe({
        next: () => {
          console.log(this.employee);
          this.fetchEmployee();
        },
        error: (err) => {
          console.error("Errore durante l'eliminazione:", err);
        },
      });
    }
  }

  openConfirmDialog(emp: any) {
    const employee = this.employees.find((e: any) => e.id === emp);
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: {
        message:
          "Sei sicuro di voler cancellare l'utenza di " +
          employee?.first_name +
          ' ' +
          employee?.last_name +
          '?',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteEmployee(emp);
      } else {
        console.log('ID from route:', emp);
        console.log('Cancelled.');
      }
    });
    this.fetchEmployee();
  }

  onEmployeeUpdated(updatedEmployee: any) {
    // Aggiorna la lista locale
    this.fetchEmployee();
    // oppure aggiorna solo l'elemento specifico
    // const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
    // if (index !== -1) {
    //   this.employees[index] = updatedEmployee;
    // }
  }
}
