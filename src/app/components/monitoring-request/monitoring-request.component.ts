import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EmployeeClass } from 'src/app/models/monitoring-request/employee-class.model';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MainService } from 'src/app/services/main.service';
import { status } from 'src/app/models/monitoring-request/get-status.model';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'

interface Filter {
  value: string;
  view: string;
}

@Component({
  selector: 'app-monitoring-request',
  templateUrl: './monitoring-request.component.html',
  styleUrls: ['./monitoring-request.component.css'],
})
export class MonitoringRequestComponent implements OnInit, AfterViewInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  displayedColumns: string[] = [
    'idEmployee',
    'employeeNo',
    'namaEmployee',
    'tglPengajuan',
    'inisiator',
    'status',
    'action',
  ];
  dataSource!: MatTableDataSource<EmployeeClass>;
  employeeClass: EmployeeClass[] = [];

  disabled = true;
  disabledStatus = true;
  showClass: boolean = false;
  filterStatus: any;
  filterSelect: status[] = [];
  selectStatus: any = this.filterSelect;
  start: any;
  end: any;
  initBulanAwal: any;
  initBulanAkhir: any;
  bulan: any;
  bulanEnd: any;
  tempTanggalAwal: Date = new Date();
  tempTanggalAkhir: Date = new Date();
  tanggalAwal: string = '';
  tanggalAkhir: string = '';
  nik: any;
  branchCode: any;
  token: any;
  checkedDate = false;
  checkedStat = false;
  disableDateToggle = false;
  disableStatToggle = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource(this.employeeClass);
    this.nik = this.authUser.profileHeader.nik;
    this.branchCode = this.authUser.profilLocation[0].branch_code;
    this.token = this.authUser.token;
  }
  @ViewChild('sortCol2') sortCol2!: MatSort;
  @ViewChild('MatPaginator2') MatPaginator2!: MatPaginator;
  @ViewChild('picker2') picker2: any;
  @ViewChild('picker3') picker3: any;

  open() {
    this.picker2.open();
    this.picker3.open();
  }

  ngOnInit(): void {
    // this.nik = this.route.snapshot.paramMap.get('nik');
    this.getListStatus();
  }

  // initiation date when page load
  initiateDate() {
    this.tempTanggalAwal = new Date();
    this.start = this.tempTanggalAwal;

    let getInitBulanAwal = this.start.getMonth();
    let namaInitBulanAwal = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getInitBulanAwal = namaInitBulanAwal[getInitBulanAwal];
    this.initBulanAwal = getInitBulanAwal;
    this.tanggalAwal = (this.tempTanggalAwal.getFullYear() + '-' + (this.initBulanAwal) + '-' + ('0' + this.tempTanggalAwal.getDate()).slice(-2)).toString() + ' 00:00:00';

    let lastDate = new Date();
    this.tempTanggalAkhir = new Date(lastDate.setDate(lastDate.getDate() + 29));
    this.end = this.tempTanggalAkhir;

    let getInitBulanAkhir = this.start.getMonth();
    let namaInitBulanAkhir = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getInitBulanAkhir = namaInitBulanAkhir[getInitBulanAkhir];
    this.initBulanAkhir = getInitBulanAkhir;
    this.tanggalAkhir = (this.tempTanggalAkhir.getFullYear() + '-' + (this.initBulanAkhir) + '-' + ('0' + this.tempTanggalAkhir.getDate()).slice(-2)).toString() + ' 23:59:59';
  }

  addEventAwal(type: string, event: MatDatepickerInputEvent<Date>) {
    this.tempTanggalAwal = new Date(`${type}: ${event.value}`);
    this.start = this.tempTanggalAwal;
    this.end = new Date(this.tempTanggalAwal.getFullYear(), this.tempTanggalAwal.getMonth() + 1, 0);

    let getBulan = this.start.getMonth();
    let namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getBulan = namaBulan[getBulan];
    this.bulan = getBulan;

    let getBulanEnd = this.end.getMonth();
    let namaBulanEnd = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getBulanEnd = namaBulanEnd[getBulanEnd];
    this.bulanEnd = getBulanEnd;

    this.tanggalAwal = (('0' + this.tempTanggalAwal.getDate()).slice(-2) + '-' + (this.bulan) + '-' + this.tempTanggalAwal.getFullYear()).toString();
    this.tanggalAkhir = (('0' + this.end.getDate()).slice(-2) + '-' + (this.bulanEnd) + '-' + this.end.getFullYear()).toString();
  }

  addEventAkhir(type: string, event: MatDatepickerInputEvent<Date>) {
    this.tempTanggalAkhir = new Date(`${type}: ${event.value}`);
    this.end = this.tempTanggalAkhir;
    this.start = new Date(this.tempTanggalAkhir.getFullYear(), this.tempTanggalAkhir.getMonth(), 1);

    let getBulan = this.start.getMonth();
    let namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getBulan = namaBulan[getBulan];
    this.bulan = getBulan;

    let getBulanEnd = this.end.getMonth();
    let namaBulanEnd = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getBulanEnd = namaBulanEnd[getBulanEnd];
    this.bulanEnd = getBulanEnd;

    this.tanggalAwal = (('0' + this.start.getDate()).slice(-2) + '-' + (this.bulanEnd) + '-' + this.start.getFullYear()).toString();
    this.tanggalAkhir = (('0' + this.tempTanggalAkhir.getDate()).slice(-2) + '-' + (this.bulan) + '-' + this.tempTanggalAkhir.getFullYear()).toString();
  }

  disableDate() {
    let dat = {
      "dateDisable": this.disabled
    }
    if (dat['dateDisable'] === true) {
      this.disabled = false;
      this.disableStatToggle = true;
    } else {
      this.disabled = true;
      this.disableStatToggle = false;
      this.start = "";
      this.end = "";
      this.tanggalAkhir = "";
    }
  }

  disableStatus() {
    let stat = {
      "statusDisable": this.disabledStatus
    }
    if (stat['statusDisable'] === true) {
      this.disabledStatus = false;
      this.disableDateToggle = true;
    } else {
      this.disabledStatus = true;
      this.filterStatus = "";
      this.disableDateToggle = false;
    }
  }

  getListStatus() {
    this.services.employeeIncentiveGet('getListStatus', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {
      console.log("cek result", result)
      if (result.body.Data.length > 0 && result.body.Data != null) {
        let tempListStatus = result.body.Data;
        let arrayListStatus: status[] = [];
        tempListStatus.forEach((element: any) => {
          arrayListStatus.push({ statusId: element.flag, statusDesc: element.statusDesc })
        })
        this.filterSelect = arrayListStatus;
        this.selectStatus = this.filterSelect;
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          await this.toastrNotif.toastOnNoListStatus();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  searchMonitoringReq() {
    let parameter = {
      "status": "",
      "tglAwal": "",
      "tglAkhir": "",
      "branchCode" : this.branchCode
    }
    // let parameterUser = {
    //   "nik": this.nik,
    //   "application": "MDMA"
    // }
    console.log(parameter)
    if (this.disabledStatus === false) {
      parameter['status'] = this.filterStatus;
    }

    if (this.disabled === false) {
      parameter['tglAwal'] = this.tanggalAwal;
      parameter['tglAkhir'] = this.tanggalAkhir;
    }
    if ((parameter['status'] === '' || parameter['status'] === undefined) && parameter['tglAwal'] === '' && parameter['tglAkhir'] === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Mohon pilih salah satu filter pencarian terlebih dahulu!'
      })
    } else {
      this.employeeClass = [];
      this.dataSource = new MatTableDataSource(this.employeeClass);

      // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameterUser).subscribe(result => {
        // this.branchCode = result.body.resultUserProfileLocation[0].branch_code
        // parameter['branchCode'] = this.branchCode;
        this.toggleLoading.showLoading(true);
        this.services.employeeIncentivePost('monitoringReq', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
          console.log("Monitoring",parameter)
          if (result.body.status == 'sukses' && result.body.data != null && result.body.data.length > 0) {
            result.body.data.forEach((element: any) => {
              this.employeeClass.push({
                idEmployee: element.idEmployee,
                employeeNo: element.employeeNo,
                namaEmployee: element.namaEmployee,
                tglPengajuan: element.tanggalPengajuan,
                inisiator: element.inisiator,
                status: element.status
              })
            })
            this.dataSource = new MatTableDataSource(this.employeeClass);
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
      // })
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sortCol2;
    this.dataSource.paginator = this.MatPaginator2;
  }

  searchResult(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

  ActionClicked(data: any) {
    this.router.navigate(['/view-detail-employee/' + this.token], {
      queryParams: {
        dataId: data.idEmployee,
        idEmployee: data.employeeNo,
        employeeName: data.namaEmployee
      },
    });
  }
}