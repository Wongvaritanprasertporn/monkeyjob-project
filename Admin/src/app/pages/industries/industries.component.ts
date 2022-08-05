import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.css'],
})
export class IndustriesComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  industries: any;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
    });

    this.getIndustries();
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.saveIndustry();
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  saveIndustry() {
    this.loading = true;
    this.api.post('crud/industries', this.form.value).subscribe(
      (response: any) => {
        this.loading = false;
        this.getIndustries();
      },
      (error) => {
        this.loading = false;
        this.fun.presentAlertError(
          error.error.message ||
            error.error.sqlMessage ||
            'Something went wrong. Try again.'
        );
      }
    );
  }

  getIndustries() {
    this.loading = true;
    this.api.get('crud/industries').subscribe(
      (response: any) => {
        this.loading = false;
        this.industries = response;
      },
      (error) => {
        this.loading = false;
        this.fun.presentAlertError(
          error.error.message ||
            error.error.sqlMessage ||
            'Something went wrong. Try again.'
        );
      }
    );
  }

  deleteIndustry(industry: any) {
    if (!confirm('Delete Confirm')) {
      return;
    }

    this.api.delete(`crud/industries/${industry.id}`).subscribe(
      (response: any) => {
        this.loading = false;
        this.getIndustries();
      },
      (error) => {
        this.loading = false;
        this.fun.presentAlertError(
          error.error.message ||
            error.error.sqlMessage ||
            'Something went wrong. Try again.'
        );
      }
    );
  }
}
