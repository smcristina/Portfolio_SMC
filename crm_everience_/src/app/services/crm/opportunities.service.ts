import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Opportunity {
  id: number;
  id_lead: number;
  // lead_data: string;
  opportunity_data: string;
  partita_iva: string;
  silo: string;
  unique_speaking_code: string;
  // last_activity_date: string;
  owner: string;
  assigned_service_manager: string;
  company_name: string;
  // sales_owner: string;
  contact_email: string;
  contact_name: string;
  contact_phone: number;
  notes: string;
  budget: number;
  archived: number;
  // closure_type: string;
  activity_description: string;
  // converted_to_opportunity: string;
  converted: number;
  new_sale: number;
}

//Interfaccia per CREARE una nuova opportunity (solo campi richiesti)
export interface CreateOpportunityRequest {
  id_lead: number;
  assigned_service_manager: string;
  new_sale: number;
  archived?: number;
  converted?: number;
}

@Injectable({
  providedIn: 'root',
})
export class OpportunityService {
  private apiUrl = 'http://localhost:3000/api/opportunities/';

  constructor(private http: HttpClient) {}

  // Get all opportunities
  getOpportunities(): Observable<Opportunity[]> {
    return this.http.get<Opportunity[]>(this.apiUrl + 'getOpportunities');
  }

  // Get opportunity by id
  getOpportunityById(id: number): Observable<Opportunity> {
    console.log('Fetching opportunity with ID:', id);
    return this.http.get<Opportunity>(this.apiUrl + 'getOpportunity/' + id);
  }

  //create opportunity
  createOpportunity(
    opportunityData: CreateOpportunityRequest
  ): Observable<any> {
    return this.http.post<any>(this.apiUrl + `newOpportunity`, opportunityData);
  }

  //modify opportunity
  modifyOpportunity(
    id: number,
    opportunity: Opportunity
  ): Observable<Opportunity> {
    return this.http.put<Opportunity>(
      this.apiUrl + 'modifyOpportunity/' + id,
      opportunity
    );
  }

  // archive an opportunity
  archiveOpportunity(id: number): Observable<Opportunity> {
    return this.http.put<Opportunity>(
      this.apiUrl + 'archiveOpportunity/' + id,
      { archived: 1 }
    );
  }

  // convert opportunity
  convertOpportunity(id: number): Observable<Opportunity> {
    return this.http.put<Opportunity>(
      this.apiUrl + 'convertOpportunity/' + id,
      { converted: 1 }
    );
  }

  convertOpportunityToRequest(opportunityId: number, requestData: any) {
    return this.http.post(
      this.apiUrl + `convertOpportunity/${opportunityId}`,
      requestData
    );
  }
}
