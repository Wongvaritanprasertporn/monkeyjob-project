import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
// import { SocialAuthService, GoogleLoginProvider, SocialUser } from "angularx-social-login";
import { ValidationService } from 'src/app/services/validation.service';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    // private authService: SocialAuthService,
    // private jwtHelper: JwtHelperService
  ) {
    if (this.auth.is_login) {
      this.navigate();
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // this.authService.authState.subscribe((user) => {
    //   if (user && !this.loading) {
    //     this.form.value.email = user.email;
    //     if (user.email) {
    //       this.google(user)
    //     } else {
    //       this.fun.presentAlertError("No email");
    //     }
    //   }
    // });

  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.register();
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  register() {
    this.loading = true;
    this.api.post_('auth/register/users', this.form.value)
      .subscribe({next : (response) => {
        this.loading = false;
        this.auth.setLogin(response);
        this.navigate();
      }, error : (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }, complete: () => {
        console.log("sucess");
    }});
  }

  google(data: any) {
    this.loading = true;
    this.api.post_('auth/google/users', {
      name: data.name,
      email: data.email
    })
      .subscribe({next : (response) => {
        this.loading = false;
        this.auth.setLogin(response);
        this.navigate();
      }, error : (e) => {
        this.loading = false;
        // this.authService.signOut();
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  signInWithGoogle(): void {
    // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  navigate() {
    if (this.auth.user.user_type) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/info');
    }
  }
}