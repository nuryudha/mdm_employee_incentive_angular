import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { MatSelectFilterModule } from 'mat-select-filter';
import { DataEmployeeIncentiveComponent } from './components/employee-master/data-employee-incentive/data-employee-incentive.component';
import { DetectionDeduplicationCheckComponent } from './components/employee-master/data-employee-incentive/detection-deduplication-check/detection-deduplication-check.component';
import { DetailEmployeeMasterComponent } from './components/employee-master/detail-employee-master/detail-employee-master.component';
import { TambahInformasiPekerjaanDealerComponent } from './components/employee-master/detail-employee-master/tambah-informasi-pekerjaan-dealer/tambah-informasi-pekerjaan-dealer.component';
import { EditDetailPekerjaanDealerComponent } from './components/employee-master/detail-employee-master/edit-detail-pekerjaan-dealer/edit-detail-pekerjaan-dealer.component';
import { TambahRekeningComponent } from './components/employee-master/detail-employee-master/tambah-rekening/tambah-rekening.component';
import { UploadDocumentComponent } from './components/employee-master/detail-employee-master/upload-document/upload-document.component';
import { PopupMappingRekComponent } from './components/employee-master/detail-employee-master/popup-mapping-rek/popup-mapping-rek.component';
import { DetailInformasiRekeningComponent } from './components/employee-master/detail-employee-master/detail-informasi-rekening/detail-informasi-rekening.component';
import { MonitoringRequestComponent } from './components/monitoring-request/monitoring-request.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { MaterialModule } from './material/material.module';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { UppercaseInputDirective } from './directives/uppercase-input.directive';
import { OnlynumberDirective } from './directives/onlynumber.directive';
import { AlfabetOnlyDirective } from './directives/alfabet-only.directive';
import { ViewMonitoringComponent } from './components/monitoring-request/view-monitoring/view-monitoring.component';
import Swal from 'sweetalert2';
import { AuthCheckComponent } from './components/auth-check/auth-check.component';
import { AuthCheckDataEmployeeComponent } from './components/auth-check-data-employee/auth-check-data-employee.component';
import { AuthCheckDetailEmployeeComponent } from './components/auth-check-detail-employee/auth-check-detail-employee.component';
import { AuthCheckMonitoringRequestComponent } from './components/auth-check-monitoring-request/auth-check-monitoring-request.component';
import { AuthCheckViewDetailEmployeeComponent } from './components/auth-check-view-detail-employee/auth-check-view-detail-employee.component';
import { AuthCheckToDoListComponent } from './components/auth-check-to-do-list/auth-check-to-do-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    DetectionDeduplicationCheckComponent,
    DetailEmployeeMasterComponent,
    DataEmployeeIncentiveComponent,
    TambahInformasiPekerjaanDealerComponent,
    EditDetailPekerjaanDealerComponent,
    TambahRekeningComponent,
    UploadDocumentComponent,
    PopupMappingRekComponent,
    DetailInformasiRekeningComponent,
    MonitoringRequestComponent,
    ToDoListComponent,
    UppercaseInputDirective,
    OnlynumberDirective,
    AlfabetOnlyDirective,
    ViewMonitoringComponent,
    AuthCheckComponent,
    AuthCheckDataEmployeeComponent,
    AuthCheckDetailEmployeeComponent,
    AuthCheckMonitoringRequestComponent,
    AuthCheckViewDetailEmployeeComponent,
    AuthCheckToDoListComponent,
    PageNotFoundComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MatSelectFilterModule,
    FilePickerModule,
    ToastrModule.forRoot()
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
