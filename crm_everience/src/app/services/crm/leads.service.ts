import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lead {
  id: number;
  id_client: number;
  id_user: number;
  company_name: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  contact_role: string;
  notes: string;
  budget: number;
  archived: number;
  closure_type: string;
  activity_description: string;
  lead_data: Date;
  converted: number;
  silo: string;
  unique_speaking_code: string;
  last_activity_date: Date;
  owner: string;
}

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private apiUrl = 'http://localhost:3000/api/leads/';

  constructor(private http: HttpClient) {}

  // Get all leads
  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl + 'getLeads');
  }

  // Get lead by id
  getLeadById(id: number): Observable<Lead> {
    return this.http.get<Lead>(this.apiUrl + 'getLead/' + id);
  }

  // create a Lead
  createLead(lead: Lead): Observable<Lead> {
    return this.http.post<Lead>(this.apiUrl + 'newLead', lead);
  }

  // modify lead
  modifyLead(id: number, lead: Lead): Observable<Lead> {
    return this.http.put<Lead>(this.apiUrl + 'modifyLead/' + id, lead);
  }

  // archive a lead
  archiveLead(id: number): Observable<Lead> {
    return this.http.put<Lead>(this.apiUrl + 'archiveLead/' + id, {
      archived: 1,
    });
  }

  restoreLead(id: number): Observable<Lead> {
    return this.http.put<Lead>(this.apiUrl + 'restoreLead/' + id, {
      archived: 0,
    });
  }

  // convert a lead
  convertLead(id: number): Observable<Lead> {
    return this.http.put<Lead>(this.apiUrl + 'convertLead/' + id, {
      converted: 1,
    });
  }

  //archived leads
  getArchivedLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.apiUrl + 'getArchivedLeads');
  }
}
