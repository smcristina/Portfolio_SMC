import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// export interface Employee {
//     id: number;
//     first_name: string;
//     last_name: string;
//     seniority: string;
//     residence_province: string;
//     client: string;
//     final_client: string;
//     cost: number;
//     availability: number;
//     start_date?: string;  // Opzionale perché potrebbe essere null con LEFT JOIN
//     end_date?: string;    // Opzionale perché potrebbe essere null con LEFT JOIN
// }

export interface Employee {
  id: number;
  id_pnl: number;
  id_client: number;
  first_name: string;
  last_name: string;
  // personal_email: string;
  phone: string;
  cost: number;
  birth_date: string;
  birth_place: string;
  codice_fiscale: string;
  years_of_experience: number;
  seniority: string;
  domicile_address: string;
  residence_address: string;
  domicile_province: string;
  residence_province: string;
  domicile_zip_code: string;
  residence_zip_code: string;
  client: string;
  notes: string;
  has_vehicle: number;
  has_driver_license: number;
  availability: number;
  cm_employee: string;
  final_client: string;
  communication_skills: number;
  autonomy: number;
  standing: number;

    skills?: string;              
    skills_valuation?: string;    
    area?: string;               
          
    start_date?: string;         
    end_date?: string;

}

export interface Skills{
    //id_pipe?: number;
    id_employee?: number;
    skills?: string;              
    skills_valuation?: string;    
    area?: string;                        
    
}


@Injectable({
  providedIn: 'root',
})
export class EmployeesService { 
    private apiUrl = 'http://localhost:3000/api/employee/';

  constructor(private http: HttpClient) {}

  //new employee

  newEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl + 'newEmployee', employee);
  }

  //add skills for emloyee

// postSkillsEployee(skills: Skills, id_employee: number): Observable<Skills>{
//         return this.http.post<Skills>(this.apiUrl + `addSkillsForEmployee/${id_employee}`, skills);
//                 }


postSkillsEployee(skills: any, id_employee: number): Observable<any>{
        return this.http.post(this.apiUrl + `addSkillsForEmployee/${id_employee}`, skills);
                }
//visualizza l'insieme di dipendenti
//getEmployees

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl + `getEmployees`);
  }

  //visualiza il singolo dipendente
  //getEmployee/:id

getOneEmployee(id: number): Observable<Employee>{
    return this.http.get<Employee>(this.apiUrl + `getEmployee/` + id);
}

/*modifica dett. dipendente    /modifyEmployee/:id*/


modifyEmployee(id: number, employee: Employee): Observable<Employee>{
    return this.http.put<Employee>(this.apiUrl + 'modifyEmployee/' + id, employee);
}

/*//modifica skills per emloyee     /modifySkills/forEmployee/:id*/
 modifyskillsEmployee(skills: Skills, id_employee: number):Observable<Skills>{
                return this.http.put<Skills>(this.apiUrl + `modifySkillsForEmployee/${id_employee}`, skills);
                    }
 
/*elmina dipendete /deleteEmployee/:id */
deleteEmployee(id: number) :Observable<Employee>{
//const deleteEmp = {id, id_pnl, id_client, first_name, last_name, personal_email, phone, cost, birth_date, birth_place, codice_fiscale, years_of_experience, seniority, domicile_address, residence_address, domicile_province, residence_province, domicile_zip_code, residence_zip_code, client, notes, has_vehicle, has_driver_license, availability, cm_employee, final_client, communication_skills, autonomy, standing};
return this.http.delete<Employee>(this.apiUrl + `deleteEmployee/${id}` );
}
/*deleteEmployee(id: number): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(this.apiUrl + `/deleteEmployee/${id}`);
}
*/


// getskills

getSkills(id_employee: number) : Observable<Skills[]>{
    return this.http.get<Skills[]>(this.apiUrl + `getSkills/${id_employee}`)
}




}
