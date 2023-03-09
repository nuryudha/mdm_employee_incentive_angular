import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MainService } from 'src/app/services/main.service';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';

@Component({
  selector: 'app-auth-check-view-detail-employee',
  templateUrl: './auth-check-view-detail-employee.component.html',
  styleUrls: ['./auth-check-view-detail-employee.component.css']
})
export class AuthCheckViewDetailEmployeeComponent implements OnInit {

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response',
    responseType: 'json'
  }

  tokenParameter: any;
  urlParameter: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private services: MainService,
    private toggleLoading: ToggleLoadingService,
    private handleError: ErrorRequestService
    ) { }

  ngOnInit(): void {
    this.getUrlParameter();
    this.paramQuery();
  }

  getUrlParameter() {

    this.tokenParameter = this.route.snapshot.params['token'];
    // this.urlParameter = this.encryption.decryptParameter(this.route.snapshot.params['params']) == '' ? {} : JSON.parse(this.encryption.decryptParameter(this.route.snapshot.params['params']));
    // console.log('URL Parameter : ', this.urlParameter);

    this.httpOptions.headers = this.httpHeaders.set('Authorization', `Bearer ${this.tokenParameter}`);
    
    if (this.tokenParameter != '') {
      this.getDetailUser();
      console.log('TOKEN : ', this.tokenParameter);
    } else {
      this.router.navigate(['/unauthorized']);
      console.log('TOKEN : ', this.tokenParameter);
    }
  }

  dataID : any;
  getDataId : any;
  // employeeNo : any;
  // npk : any;
  // namaEmployee : any;
  // identitas : any;
  filterEmployeeStatus : any;
  statusAproval : any;
  mapId : any;
  accountId : any;
  // mapIdAktifButton : any;
  // statusAktifButton : any;
  // rekAktifButton : any;
  // statusRekAktifButton : any;
  addStatusEmployee : any;
  paramQuery() {
    this.route.queryParams
      .subscribe(param => {
        this.dataID = param.dataId,
        this.getDataId = param.getDataID,
        // this.employeeNo = param.idEmployee,
        // this.npk = param.npk,
        // this.namaEmployee = param.employeeName,
        // this.identitas = param.identitas,
        this.filterEmployeeStatus = param.status,
        this.statusAproval = param.statusToDoLits,
        this.mapId = param.mapId,
        this.accountId = param.accountId,
        // this.mapIdAktifButton = param.mapIdAktifButton,
        // this.statusAktifButton = param.statusAktifButton,
        // this.rekAktifButton = param.rekAktifButton,
        // this.statusRekAktifButton = param.statusRekAktifButton,
        this.addStatusEmployee = param.employeeStatus
      })
  }

  getDetailUser() {

    this.toggleLoading.showLoading(true);
    this.services.detailUser('details', this.httpOptions, catchError(this.handleError.handleErrorDetailUser.bind(this))).subscribe( result => {
      console.log(result);

      if(result.body.status == true) {
        const authLogin = {
          "token" : this.tokenParameter,
          "profilLocation" : result.body.data.data.resultUserProfileLocation,
          "profileHeader" : result.body.data.data.resultUserProfileHeader,
          "profileUserRole" : result.body.data.data.resultProfileUserRole
        }
        console.log('true',authLogin);

        localStorage.setItem('auth-user', JSON.stringify(authLogin));
        this.toggleLoading.showLoading(false);
        this.router.navigate(['/view-detail-employee-auth'], {
          queryParams: {
            dataId: this.dataID,
            getDataID: this.getDataId,
            status: this.filterEmployeeStatus,
            statusToDoLits : this.statusAproval,
            mapId : this.mapId,
            accountId : this.accountId,
            employeeStatus : this.addStatusEmployee
            // employeeName : this.namaEmployee
          },
        });

      }else {
        this.toggleLoading.showLoading(false);
        this.router.navigate(['/unauthorized']);
        console.log(result);
      }
    })
  }

}
