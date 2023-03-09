import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs'
import { MatSort, Sort } from '@angular/material/sort';
import { MainService } from 'src/app/services/main.service';
import { PendaftaranElement } from 'src/app/models/todolist/pendaftaran.model';
import { InsentifElement } from 'src/app/models/todolist/insentif.model';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  displayedColumnsPendaftaran: string[] = ['idEmployee', 'namaEmployee', 'tanggalPengajuan', 'status', 'action'];
  dataSourcePendaftaran!: MatTableDataSource<PendaftaranElement>;
  displayedColumnsInsentif: string[] = ['idEmployee', 'namaEmployee', 'tanggalPengajuan', 'status', 'action'];
  dataSourceInsentif!: MatTableDataSource<InsentifElement>;

  showClass: boolean = false;
  pendaftaran: PendaftaranElement[] = [];
  insentif: InsentifElement[] = [];
  mapId: any;
  nik: any;
  roleUser: any;
  token: any;
  branchCreator: any;
  insentifCek: any;
  insentifValue: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private router: Router,
    private route: ActivatedRoute) {
    this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
    this.dataSourceInsentif = new MatTableDataSource(this.insentif);
    this.branchCreator = this.authUser.profilLocation[0].branch_code;
    this.nik = this.authUser.profileHeader.nik;
    this.roleUser = this.authUser.profileUserRole;
    this.token = this.authUser.token;
  }
  @ViewChild('sortCol1') sortCol1!: MatSort;
  @ViewChild('sortCol2') sortCol2!: MatSort;
  @ViewChild('MatPaginator1') MatPaginator1!: MatPaginator;
  @ViewChild('MatPaginator2') MatPaginator2!: MatPaginator;

  ngOnInit(): void {
    this.pendaftaranToDoList();
    this.insentifToDoList();
    this.insetifTab();
  }

  insetifTab() {
    this.insentifCek = window.location.href;
    var subString = this.insentifCek.split('?');
    var shopName = subString[1];
    console.log("TESTING URL===========>", this.insentifCek)
    console.log("TESTING URL===========>", shopName)
    if (shopName == 'insentif=1') {
      this.insentifValue = 1;
      console.log("TRUE")
    } else {
      this.insentifValue = 0;
      console.log("FALSE")
    }
  }

  pendaftaranToDoList() {
    let parameter = {
      "branchCreator": this.branchCreator,
      "role": ""
    }
    console.log("parameter role:", parameter)
    this.roleUser.forEach((element: any) => {
      if (element.role_code == 'APPR1_EMPL_INSE_CAB') {
        parameter['role'] = element.role_code;
        this.toggleLoading.showLoading(true);
        this.pendaftaran = [];
        this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
        this.services.employeeIncentivePost('getListDaftar', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
          console.log("service:", result)
          if (result.body.Alert == 'Berhasil' && result.body.Data != null && result.body.Data.length > 0) {
            result.body.Data.forEach((element: any) => {
              this.pendaftaran.push({
                idEmployee: element.idEmployee,
                namaEmployee: element.namaEmployee,
                tanggalPengajuan: element.tanggalPengajuan,
                status: element.status,
                mapId: element.mapId,
                accountId: element.accountId
              })
            })
            this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
            this.ngAfterViewInit();
            this.toggleLoading.showLoading(false);
          } else {
            const waitPopUpDone = async () => {
              await this.toastrNotif.toastOnNoListAppr();
              this.ngAfterViewInit();
              this.toggleLoading.showLoading(false);
            }
            waitPopUpDone();
          }
        })
        // })
      } else if (element.role_code == 'APPR1_EMPL_INSE_HO') {
        parameter['role'] = element.role_code;
        this.toggleLoading.showLoading(true);
        this.pendaftaran = [];
        this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
        this.services.employeeIncentivePost('getListDaftar', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
          console.log("service:", result)
          if (result.body.Alert == 'Berhasil' && result.body.Data != null && result.body.Data.length > 0) {
            result.body.Data.forEach((element: any) => {
              this.pendaftaran.push({
                idEmployee: element.idEmployee,
                namaEmployee: element.namaEmployee,
                tanggalPengajuan: element.tanggalPengajuan,
                status: element.status,
                mapId: element.mapId,
                accountId: element.accountId
              })
            })
            this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
            this.ngAfterViewInit();
            this.toggleLoading.showLoading(false);
          } else {
            const waitPopUpDone = async () => {
              await this.toastrNotif.toastOnNoListAppr();
              this.ngAfterViewInit();
              this.toggleLoading.showLoading(false);
            }
            waitPopUpDone();
          }
        })
      } else if (element.role_code == 'APPR2_EMPL_INSENTIF') {
        parameter['role'] = element.role_code;
        this.toggleLoading.showLoading(true);
        this.pendaftaran = [];
        this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
        this.services.employeeIncentivePost('getListDaftar', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
          console.log("service:", result)
          if (result.body.Alert == 'Berhasil' && result.body.Data != null && result.body.Data.length > 0) {
            result.body.Data.forEach((element: any) => {
              this.pendaftaran.push({
                idEmployee: element.idEmployee,
                namaEmployee: element.namaEmployee,
                tanggalPengajuan: element.tanggalPengajuan,
                status: element.status,
                mapId: element.mapId,
                accountId: element.accountId
              })
            })
            this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
            this.ngAfterViewInit();
            this.toggleLoading.showLoading(false);
          } else {
            const waitPopUpDone = async () => {
              await this.toastrNotif.toastOnNoSearchEmployee();
              this.ngAfterViewInit();
              this.toggleLoading.showLoading(false);
            }
            waitPopUpDone();
          }
        })
      } else if (element.role_code == 'INIT_EMPL_INSE_HO') {
        parameter['role'] = element.role_code;
        this.toggleLoading.showLoading(true);
        this.pendaftaran = [];
        this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
        this.services.employeeIncentivePost('getListDaftar', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
          console.log("service:", result)
          if (result.body.Alert == 'Berhasil' && result.body.Data != null && result.body.Data.length > 0) {
            result.body.Data.forEach((element: any) => {
              this.pendaftaran.push({
                idEmployee: element.idEmployee,
                namaEmployee: element.namaEmployee,
                tanggalPengajuan: element.tanggalPengajuan,
                status: element.status,
                mapId: element.mapId,
                accountId: element.accountId
              })
            })
            this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
            this.ngAfterViewInit();
            this.toggleLoading.showLoading(false);
          } else {
            const waitPopUpDone = async () => {
              await this.toastrNotif.toastOnNoListHO();
              this.ngAfterViewInit();
              this.toggleLoading.showLoading(false);
            }
            waitPopUpDone();
          }
        })
      } else if (element.role_code == 'INIT_EMPL_INSE_CAB') {
        parameter['role'] = element.role_code;
        this.toggleLoading.showLoading(true);
        this.pendaftaran = [];
        this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
        this.services.employeeIncentivePost('getListDaftar', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
          console.log("service:", result)
          if (result.body.Alert == 'Berhasil' && result.body.Data != null && result.body.Data.length > 0) {
            result.body.Data.forEach((element: any) => {
              this.pendaftaran.push({
                idEmployee: element.idEmployee,
                namaEmployee: element.namaEmployee,
                tanggalPengajuan: element.tanggalPengajuan,
                status: element.status,
                mapId: element.mapId,
                accountId: element.accountId
              })
            })
            this.dataSourcePendaftaran = new MatTableDataSource(this.pendaftaran);
            this.ngAfterViewInit();
            this.toggleLoading.showLoading(false);
          } else {
            const waitPopUpDone = async () => {
              await this.toastrNotif.toastOnNoListCAB();
              this.ngAfterViewInit();
              this.toggleLoading.showLoading(false);
            }
            waitPopUpDone();
          }
        })
      }
    })
  }

  insentifToDoList() {
    // let parameterUser = {
    //   "nik": this.nik,
    //   "application": "MDMA"
    // }
    let parameter = {
      "branchCreator": this.branchCreator,
      "role": ""
    }
    console.log("insentif", parameter)
    // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameterUser).subscribe(result => {
      // this.branchCreator = result.body.resultUserProfileLocation
      // this.roleUser = result.body.resultProfileUserRole
      this.roleUser.forEach((element: any) => {
        if (element.role_code == 'INIT_EMPL_INSE_CAB') {
          parameter['role'] = element.role_code;
          // this.branchCreator.forEach((element: any) => {
            // if (element.branch_code) {
              // parameter['branchCreator'] = element.branch_code;
              this.insentif = [];
              this.dataSourceInsentif = new MatTableDataSource(this.insentif);
              this.services.employeeIncentivePost('getListInsentif', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
                this.toggleLoading.showLoading(true);
                if (result.body.Alert == 'Berhasil' && result.body.Data != null && result.body.Data.length > 0) {
                  result.body.Data.forEach((element: any) => {
                    this.insentif.push({
                      idEmployee: element.idEmployee,
                      namaEmployee: element.namaEmployee,
                      tanggalPengajuan: element.tanggalPengajuan,
                      status: element.status
                    })
                  })
                  this.dataSourceInsentif = new MatTableDataSource(this.insentif);
                  this.ngAfterViewInit();
                  this.toggleLoading.showLoading(false);
                } else {
                  const waitPopUpDone = async () => {
                    // await this.toastrNotif.toastOnNoListInse();
                    this.ngAfterViewInit();
                    this.toggleLoading.showLoading(false);
                  }
                  waitPopUpDone();
                }
              })
            // }
          // })
        } else if (element.role_code == 'INIT_EMPL_INSE_HO') {
          parameter['role'] = element.role_code;
          // this.branchCreator.forEach((element: any) => {
            // if (element.branch_code) {
            //   parameter['branchCreator'] = element.branch_code;
              this.insentif = [];
              this.dataSourceInsentif = new MatTableDataSource(this.insentif);
              this.services.employeeIncentivePost('getListInsentif', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
                this.toggleLoading.showLoading(true);
                if (result.body.Alert == 'Berhasil' && result.body.Data != null && result.body.Data.length > 0) {
                  result.body.Data.forEach((element: any) => {
                    this.insentif.push({
                      idEmployee: element.idEmployee,
                      namaEmployee: element.namaEmployee,
                      tanggalPengajuan: element.tanggalPengajuan,
                      status: element.status
                    })
                  })
                  this.dataSourceInsentif = new MatTableDataSource(this.insentif);
                  this.ngAfterViewInit();
                  this.toggleLoading.showLoading(false);
                } else {
                  const waitPopUpDone = async () => {
                    // await this.toastrNotif.toastOnNoListInse();
                    this.ngAfterViewInit();
                    this.toggleLoading.showLoading(false);
                  }
                  waitPopUpDone();
                }
              })
          //   }
          // })
        }
      })
    // })
  }

  ActionClickedPend(data: any) {
    this.router.navigate(['/detail-employee/' + this.token], {
      queryParams: {
        dataId: data.idEmployee,
        employeeName: data.namaEmployee,
        tanggalPengajuan: data.tanggalPengajuan,
        statusToDoLits: data.status,
        mapId: data.mapId,
        accountId: data.accountId
      },
    });
  }

  ActionClickedInsentif(data: any) {
    this.router.navigate(['/detail-employee/' + this.token], {
      queryParams: {
        dataId: data.idEmployee,
        employeeName: data.namaEmployee,
        tanggalPengajuan: data.tanggalPengajuan,
        statusToDoLits: data.status
      },
    });
  }

  ngAfterViewInit() {
    this.dataSourcePendaftaran.sort = this.sortCol2;
    this.dataSourcePendaftaran.paginator = this.MatPaginator2;
    this.dataSourceInsentif.sort = this.sortCol1;
    this.dataSourceInsentif.paginator = this.MatPaginator1;
  }

  searchPendaftaran(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePendaftaran.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePendaftaran.paginator) {
      this.dataSourcePendaftaran.paginator.firstPage();
    }
  }

  searchInsentif(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInsentif.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceInsentif.paginator) {
      this.dataSourceInsentif.paginator.firstPage();
    }
  }

  detectScreenSize() {
    this.breakpointObserver.observe([
      "(max-width: 900px)"
    ]).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.showClass = false;
      } else {
        this.showClass = true;
      }
    });
  }
}