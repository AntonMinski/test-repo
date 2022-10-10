import { Component, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { AuthService } from '../../_services/auth.service'
import { TokenStorageService } from '../../_services/token.storage.service'
import { Router } from '@angular/router'

@Component({
   selector: 'login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
   loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
   })

   constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private tokenStorage: TokenStorageService,
      private router: Router
   ) {}

   ngOnInit() {}

   submit() {
      if (this.loginForm.invalid) {
         return
      }

      // TODO: connect to backend
      const form = this.loginForm.value

      this.authService.login(form.email as string, form.password as string).subscribe(
         async (data) => {
            this.tokenStorage.saveToken(data.token)
            this.tokenStorage.saveUser(data.user)

            await this.router.navigate(['/main'])
         },
         (err) => {
            console.log('authService error', err)
         }
      )
   }
}
