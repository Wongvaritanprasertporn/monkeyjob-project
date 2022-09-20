import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  title = environment.title;
  d = new Date();
  year = this.d.getFullYear();

  constructor(  ) { }

  ngOnInit(): void {
  }

}
