import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  loading: boolean | undefined;
  newMessage: string | undefined;
  conversation: any;
  user: any = {
    id: "",
    name: ""
  };
  form: any;
  scrolledToBottom = false;
  constructor(
    private chatService: ChatService,
    public auth: AuthService,
    private router: Router,
    public api: ApiService,
    private activatedRoute: ActivatedRoute,
    public fun: FunctionsService,
    private formBuilder: FormBuilder,
    public app: AppComponent
  ) { }
  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;

  ngOnInit() {

    this.activatedRoute.params.subscribe(routeParams => {
      this.form = this.formBuilder.group({
        newMessage: ['', Validators.required]
      });

      if (this.activatedRoute.snapshot.paramMap.get('user_id')) {
        this.user.id = this.activatedRoute.snapshot.paramMap.get('user_id');
        this.getUser(this.activatedRoute.snapshot.paramMap.get('user_id'));
      }


    });

    this.getConversation();

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (error) { }
  }

  onScroll() {
    this.scrolledToBottom = true;
  }

  submit() {
    if (this.form.dirty && this.form.valid) {
      this.sendMessage();
    } else {
      for (let i in this.form.controls)
        this.form.controls[i].markAsTouched();
    }
  }

  sendMessage() {
    this.chatService.sendMessage({
      message: this.form.value.newMessage,
      from_user_id: this.auth.user.id,
      to_user_id: this.user.id,
      createdAt: new Date()
    });

    this.saveMessages({
      message: this.form.value.newMessage,
      to_user_id: this.user.id,
    });

    this.form.reset();
    this.scrollToBottom();
  }

  saveMessages(data: any) {
    this.api.post(`messages`, data)
      .subscribe((response: any) => {
      });
  }

  getUser(user_id: any) {
    this.loading = true;
    this.api.get(`crud/users/${user_id}`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.user = response;
        this.getMessages();
      }, error: (e) => {
        this.loading = false;
        this.router.navigateByUrl(`/404`);
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  getMessages() {
    this.loading = true;
    this.api.get(`messages/?from_user_id=${this.auth.user.id}&to_user_id=${this.user.id}`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.app.messageList = response.reverse();
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }

  getConversation() {
    this.loading = true;
    this.api.get(`messages/users`)
      .subscribe({next: (response: any) => {
        this.loading = false;
        this.conversation = response;
        if (this.conversation.length && !this.user.id) {
          this.router.navigateByUrl(`/jobs/messages/${this.conversation[0].to_user_id}`);
        }
      }, error: (e) => {
        this.loading = false;
        this.fun.presentAlertError(e.error.message || e.error.sqlMessage || 'Something went wrong. Try again.');
      }});
  }
}