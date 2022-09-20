import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  form: any;
  jobs: any;
  loading: boolean | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public _location: Location,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: [''],
      city: [''],
    });

    let title = this.activatedRoute.snapshot.queryParams["title"] ? this.activatedRoute.snapshot.queryParams["title"] : "";
    let city = this.activatedRoute.snapshot.queryParams["city"] ? this.activatedRoute.snapshot.queryParams["city"] : "";

    this.search(title, city);
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.search(this.form.value.title, this.form.value.zip_code);
    } else {
      for (let i in this.form.controls) this.form.controls[i].markAsTouched();
    }
  }

  search(title: any, city: any) {
    this.loading = true;
    this.api
      .get_(
        `auth/search/?title=${title}&city=${city}`
      )
      .subscribe({
        next:
          (response: any) => {
            this.loading = false;
            this.jobs = response;
          },
        error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(
            e.error.message ||
            e.error.sqlMessage ||
            'Something went wrong. Try again.'
          );
        }
      });
  }

  backClicked() {
    this._location.back();
  }
}
