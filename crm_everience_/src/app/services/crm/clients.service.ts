import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

export interface Client {
  id: number;
  company_name: string;
  address: string;
  municipality: string;
  zip_code: string;
  province: string;
  city: string;
  partita_iva: string;
  codice_fiscale: string;
  pec: string;
  sdi_code: string;
  billing_email: string;
  contact_name: string;
  //sales_owner: string; capire perchè è qui e se serve ancora
  contact_email: string;
  contact_phone: string;  
  contact_role: string;
  ateco: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/api/clients/';

  constructor(private http: HttpClient) {}

  // Get all Clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl + 'getClients');
  }

  //createClient
  createClient( client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl + 'newClient', client);
  }

  //getClientbyId
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(this.apiUrl + 'getClient/' + id);
  }

  //modifyClient
  modifyClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(this.apiUrl + 'modifyClient/' + id, client);
  }
  
}