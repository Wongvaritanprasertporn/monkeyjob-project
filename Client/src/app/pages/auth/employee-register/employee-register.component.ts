import { Component, Renderer2, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { ValidationService } from 'src/app/services/validation.service';

// import { JwtHelperService } from '@auth0/angular-jwt';
// import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-employee-register',
  templateUrl: './employee-register.component.html',
  styleUrls: ['./employee-register.component.css']
})
export class EmployeeRegisterComponent implements OnInit {
  regex_char: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  regex_small_az: RegExp = /[a-z]/
  regex_cap_az: RegExp = /[A-Z]/
  regex_num: RegExp = /[0-9]/
  logo: File | any;
  form: any;
  loading: boolean | undefined;
  resumeFieldCounter: number | any;
  @ViewChild('resume') 
  private resume = {} as ElementRef;

  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private renderer: Renderer2,
  ) {
    if (this.auth.is_login) {
      this.navigate();
    }
  }

  ngOnInit() {
    this.resumeFieldCounter = 1;
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      mobile: ['', [Validators.required]],
      telephone: ['', []],
      dob: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      conPassword: ['', [Validators.required]],
      record: ['', [Validators.required]],
      introduce: ['', [Validators.required]]
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

  retrieveImage(user: any) {
    this.logo = user
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
    this.api.post_('auth/register/users', [this.form.value, this.logo])
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.auth.setLogin(response);
          //this.navigate();
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }, complete: () => {
          console.log("sucess");
        }
      });
  }

  google(data: any) {
    this.loading = true;
    this.api.post_('auth/google/users', {
      name: data.name,
      email: data.email
    })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.auth.setLogin(response);
          //this.navigate();
        }, error: (e) => {
          this.loading = false;
          // this.authService.signOut();
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  signInWithGoogle(): void {
    // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  navigate() {
    window.alert("Success")
    /*if (this.auth.user.user_type) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/info');
    }*/
  }
}
