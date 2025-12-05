import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import {
  getEmployeeAge,
  getEmployeeInitials,
} from '../../../../../../../helpers/employee-helpers';

@Component({
  selector: 'app-developer-detail',
  templateUrl: './developer-detail.component.html',
  styleUrl: './developer-detail.component.scss',
})
export class DeveloperDetailComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}

  employees = [
    {
      //pipe profile
      id: 7,
      first_name: 'Gerardo',
      last_name: 'El Grillo',
      birth_date: '1995-08-03T00:00:00.000Z',
      address: 'Via della Palta, 56',
      phone: '3519826403',
      email: 'simposio@gmail.com',
      job_title: 'Software Developer',
      seniority: 'Junior',
      has_vehicle: 1,
      notes: 'sahdgshadg hasgdags jdhgshjd agsj dghsj ghjd gsyuewudhjsghj',
      data: '12-06-2024',
      protected_category: 0,
      requested_ral: 17000,
      work_mode: 'Ibrido',
      //from skills
      soft_skills: 2,
      hard_skills: 3,
      english: 1,
      //from help desk table
      backend_level: 2,
      frontend_level: 3,
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
