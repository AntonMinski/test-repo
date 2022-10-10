import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { from, map, Observable } from 'rxjs'
import { Tenant } from '../models/tenant.model'

const API_URL = 'http://localhost:3000/api/tenants/';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  constructor(private http: HttpClient) {
  }

  findTenants(filter = ''): Observable<Tenant[]> {
    return from(this.http.get(API_URL + filter)) as Observable<Tenant[]>;
  }

  createTenant(tenant: Tenant): Observable<Tenant> {
    return from(this.http.post(API_URL, tenant)) as Observable<Tenant>;
  }

  findTenantById(id: string): Observable<Tenant> {
    return from(this.http.get(API_URL + id)) as Observable<Tenant>;
  }

  updateTenant(tenant: Tenant): Observable<Tenant> {
    return from(this.http.put(API_URL + tenant._id, tenant)) as Observable<Tenant>;
  }

  deleteTenant(id: string): Observable<Tenant> {
    return from(this.http.delete(API_URL + id)) as Observable<Tenant>;
  }




}
