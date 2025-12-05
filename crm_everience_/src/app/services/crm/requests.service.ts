// requests.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Request {
  id: number;
  id_opportunity: number;
  id_pnl: number;
  request_code?: string;
  request_date: Date;
  contract_typology?: string;
  assigned_service_manager: string;
  assigned_recruiter: string;
  address?: string;
  clock_in?: string;
  clock_out?: string;
  start_date?: Date;
  end_date?: Date;
  final_client: string;
  resources_quantity?: number;
  week_working_days?: string;
  service_duration?: string;
  back_fill?: boolean;
  description?: string;
  status: string;
  company_name: string;
  partita_iva: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  budget?: number;
  has_pnl?: number;
  owner?: string;
  archived?: boolean;
}

export interface Resource {
  resource: string | number;
  quantity_days: number | null;
  unit_cost: number | null;
  total_cost: number | null;
  gross_margin?: number | null;
}

export interface Tool {
  tool: string;
  daily_cost: number;
  yearly_cost: number;
}

export interface PNL {
  // legacy single-resource fields (kept for bindings)
  resource?: string | number;
  work_mode: string;
  quantity_days?: number | null;
  unit_cost?: number | null;
  // aggregated fields
  total_cost?: number | null;
  total_service_cost?: number | null;
  markup?: number | null;
  unit_price?: number | null;
  total_price?: number | null;
  total_service_price?: number | null;
  margin_percentage?: number | null;
  total_gross_margin?: number | null;
  service_margin_percentage?: number | null;
  service_gross_margin?: number | null;

  id_request: number;
  tools?: Tool[];
  //array for backfill
  resources?: Resource[];
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = 'http://localhost:3000/api/requests/';

  constructor(private http: HttpClient) {}

  getRequests(): Observable<Request[]> {
    return this.http.get<Request[]>(this.apiUrl + 'getRequests');
  }

  getRequestById(id: number): Observable<Request> {
    return this.http.get<Request>(this.apiUrl + 'getRequest/' + id);
  }

  modifyRequest(id: number, request: Request): Observable<Request> {
    return this.http.put<Request>(this.apiUrl + 'modifyRequest/' + id, request);
  }

  createPNL(pnl: PNL): Observable<{ message: string; pnl_id: number }> {
    return this.http.post<{ message: string; pnl_id: number }>(
      `${this.apiUrl}createPNL`,
      pnl
    );
  }

  convertRequest(id: number, service_typology: string): Observable<any> {
    return this.http.put(this.apiUrl + 'convertRequest/' + id, {
      service_typology,
    });
  }

  changeHasPNLField(id_request: number) {
    return this.http.put(
      this.apiUrl + 'requests/' + id_request + '/changeHasPNLField',
      {}
    );
  }

  getPNLById(id: number): Observable<PNL> {
    return this.http.get<PNL>(this.apiUrl + 'getPNL/' + id);
  }
}
