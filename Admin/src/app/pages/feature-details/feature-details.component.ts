import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.css']
})
export class FeatureDetailsComponent implements OnInit {
  loading: boolean | undefined;
  feature: any = {
    id: "",
    title: ""
  };
  form: any;
  action = 1;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (this.activatedRoute.snapshot.paramMap.get('job_id')) {
      this.getJob(this.activatedRoute.snapshot.paramMap.get('job_id'));
    }
  }

  getJob(job_id: any) {
    this.loading = true;
    this.api.get(`crud/urgent/${job_id}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.feature = response;

          this.form.get('title').setValue(this.feature.title);
          this.form.get('description').setValue(this.feature.description);

          this.form.markAsDirty();

        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.update();
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  update() {
    this.loading = true;
    this.api.put(`crud/urgent/${this.feature.id}`, this.form.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.fun.presentAlert('Job has been updated.');
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }
}