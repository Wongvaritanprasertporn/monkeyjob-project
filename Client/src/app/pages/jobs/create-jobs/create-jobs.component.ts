import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/services/validation.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-create-jobs',
  templateUrl: './create-jobs.component.html',
  styleUrls: ['./create-jobs.component.css']
})
export class CreateJobsComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  job: any = {
    id: "",
    title: ""
  };
  industries : any;
  currency = environment.currency;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      industry: ['', Validators.required],
      minimum_age: ['', [Validators.required, Validators.min(1)]],
      maximum_age: ['', [Validators.required, Validators.min(1)]],
      starting_salary: ['', [Validators.required, Validators.min(1)]],
      type: ['', [Validators.required, Validators.min(1)]],
      positions: ['', Validators.required],
      priority: ['', Validators.required],
      address: ['', Validators.required],
      zip_code: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (this.activatedRoute.snapshot.paramMap.get('job_id')) {
      this.getJob(this.activatedRoute.snapshot.paramMap.get('job_id'));
    }

    this.getIndustries();
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (!this.job.id) {
        this.save();
      } else {
        this.update();
      }
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  getIndustries() {
    this.api.get(`crud/industries/`)
      .subscribe((response: any) => {
        this.industries = response;
      }, error => {
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  getJob(job_id: any) {
    this.loading = true;
    this.api.get(`crud/jobs/${job_id}`)
      .subscribe((response: any) => {
        this.loading = false;
        this.job = response;

        this.form.get('title').setValue(this.job.title);
        this.form.get('industry').setValue(this.job.industry);
        this.form.get('minimum_age').setValue(this.job.minimum_age);
        this.form.get('starting_salary').setValue(this.job.starting_salary);
        this.form.get('zip_code').setValue(this.job.zip_code);
        this.form.get('description').setValue(this.job.description);
        this.form.get('type').setValue(this.job.type);
        this.form.get('maximum_age').setValue(this.job.maximum_age);
        this.form.get('priority').setValue(this.job.priority);
        this.form.get('positions').setValue(this.job.positions);
        this.form.get('address').setValue(this.job.address);
        this.form.markAsDirty();

      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  save() {
    this.loading = true;
    this.api.post(`jobs/`, this.form.value)
      .subscribe((response: any) => {
        this.loading = false;
        this.router.navigateByUrl('jobs/list');
        this.fun.presentAlert('Job has been created.');
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  update() {
    this.loading = true;
    this.api.put(`crud/jobs/${this.job.id}`, this.form.value)
      .subscribe((response: any) => {
        this.loading = false;
        this.fun.presentAlert('Job has been updated.');
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

}