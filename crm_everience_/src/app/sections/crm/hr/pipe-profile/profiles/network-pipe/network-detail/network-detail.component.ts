import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  getEmployeeAge,
  getEmployeeInitials,
} from '../../../../../../../helpers/employee-helpers';

@Component({
  selector: 'app-network-detail',
  templateUrl: './network-detail.component.html',
  styleUrl: './network-detail.component.scss',
})
export class NetworkDetailComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}

  employees = [
    {
      //pipe profile
      id: 5,
      first_name: 'Simposio',
      last_name: 'Streso',
      birth_date: '18-04-1997',
      address: 'Via della Pata, 12',
      phone: '3519826403',
      email: 'simposio@gmail.com',
      job_title: 'Software Developer',
      seniority: 'Middle',
      has_vehicle: 1,
      notes: '',
      data: '12-06-2024',
      protected_category: 0,
      requested_ral: 20000,
      work_mode: 'On Site',
      //from skills
      soft_skills: 2,
      hard_skills: 3,
      english: 2,
      //from network
      switching_route: 2,
      firewall: 1,
      monitoring: 1,
      security: 3,
      cloud: 3,
    },
  ];
  employee: any = {};
  employeeAge: number = 0;
  slicedName: string = '';
  slicedSurname: string = '';
  randomImg: string = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.employee = this.employees[0];
    }
    console.log(this.employee);

    //getting age and initials from helpers file
    this.employeeAge = getEmployeeAge(this.employee.birth_date);

    const initials = getEmployeeInitials(
      this.employee.first_name,
      this.employee.last_name
    );
    this.slicedName = initials.firstInitial;
    this.slicedSurname = initials.lastInitial;
  }

  navigateBack() {
    this.router.navigate(['crm', 'pipe-profile']);
  }
}
