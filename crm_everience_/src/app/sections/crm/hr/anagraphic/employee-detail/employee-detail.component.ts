import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeesService } from '../../../../../services/crm/employees.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss',
})
export class EmployeeDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private employeeService: EmployeesService
  ) {}

   employees: Employee[] = [];
   employee: any ;

   skills?: any = [];
  
  avatarsList = [
    '../../../../../../assets/avatars/cthulhu.png',
    '../../../../../../assets/avatars/monster.png',
    '../../../../../../assets/avatars/ghost.png',
    '../../../../../../assets/avatars/monster(1).png',
    '../../../../../../assets/avatars/monster(2).png',
    '../../../../../../assets/avatars/monster(3).png',
  ];

  employeeAge: number = 0;
  slicedName: string = '';
  slicedSurname: string = '';
  randomImg: string = '';
  id!: number;
  employeeEnglish: string = '';
  employeeLanguage: string = '';
  
  employeeSkillsList: {skills: string, skills_valuation: number}[] = [];

  dataSource = this.skills;
  searchLanguage: string[] =["afrikaans",
  "albanese",
  "amarico",
  "arabo",
  "armeno",
  "assamese",
  "azero",
  "basco",
  "bengalese",
  "birmano",
  "bosniaco",
  "bulgaro",
  "catalano",
  "ceco",
  "cinese (mandarino)",
  "coreano",
  "croato",
  "danese",
  "ebraico",
  "estone",
  "filippino",
  "finlandese",
  "francese",
  "georgiano",
  "greco",
  "gujarati",
  "hindi",
  "indonesiano",
  "islandese",
  "italiano",
  "giapponese",
  "kannada",
  "kazako",
  "khmer",
  "kirghiso",
  "lao",
  "lettone",
  "lituano",
  "macedone",
  "malayalam",
  "malese",
  "marathi",
  "moldavo",
  "mongolo",
  "nepalese",
  "norvegese",
  "olandese",
  "pashtu",
  "persiano",
  "polacco",
  "portoghese",
  "punjabi",
  "rumeno",
  "russo",
  "serbo",
  "singalese",
  "slovacco",
  "sloveno",
  "somalo",
  "spagnolo",
  "svedese",
  "swahili",
  "tagalog",
  "tamil",
  "tedesco",
  "telugu",
  "thai",
  "tibetano",
  "turco",
  "ucraino",
  "ungherese",
  "urdu",
  "uzbeco",
  "vietnamita",
  "zulu"
] ;

 ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    
    if (id) {
        this.id = id;
        this.employeeService.getOneEmployee(id).subscribe({
            next: (data) => {
                this.employee = data;
                console.log(this.employee);
                
                // Chiama queste funzioni SOLO dopo aver ricevuto i dati
                this.getEmployeeAge();
                this.getEmployeeInitials();
                this.getEnglishLevel();
                this.setSkillsList();
                this.getOtherLangueages();
            },  
            error: (error) => {
                console.error('Errore nel caricamento dipendente:', error);
            }
        });
    }
}

  getEmployeeAge() {
    let today = new Date();
    let birthDate = new Date(this.employee.birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.employeeAge = age;
  }

  getEmployeeInitials() {
    this.slicedName = this.employee.first_name.slice(0, 1);
    this.slicedSurname = this.employee.last_name.slice(0, 1);
  }

  navigateBack() {
    this.router.navigate(['crm', 'anagraphic']);
  }
 
  getEnglishLevel(): void {
    const skillWithEnglish = this.employee?.skills?.find((s: any) => s.skills === 'inglese');
    this.employeeEnglish = skillWithEnglish ? skillWithEnglish.skills_valuation : 'Non specificato';
  }

  getOtherLangueages(): void {
    if (!this.employee?.skills || !Array.isArray(this.searchLanguage)) {
    this.employeeLanguage = 'Non specificato';
    return;
  }

  const matchedLanguages = this.searchLanguage
    .map(lang => {
      const match = this.employee.skills.find((s: any) => s.skills === lang);
      return match ? `${lang}: ${match.skills_valuation}` : null;
    })
    .filter(Boolean); // rimuove i null

  this.employeeLanguage = matchedLanguages.length > 0
    ? matchedLanguages.join(', ')
    : 'Non specificato';
  }


    //recupero tutte le skills
 setSkillsList(): void {
  console.log('Raw skills from API:', this.employee?.skills);
 
  if (this.employee?.skills) {
    const filteredSkills = this.employee.skills.filter((s: any) => {
      const isValid = s.skills && 
                     s.skills !== null && 
                     s.skills.trim() !== '' &&
                     s.skills_valuation !== null &&
                     s.skills_valuation !== undefined &&
                     s.skills_valuation > 0;
      
      console.log(`Skill: "${s.skills}", Valuation: ${s.skills_valuation}, Valid: ${isValid}`);
      return isValid;
    });
    
    this.employeeSkillsList = filteredSkills.map((s: any) => ({
      skills: s.skills,
      skills_valuation: s.skills_valuation
    }));
    
    console.log('Final filtered skills:', this.employeeSkillsList);
  }
}

  //trovare valutazioni skills
  getSkillsValuation(skillName: string): number {
    const skill = this.employee?.skills?.find((s:any)=> 
    s.skills && s.skillstoLowerCase() === skillName.toLowerCase()
  );
  return skill ? skill.skill_valuation : 0;
  }
  

}
