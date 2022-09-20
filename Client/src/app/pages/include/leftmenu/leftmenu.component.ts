import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css']
})
export class LeftmenuComponent implements OnInit {
  bannerRoute: any;
  featureRoute: any;
  route: any;
  menu = false;
  menu2 = false;
  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route = this.router.url;

    if (
      this.route == '' ||
      this.route == '' ||
      this.route == '' ||
      this.route == ''
    ) {
      this.menu = true;

    }

    if (this.auth.user.subscription[1]) {
      this.bannerRoute = "/jobs/banner/create"
    }
    else {
      this.bannerRoute = "/subscription"
    }

    if (this.auth.user.subscription[2]) {
      this.featureRoute = "/jobs/urgent/create"
    }
    else {
      this.featureRoute = "/subscription"
    }

    switch (this.route) {
      case '/jobs/create': {
        this.menu = true;
        break;
      }
      case '/jobs/list': {
        this.menu = true;
        break;
      }
      case '/jobs/applications': {
        this.menu = true;
        break;
      }
      case '/jobs/shortlist': {
        this.menu = true;
        break;
      }
      case '/jobs/applied': {
        this.menu = true;
        break;
      }
      case '/jobs/messages': {
        this.menu = true;
        break;
      }
      default: {
        this.menu = false;
        break;
      }
    }


    switch (this.route) {
      case '/profile': {
        this.menu2 = true;
        break;
      }
      case '/account': {
        this.menu2 = true;
        break;
      }
      case '/password': {
        this.menu2 = true;
        break;
      }
      default: {
        this.menu2 = false;
        break;
      }
    }

  }

}
