import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotfoundComponent } from './pages/notfound/notfound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { EmployeeRegisterComponent } from "./pages/auth/employee-register/employee-register.component";
import { BusinessRegisterComponent } from './pages/auth/business-register/business-register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { PhoneComponent } from './pages/auth/phone/phone.component';
import { LogoutComponent } from './pages/auth/logout/logout.component';
import { InfoComponent } from './pages/auth/info/info.component';
import { PasswordComponent } from './pages/password/password.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/content/about/about.component';
import { HelpComponent } from './pages/content/help/help.component';
import { ContactComponent } from './pages/content/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
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

import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { SelectPostTypeComponent } from './pages/jobs/select-post-type/select-post-type.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register/business', component: BusinessRegisterComponent},
  { path: 'register/employee', component: EmployeeRegisterComponent},
  { path: 'login', component: LoginComponent },
  { path: 'auth/phone', component: PhoneComponent },
  { path: 'auth/phone/:phone', component: PhoneComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'info',
    component: InfoComponent,
  },
  {
    path: 'password',
    component: PasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/create',
    component: CreateJobsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/create/:job_id',
    component: CreateJobsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/banner/create',
    component: CreateJobsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/banner/create/:job_id',
    component: CreateJobsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/urgent/create',
    component: CreateJobsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/urgent/create/:job_id',
    component: CreateJobsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/list',
    component: ListJobsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/select',
    component: SelectPostTypeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/applications',
    component: ListApplicationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/shortlist',
    component: ListShortlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/applicant/:user_id',
    component: ApplicantComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/job/:job_id',
    component: JobComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/applied',
    component: ListAppliedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/messages',
    component: MessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'jobs/messages/:user_id',
    component: MessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'company/:user_id',
    component: CompanyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'uploads',
    component: UploadsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'search',
    component: SearchComponent
  },
  { path: '404', component: NotfoundComponent },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }