import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalesContract {
    id: number;
    id_request: number;
    id_pnl: number;
    service_typology: string;
    stato: string;
    archived: number;
}

@Injectable({
    providedIn: 'root',
})
export class SalesContractsService {
    private apiUrl = 'http://localhost:3000/api/client_contracts/';

    constructor(private http: HttpClient) {}

    // get all sales contracts
    getSalesContracts(): Observable<SalesContract[]> {
        return this.http.get<SalesContract[]>(this.apiUrl + 'getContracts');
    }

    // get sales contract by id
    getSalesContractById(id: number): Observable<SalesContract> {
        return this.http.get<SalesContract>(this.apiUrl + 'getContract/' + id);
    }

    // new sales contract
    createSalesContract(contract: SalesContract): Observable<SalesContract> {
        return this.http.post<SalesContract>(this.apiUrl + 'newContract', contract);
    }

    // archive sales contract
    archiveSalesContract(id: number): Observable<SalesContract> {
        return this.http.put<SalesContract>(this.apiUrl + 'archiveContract/' + id, {archived: 1});
    }
}