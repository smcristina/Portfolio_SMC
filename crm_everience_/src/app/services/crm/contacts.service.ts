import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contact {
  id: number;
  //li abbbiamo tolti perche' non sono piu' necessari dal DB
  //id_lead: number;
  //id_client: number;
  company_name: string;
  contact_name: string;
  contact_mail: string;
  contact_phone: string;
  contact_role: string;
  contact_source: string;
  archived: number;
}

export interface ContactName {
  id: number;
  constact_name: string;
  company_name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  // deleteContact(id: any) {
  //   throw new Error('Method not implemented.');
  // }
  private apiUrl = 'http://localhost:3000/api/contacts/';

  constructor(private http: HttpClient) {}

  // Get all contacts
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl + 'getContacts');
  }

  // Get contact by ID
  getContactById(id: number): Observable<Contact>{
    return this.http.get<Contact>(this.apiUrl + `getContact/${id}`);
  }

  // New contact
  postContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl + 'newContact', contact);
  }


  //modify contact
  putContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(this.apiUrl + `modifyContact/${id}`, contact);
  } 
  
// archive contact
/***************************************************************/
/*DA RIVEDERE NON SONO SICURA*/ 
// archivedContact(id: number): Observable<Contact> {
//   return this.http.put<Contact>(this.apiUrl + `archivedContact/${id}`, { archived: '1' });
// }

/*CHAT DICHE CHE è PIU OCRRETTO:*/
archivedContact(id: number): Observable<any> {
  return this.http.put<any>(this.apiUrl + `archivedContact/${id}`, {});
}

 //archived leads
  getArchivedContact(): Observable<Contact[]>{
      return this.http.get<Contact[]>(this.apiUrl + 'getArchivedContact');
  }


  //get contact name
  getContactName(companyName: string): Observable<ContactName[]> {
    return this.http.get<ContactName[]>(this.apiUrl + 'getContactsName', {
      params: {company_name: companyName}
    });
  }
  
}
