import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-system-pipe',
  templateUrl: './system-pipe.component.html',
  styleUrl: './system-pipe.component.scss',
})
export class SystemPipeComponent {
  constructor(private router: Router) {}
  displayedColumns: string[] = [
    'name',
    'phone',
    'email',
    'soft_skills',
    'hard_skills',
    'english',
    'job_title',
    'seniority',
  ];

  profiles = [
    {
      //pipe profile
      id: 5,
      first_name: 'Sys Tem',
      last_name: 'Pipe',
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
      //from system
      microsoft: 2,
      linux: 3,
      network: 1,
      storage: 2,
      vmware: 1,
    },
  ];

  dataSource = this.profiles;
  searchTerm: string = ''; // Stores user input

  openDetailedView(id: string) {
    this.router.navigate(['crm', 'pipe-profile', 'system', id]);
  }

  applyFilter() {
    if (this.searchTerm.length < 2) {
      this.dataSource = this.profiles; // Reset if less than 2 characters
      return;
    }

    this.dataSource = this.profiles.filter((profile) =>
      Object.values(profile).some((value) =>
        value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  openModal() {
    console.log('create');
    console.log(this.displayedColumns);
  }
}
