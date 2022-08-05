import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';

import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { PhoneComponent } from './pages/auth/phone/phone.component';

import { DatePipe } from '@angular/common';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

import { environment } from '../environments/environment';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { ToastrModule } from 'ngx-toastr';
import { InfoComponent } from './pages/auth/info/info.component';
import { PasswordComponent } from './pages/password/password.component';
import { AboutComponent } from './pages/content/about/about.component';
import { ContactComponent } from './pages/content/contact/contact.component';
import { HelpComponent } from './pages/content/help/help.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HeaderComponent } from './pages/include/header/header.component';
import { FooterComponent } from './pages/include/footer/footer.component';
import { LeftmenuComponent } from './pages/include/leftmenu/leftmenu.component';
import { AccountComponent } from './pages/account/account.component';
import { CreateJobsComponent } from './pages/jobs/create-jobs/create-jobs.component';
import { ListJobsComponent } from './pages/jobs/list-jobs/list-jobs.component';
import { ListApplicationsComponent } from './pages/jobs/list-applications/list-applications.component';
import { ListShortlistComponent } from './pages/jobs/list-shortlist/list-shortlist.component';
import { ApplicantComponent } from './pages/jobs/applicant/applicant.component';
import { JobComponent } from './pages/jobs/job/job.component';
import { ListAppliedComponent } from './pages/jobs/list-applied/list-applied.component';
import { MessagesComponent } from './pages/jobs/messages/messages.component';
import { CompanyComponent } from './pages/company/company.component';
import { UploadsComponent } from './pages/uploads/uploads.component';
import { SearchComponent } from './pages/search/search.component';
import { Header2Component } from './pages/include/header2/header2.component';
import { Footer2Component } from './pages/include/footer2/footer2.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotfoundComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    PhoneComponent,
    LogoutComponent,
    InfoComponent,
    PasswordComponent,
    AboutComponent,
    ContactComponent,
    HelpComponent,
    ProfileComponent,
    HeaderComponent,
    FooterComponent,
    LeftmenuComponent,
    AccountComponent,
    CreateJobsComponent,
    ListJobsComponent,
    ListApplicationsComponent,
    ListShortlistComponent,
    ApplicantComponent,
    JobComponent,
    ListAppliedComponent,
    MessagesComponent,
    CompanyComponent,
    UploadsComponent,
    SearchComponent,
    Header2Component,
    Footer2Component,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center'
    })
  ],
  providers: [
    DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.google_client_id
            )
          }
        ],
        onError: (error) => {
          console.error(error);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }