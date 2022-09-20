import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
    loading: boolean | undefined;
    job: any = {
        id: "",
        title : ""
    };
    form: any;
    action = 1;
    constructor(
        public api: ApiService,
        public fun: FunctionsService,
        private formBuilder: FormBuilder,
        public auth: AuthService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            minimum_age: ['', [Validators.required, Validators.min(1)]],
            maximum_age: ['', [Validators.required, Validators.min(1)]],
            salary: ['', [Validators.required, Validators.min(1)]],
            description: ['',Validators.required]
        });

        if (this.activatedRoute.snapshot.paramMap.get('job_id')) {
            this.getJob(this.activatedRoute.snapshot.paramMap.get('job_id'));
        }
    }

    getJob(job_id: any) {
        this.loading = true;
        this.api.get(`crud/jobs/${job_id}`)
            .subscribe({next: (response: any) => {
                this.loading = false;
                this.job = response;

                this.form.get('title').setValue(this.job.title);
                this.form.get('minimum_age').setValue(this.job.minimum_age);
                this.form.get('maximum_age').setValue(this.job.maximum_age);
                this.form.get('salary').setValue(this.job.salary);
                this.form.get('description').setValue(this.job.description);

        this.form.markAsDirty();

            }, error: (e) => {
                this.loading = false;
                this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
            }});
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
        this.api.put(`crud/jobs/${this.job.id}`, this.form.value)
            .subscribe({next: (response: any) => {
                this.loading = false;
                this.fun.presentAlert('Job has been updated.');
            }, error: (e) => {
                this.loading = false;
                this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
            }});
    }
}