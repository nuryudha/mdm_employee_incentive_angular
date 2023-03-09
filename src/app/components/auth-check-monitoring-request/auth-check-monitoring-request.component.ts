import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { MainService } from 'src/app/services/main.service';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';

@Component({
  selector: 'app-auth-check-monitoring-request',
  templateUrl: './auth-check-monitoring-request.component.html',
  styleUrls: ['./auth-check-monitoring-request.component.css']
})
export class AuthCheckMonitoringRequestComponent implements OnInit {

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
        this.router.navigate(['/monitoring-request-auth']);

      }else {
        this.toggleLoading.showLoading(false);
        this.router.navigate(['/unauthorized']);
        console.log(result);
      }
    })
  }

}
