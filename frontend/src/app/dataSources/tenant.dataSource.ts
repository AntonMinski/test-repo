import { CollectionViewer, DataSource } from '@angular/cdk/collections'
import { BehaviorSubject, catchError, finalize, Observable, of } from 'rxjs'
import { Tenant } from '../models/tenant.model'
import { TenantService } from '../_services/tenant.service';

export class TenantDataSource implements DataSource<Tenant> {

  private tenantsSubject = new BehaviorSubject<Tenant[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private tenantService: TenantService) {}

  connect(collectionViewer: CollectionViewer): Observable<Tenant[]> {
    return this.tenantsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.tenantsSubject.complete();
    this.loadingSubject.complete();
  }

  loadTenants(filter = '') {
    this.loadingSubject.next(true);

    this.tenantService.findTenants(filter).pipe(
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(tenants => this.tenantsSubject.next(tenants));
  }

  createTenant(tenant: Tenant) {
    this.loadingSubject.next(true);

    this.tenantService.createTenant(tenant).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadTenants('');
        this.loadingSubject.next(false);
      })
    ).subscribe(tenant => console.log('createdTenant', tenant));
  }


  findTenantById(id: string) {
    this.loadingSubject.next(true);
    this.tenantService.findTenantById(id).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false);
        this.loadTenants('');
      })
    ).subscribe(tenant => console.log('tenant:', tenant));
  }

  updateTenant(tenant: Tenant) {
    this.loadingSubject.next(true);
    this.tenantService.updateTenant(tenant).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadingSubject.next(false);
        this.loadTenants('');
      })
    ).subscribe(tenant => console.log('updated:', tenant));
  }

  deleteTenant(id: string) {
    this.loadingSubject.next(true)
    this.tenantService.deleteTenant(id).pipe(
      catchError(() => of([])),
      finalize(() => {
        this.loadTenants('')
        this.loadingSubject.next(false)
      }),
    ).subscribe(tenant => console.log('deleted', tenant))
  }

}
