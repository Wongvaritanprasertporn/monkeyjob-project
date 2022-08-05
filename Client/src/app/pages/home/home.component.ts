import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  constructor(
    public auth: AuthService,
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private router: Router,
    public _location: Location
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: [''],
      zip_code: [''],
    });
  }

  submit() {
    this.router.navigate(['/search'], {
      queryParams: {
        title: this.form.value.title,
        zip_code: this.form.value.zip_code,
      },
    });
  }
}
