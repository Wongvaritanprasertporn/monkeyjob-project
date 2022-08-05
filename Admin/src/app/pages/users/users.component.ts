import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FunctionsService } from '../../services/functions.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  loading: boolean | undefined;
  users: any;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.api.get('admin/users/2')
      .subscribe((response: any) => {
        this.loading = false;
        this.users = response;
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

  confirmBlock(user: any, value: number) {
    let el = this;
    el.updateUser(user, value);
    // el.fun.presentConfirm(function (e) {
    //   if (e) {
    //     el.updateUser(user, value);
    //   }
    // }, `Confirm ${value ? 'Unblock' : 'Block'}`, 'You can undo it any time.');
  }

  updateUser(user: any, value: number) {
    this.loading = true;
    var data = {
      is_active: value
    }
    this.api.put(`crud/users/${user.id}`, data)
      .subscribe((response: any) => {
        this.loading = false;
        this.fun.presentAlert(`${value ? 'Unblock' : 'Block'} Successfully.`);
        this.getUsers();
      }, error => {
        this.loading = false;
        this.fun.presentAlertError(error.error.message || error.error.sqlMessage || 'Something went wrong. Try again.');
      });
  }

}