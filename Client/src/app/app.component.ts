import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { FunctionsService } from './services/functions.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading: boolean | undefined;
  messageList: any
  constructor(
    public api: ApiService,
    public fun: FunctionsService,
    private auth: AuthService,
    private router: Router,
    private chatService: ChatService,
  ) {
    if (this.auth.getAccessToken()) {
      this.getUsers();
    }

    this.chatService.getNewMessage().subscribe((message: any) => {
      if (message) {
        if (message.to_user_id == this.auth.user.id) {
          this.fun.presentInfo(message.message);
        }
        this.messageList.push(message);
      }
    });
  }

  getUsers() {
    this.loading = true;
    this.api.post('auth/access-token/users', {
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
