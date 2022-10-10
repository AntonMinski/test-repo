import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { BehaviorSubject, debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs'
import { Tenant } from 'src/app/models/tenant.model'
import { TenantDataSource } from '../../dataSources/tenant.dataSource'
import { TenantService } from '../../_services/tenant.service'
import { AuthService } from '../../_services/auth.service'
import { Router } from '@angular/router'
import { DataSource } from '@angular/cdk/collections'

export interface EditDialogMode {
   mode: 'add' | 'edit'
   tenant: Tenant
}

export interface ConfirmationDialogMode {
   text: string
}

@Component({
   selector: 'main',
   templateUrl: './main.component.html',
   styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
   email: string | null = ''
   tenants: Tenant[] = []

   searchText = ''
   filterMode: 'all' | 'debt' | 'clear' = 'all'
   filter: string = ''

   private _rows = new BehaviorSubject<Tenant[]>([])
   rows = this._rows.asObservable()

   dataSource: TenantDataSource
   displayedColumns: string[] = ['name', 'phone', 'address', 'debt', 'actions']

   @ViewChild('input') input: ElementRef

   constructor(
      public dialog: MatDialog,
      private tenantService: TenantService,
      private authService: AuthService,
      private router: Router
   ) {}

   ngOnInit() {
      this.email = localStorage.getItem('email')
      this.dataSource = new TenantDataSource(this.tenantService)
      this.dataSource.loadTenants()
   }

   ngAfterViewInit() {
      // server-side search
      this.input.nativeElement.value = ''

      fromEvent(this.input.nativeElement, 'keyup')
         .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => {
               this.applyFilter()
            })
         )
         .subscribe()
   }

   /* user actions */
   add() {
      this.dialog
         .open(EditDialog, { data: { mode: 'add' } })
         .afterClosed()
         .toPromise()
         .then((data) => {
            if (data) {
               this.addTenant(data)
            }
         })
   }

   edit(tenant: Tenant) {
      this.dialog
         .open(EditDialog, { data: { mode: 'edit', tenant: tenant } })
         .afterClosed()
         .toPromise()
         .then((data) => {
            if (data) {
               data._id = tenant._id
               this.updateTenant(data)
            }
         })
   }

   delete(id: string) {
      this.dialog
         .open(ConfirmationDialog)
         .afterClosed()
         .toPromise()
         .then((data) => {
            if (data.delete) {
               this.deleteTenant(id)
            }
         })
   }

   /* auxiliaries */
   applyFilter() {
      this.filter = ''
      this.filter += '?debt=' + this.filterMode
      if (this.searchText) {
         this.filter += `&search=${this.searchText}`
      }
      this.getTenants(this.filter)
   }

   /* _services */
   getTenants(filter = '') {
      // TODO: connect to backend
      this.dataSource.loadTenants(filter)
   }

   addTenant(tenant: Tenant) {
      // TODO: connect to backend
      this.dataSource.createTenant(tenant)
   }

   updateTenant(tenant: Tenant) {
      // TODO: connect to backend
      this.dataSource.updateTenant(tenant)
   }

   deleteTenant(id: string) {
      // TODO: connect to backend
      this.dataSource.deleteTenant(id)
   }

   async logout() {
      // TODO: connect to backend
      this.authService.logout()
      localStorage.removeItem('email')
      await this.router.navigate(['/login'])
   }
}

@Component({
   selector: 'edit-dialog',
   templateUrl: '../dialogs/edit.dialog.html',
   styleUrls: ['../dialogs/edit.dialog.scss'],
})
export class EditDialog {
   name = ''
   editForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      debt: 0,
   })

   constructor(
      public formBuilder: FormBuilder,
      public editDialog: MatDialogRef<EditDialog>,
      @Inject(MAT_DIALOG_DATA) public data: EditDialogMode
   ) {
      editDialog.afterOpened().subscribe(() => {
         if (data.mode == 'edit') {
            this.name = data.tenant.name
            this.editForm = this.formBuilder.group({
               name: [data.tenant.name, [Validators.required]],
               phone: [data.tenant.phone, [Validators.required]],
               address: [data.tenant.address, [Validators.required]],
               debt: [data.tenant.debt],
            })
         }
      })
   }

   save() {
      if (this.editForm.invalid) {
         return
      }

      this.editDialog.close({
         name: this.editForm.controls.name.value,
         phone: this.editForm.controls.phone.value,
         address: this.editForm.controls.address.value,
         debt: this.editForm.controls.debt.value,
      })
   }

   cancel() {
      this.editDialog.close()
   }
}

@Component({
   selector: 'confirmation-dialog',
   templateUrl: '../dialogs/confirmation.dialog.html',
   styleUrls: ['../dialogs/confirmation.dialog.scss'],
})
export class ConfirmationDialog {
   constructor(
      public formBuilder: FormBuilder,
      public confirmationDialog: MatDialogRef<ConfirmationDialog>,
      @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogMode
   ) {}

   delete() {
      this.confirmationDialog.close({
         delete: true,
      })
   }

   cancel() {
      this.confirmationDialog.close({
         delete: false,
      })
   }
}
