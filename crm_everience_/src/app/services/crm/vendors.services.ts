import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vendor {
  id: number;
  id_pnl: number;
  vendor_name: string;
  province: string;
  service_category: string;
  standard_daily_cost: number;
  maggiorazione_non_feriale: string;
  cm_vendor: string;
}

@Injectable({
  providedIn: 'root',
})

export class VendorsService {
  private apiUrl = 'http://localhost:3000/api/vendors/';

  constructor(private http: HttpClient) {}

  //create new vendor

  postVendor(
              id: number,
              id_pnl: number,
              vendor_name: string,
              province: string,
              service_category: string,
              standard_daily_cost: number,
              maggiorazione_non_feriale: string,
              cm_vendor: string
            ): Observable<Vendor> {
              const vendor = {
                id,
                id_pnl,
                vendor_name,
                province,
                service_category,
                standard_daily_cost,
                maggiorazione_non_feriale,
                cm_vendor,
              };
              return this.http.post<Vendor>(this.apiUrl + 'newVendor', vendor);
  }

  //get vendor by ID
  getVendorById(id: number): Observable<Vendor> {
    return this.http.get<Vendor>(this.apiUrl + `getVendor/${id}`);
  }

  //get all vendors
  getVendors(): Observable<Vendor> {
    return this.http.get<Vendor>(this.apiUrl + 'getVendors');
  }

  //modify vendor
  modifyVendor(
              id: number,
              id_pnl: number,
              vendor_name: string,
              province: string,
              service_category: string,
              standard_daily_cost: number,
              maggiorazione_non_feriale: string,
              cm_vendor: string
            ): Observable<Vendor> {
              const vendor = {
                id,
                id_pnl,
                vendor_name,
                province,
                service_category,
                standard_daily_cost,
                maggiorazione_non_feriale,
                cm_vendor,
              };
              return this.http.put<Vendor>(this.apiUrl + `modifyVendor/${id}`, vendor);
  }
  //archive vendor
  archiveVendor(id: number): Observable<Vendor> {
    return this.http.put<Vendor>(this.apiUrl + `archiveVendor/${id}`, { archived: 1});
  }
}
