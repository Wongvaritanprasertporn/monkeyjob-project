import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  profileImg = ''

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.profileImg = environment.url + "/storage/banner/" + this.auth.user.profile_img
  }

}
