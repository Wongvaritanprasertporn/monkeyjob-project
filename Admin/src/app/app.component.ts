import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { FunctionsService } from './services/functions.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading: boolean | undefined;
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.getAccessToken()) {
      this.getUsers();
    }
  }

  getUsers() {
    this.loading = true;
    this.api.post('auth/access-token/admin', {
      'access_token': this.auth.getAccessToken()
    })
      .subscribe((response: any) => {
        this.loading = false;
        this.auth.setUser(response);
      }, error => {
        this.loading = false;
        this.router.navigate(['logout']);
      });
  }
}
