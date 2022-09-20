import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-select-post-type',
  templateUrl: './select-post-type.component.html',
  styleUrls: ['./select-post-type.component.css']
})
export class SelectPostTypeComponent implements OnInit {

  loading: boolean | undefined;
  post_type: number = 1;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    
  }

  submit() {
    if (this.post_type == 1) {
      this.router.navigateByUrl('/jobs/create');
    }
    else if (this.post_type == 2 ) {
      if (this.auth.user.subscription[1]) {
        this.router.navigateByUrl('/jobs/banner/create');
      } else {
        this.router.navigateByUrl("/jobs/")
      }
    }
    else {
      if (this.auth.user.subscription[2]) {
        this.router.navigateByUrl('/jobs/urgent/create');
      } else {
        this.router.navigateByUrl('/jobs/')
      }
    }
  }

  getUserType(e: any) {
    this.post_type = e;
    console.log(e)
  }

}