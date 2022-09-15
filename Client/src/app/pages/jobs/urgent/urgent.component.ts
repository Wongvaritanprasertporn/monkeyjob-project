import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-urgent',
  templateUrl: './urgent.component.html',
  styleUrls: ['./urgent.component.css']
})
export class UrgentComponent implements OnInit {
  form: any;
  loading: boolean | undefined;
  urgent: any = {
    id: "",
    title: ""
  };

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
      title: ['', [Validators.required]],
      description: ['', Validators.required],
      banner: ['', [Validators.required]]
    })

    if (this.activatedRoute.snapshot.paramMap.get('job_id')) {
      this.getJob(this.activatedRoute.snapshot.paramMap.get('job_id'));
    }
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      if (!this.urgent.id) {
        this.save();
      } else {
        this.update();
      }
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  getJob(job_id: any) {
    this.loading = true;
    this.api.get(`crud/jobs/${job_id}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.urgent = response;

          this.form.get('title').setValue(this.urgent.title);
          this.form.get('description').setValue(this.urgent.description);
          this.form.get('banner').setValue(this.urgent.salary);

          this.form.markAsDirty();

        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  save() {
    this.loading = true;
    this.api.post(`jobs/`, this.form.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.router.navigateByUrl('jobs/list');
          this.fun.presentAlert('Job has been created.');
        }, error: (e) => {
          this.loading = false;
          this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
        }
      });
  }

  update() {
    this.loading = true;
    this.api.put(`crud/jobs/${this.urgent.id}`, this.form.value)
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
