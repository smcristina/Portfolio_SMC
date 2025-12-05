import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PNL,
  Request,
  RequestService,
} from '../../../../../services/crm/requests.service';
import { UserService } from '../../../../../services/crm/users.service';
import {
  Employee,
  EmployeesService,
} from '../../../../../services/crm/employees.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.scss',
})
export class RequestDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private userService: UserService,
    private employeeService: EmployeesService
  ) {}

  request: any = {};
  editing = false;
  backFill: string = '';
  serviceManagerList: any[] = [];
  selectedManager: string = '';
  requestId: number = 0;
  pnl: PNL | null = null;
  resource: any;

  ngOnInit() {
    this.fetchServiceManagers();
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : null;

      if (id) {
        this.getRequest(id);
        this.requestId = id;
      }
    });
  }

  getRequest(id: any): void {
    this.requestService.getRequestById(id).subscribe({
      next: (data: any) => {
        this.request = data;
        this.backFill = this.request.back_fill == 0 ? 'No' : 'Si';
        this.selectedManager = data.opportunity_assigned_service_manager || '';

        if (this.request.id_pnl) {
          this.requestService.getPNLById(this.request.id).subscribe({
            next: (pnlData: PNL) => {
              this.pnl = pnlData;
              console.log('Fetched PNL:', this.pnl);

              if (this.pnl.resource) {
                // getOneEmployee returns a single Employee, not an array
                this.employeeService
                  .getOneEmployee(Number(this.pnl.resource))
                  .subscribe({
                    next: (employeeData: Employee) => {
                      this.resource = employeeData;
                      console.log('Employee:', this.resource);
                    },
                    error: (err: any) => {
                      console.error('Error fetching employee:', err);
                    },
                  });
              }
            },
            error: (err) => console.error('Error fetching PNL:', err),
          });
        }
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  fetchServiceManagers(): void {
    this.userService.getServiceManagers().subscribe({
      next: (data: any[]) => {
        this.serviceManagerList = data;
        console.log('Service Managers loaded:', this.serviceManagerList);
      },
      error: (err: any) => {
        console.error('Error fetching service managers:', err);
      },
    });
  }

  onManagerChange(event: Event) {
    this.selectedManager = (event.target as HTMLSelectElement).value;
    this.request.opportunity_assigned_service_manager = this.selectedManager;
  }

  navigationBack() {
    this.router.navigate(['crm', 'requests']);
  }

  editRequest() {
    this.editing = !this.editing;
  }

  saveChanges() {
    this.request.assigned_service_manager = this.selectedManager;
    //this.request.activity_description = this.selectedActivity;
    //this.request.id_client = this.selectedClient;
    console.log('--->', this.request);

    this.requestService
      .modifyRequest(this.requestId, this.request)
      .subscribe(() => {
        this.editing = false;
        this.router.navigate(['crm', 'requests']);
      });
  }

  addPNL(id: string) {
    this.router.navigate(['crm', 'pnl', id]);
  }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  //getters and setters for date formats
  get formattedDate(): string {
    return this.formatDateForInput(this.request.request_date);
  }
  set formattedDate(value: string) {
    this.request.request_date = value;
  }

  get formattedStartDate(): string {
    return this.formatDateForInput(this.request.start_date);
  }
  set formattedStartDate(value: string) {
    this.request.start_date = value;
  }

  get formattedEndDate(): string {
    return this.formatDateForInput(this.request.end_date);
  }
  set formattedEndDate(value: string) {
    this.request.end_date = value;
  }

  openModal() {
    console.log(this.request.id, this.request);
    const modal = document.querySelector('.modal-container');
    modal?.classList.add('active');
  }

  convertRequest() {
    if (!this.request.pnl) {
      //show pnl modal
    } else {
      //convert the fucking request
    }
  }
}
