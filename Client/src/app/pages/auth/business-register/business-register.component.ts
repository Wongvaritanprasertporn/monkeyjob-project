import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileUploadService } from 'src/app/services/file-upload.service';

// import { JwtHelperService } from '@auth0/angular-jwt';
// import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-business-register',
  templateUrl: './business-register.component.html',
  styleUrls: ['./business-register.component.css']
})
export class BusinessRegisterComponent implements OnInit {
  // File Upload
  logo: File | any;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  regex_char: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
  regex_small_az: RegExp = /[a-z]/
  regex_cap_az: RegExp = /[A-Z]/
  regex_num: RegExp = /[0-9]/
  user_type = 1
  form: any;
  loading: boolean | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private uploadService: FileUploadService
  ) {
    if (this.auth.is_login) {
      this.navigate();
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      business: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      address: ['', [Validators.required]],
      tel: ['', [Validators.required, Validators.minLength(9)]],
      description: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      conPassword: ['', [Validators.required, Validators.minLength(8)]]
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
    this.upload();
    console.log(this.logo.name)
    this.api.post_('auth/register/users', { data: this.form.value, logo: this.logo.name, user_type: this.user_type })
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.upload()
          this.auth.setLogin(response);
          this.navigate();
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }, complete: () => {
          console.log("sucess");
        }
      });
  }

  upload(): void {
    this.progress = 0;
      const file: File | null = this.logo;
      if (file) {
        this.logo = file;
        this.uploadService.upload(this.logo).subscribe({
          next:
            (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.progress = Math.round(100 * event.loaded / event.total);
              } else if (event instanceof HttpResponse) {
                this.message = event.body.message;
                // this.fileInfos = this.uploadService.getFiles();
              }
            },
          error: (error: any) => {
            console.log(error);
            this.progress = 0;
            if (error.error && error.error.message) {
              this.message = error.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
          }
        });
      }
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
          this.navigate();
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
    if (this.auth.user.user_type) {
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/info');
    }
  }
}