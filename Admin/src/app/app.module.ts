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
import { PhoneComponent } from './pages/auth/phone/phone.component';
import { RegisterComponent } from './pages/auth/register/register.component';

import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';

import { DatePipe } from '@angular/common';

import { LogoutComponent } from './pages/auth/logout/logout.component';
import { ToastrModule } from 'ngx-toastr';
import { PasswordComponent } from './pages/password/password.component';
import { AboutComponent } from './pages/content/about/about.component';
import { ContactComponent } from './pages/content/contact/contact.component';
import { HelpComponent } from './pages/content/help/help.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HeaderComponent } from './pages/include/header/header.component';
import { FooterComponent } from './pages/include/footer/footer.component';
import { LeftmenuComponent } from './pages/include/leftmenu/leftmenu.component';
import { UsersComponent } from './pages/users/users.component';
import { StudentComponent } from './pages/student/student.component';
import { UserComponent } from './pages/user/user.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { JobComponent } from './pages/job/job.component';
import { IndustriesComponent } from './pages/industries/industries.component';
import { BannerComponent } from './pages/banner/banner.component';
import { FeatureJobsComponent } from './pages/feature-jobs/feature-jobs.component';
import { BannerDetailsComponent } from './pages/banner-details/banner-details.component';
import { FeatureDetailsComponent } from './pages/feature-details/feature-details.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotfoundComponent,
    DashboardComponent,
    LoginComponent,
    PhoneComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    PasswordComponent,
    AboutComponent,
    ContactComponent,
    HelpComponent,
    ProfileComponent,
    HeaderComponent,
    FooterComponent,
    LeftmenuComponent,
    UsersComponent,
    StudentComponent,
    UserComponent,
    JobsComponent,
    JobComponent,
    IndustriesComponent,
    BannerComponent,
    FeatureJobsComponent,
    BannerDetailsComponent,
    FeatureDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center'
    })
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }