import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css']
})
export class LeftmenuComponent implements OnInit {
  route : any;
  constructor(
    public auth : AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route = this.router.url;
  }

}
