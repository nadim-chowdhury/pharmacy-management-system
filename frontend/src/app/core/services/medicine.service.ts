import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Medicine } from '../models';
import { Observable } from 'rxjs';

export interface MedicineFilter {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedMedicines {
  data: Medicine[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class MedicineService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/medicines`;

  getMedicines(filter: MedicineFilter = {}): Observable<PaginatedMedicines> {
    let params = new HttpParams();
    if (filter.search) params = params.set('search', filter.search);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.limit) params = params.set('limit', filter.limit.toString());

    return this.http.get<PaginatedMedicines>(this.apiUrl, { params });
  }

  getMedicine(id: string): Observable<Medicine> {
    return this.http.get<Medicine>(`${this.apiUrl}/${id}`);
  }
}
