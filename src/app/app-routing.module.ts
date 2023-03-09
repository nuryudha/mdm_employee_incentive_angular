import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCheckComponent } from './components/auth-check/auth-check.component';
import { AuthCheckDataEmployeeComponent } from './components/auth-check-data-employee/auth-check-data-employee.component';
import { AuthCheckDetailEmployeeComponent } from './components/auth-check-detail-employee/auth-check-detail-employee.component';
import { AuthCheckMonitoringRequestComponent } from './components/auth-check-monitoring-request/auth-check-monitoring-request.component';
import { AuthCheckViewDetailEmployeeComponent } from './components/auth-check-view-detail-employee/auth-check-view-detail-employee.component';
import { AuthCheckToDoListComponent } from './components/auth-check-to-do-list/auth-check-to-do-list.component';
import { DataEmployeeIncentiveComponent } from './components/employee-master/data-employee-incentive/data-employee-incentive.component';
import { DetailEmployeeMasterComponent } from './components/employee-master/detail-employee-master/detail-employee-master.component';
import { MonitoringRequestComponent } from './components/monitoring-request/monitoring-request.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { ViewMonitoringComponent } from './components/monitoring-request/view-monitoring/view-monitoring.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: 'auth/:token', component: AuthCheckComponent},
  {path: 'data-employee/:token', component: AuthCheckDataEmployeeComponent},
  {path: 'data-employee-auth', canActivate: [AuthGuard], component: DataEmployeeIncentiveComponent},
  {path: 'detail-employee/:token', component: AuthCheckDetailEmployeeComponent},
  {path: 'detail-employee-auth', canActivate: [AuthGuard], component: DetailEmployeeMasterComponent},
  {path: 'monitoring-request/:token', component: AuthCheckMonitoringRequestComponent},
  {path: 'monitoring-request-auth', canActivate: [AuthGuard], component: MonitoringRequestComponent},
  {path: 'view-detail-employee/:token', component: AuthCheckViewDetailEmployeeComponent},
  {path: 'view-detail-employee-auth', canActivate: [AuthGuard], component: ViewMonitoringComponent},
  {path: 'to-do-list/:token', component: AuthCheckToDoListComponent},
  {path: 'to-do-list-auth', canActivate: [AuthGuard], component: ToDoListComponent},
  {path: 'unauthorized', component: UnauthorizedComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
