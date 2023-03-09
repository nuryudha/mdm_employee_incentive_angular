import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { DetectionDeduplicationCheckComponent } from '../data-employee-incentive/detection-deduplication-check/detection-deduplication-check.component';
import { MainService } from 'src/app/services/main.service';
import { ResultElement } from 'src/app/models/data-employee-incentive/result.model';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute  } from '@angular/router';
import Swal from 'sweetalert2'

interface Filter {
  value: string;
  view: string;
}

@Component({
  selector: 'app-data-employee-incentive',
  templateUrl: './data-employee-incentive.component.html',
  styleUrls: ['./data-employee-incentive.component.css']
})

export class DataEmployeeIncentiveComponent implements OnInit, AfterViewInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  disabled = true;
  showClass: boolean = false;
  displayedColumnsResult: string[] = ['idEmployee', 'identitas', 'npk', 'nama', 'tanggalPendaftaran', 'aktif', 'cabangCreator', 'action'];
  dataSource!: MatTableDataSource<ResultElement>;
  filterSelect: string = '';
  selectDataEmployee: Filter[] = [
    { value: 'NAMA', view: 'NAMA' },
    { value: 'NPK', view: 'NPK' },
    { value: 'IDENTITAS', view: 'IDENTITAS' },
  ]
  sendDataToDetail: any;
  namaEmployee: string = '';
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
  serachEmployee: ResultElement[] = [];
  dataMainServices: any;
  branchCode: any;
  token: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.branchCode = this.authUser.profilLocation[0].branch_code;
    this.token = this.authUser.token;
    this.dataSource = new MatTableDataSource(this.serachEmployee);
  }
  @ViewChild('sortCol2') sortCol2!: MatSort;
  @ViewChild('MatPaginator2') MatPaginator2!: MatPaginator;
  @ViewChild('picker2') picker2:any;
  @ViewChild('picker3') picker3:any;

  open() {
    this.picker2.open();
    this.picker3.open();
  }

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
    this.start =  new Date(this.tempTanggalAkhir.getFullYear(), this.tempTanggalAkhir.getMonth(), 1);

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

  ngOnInit(): void {

  }

  dopdownResset() {
    this.namaEmployee = "";
  }

  disableDate() {
    let dat = {
      "dateDisable": this.disabled
    }
    if (dat['dateDisable'] === true) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  searchEmployeeData() {
    let parameter = {
      "nama": "",
      "npk": "",
      "identitas": "",
      "tanggalAwal": "",
      "tanggalAkhir": "",
      "branchCode" : this.branchCode
    }

    console.log(parameter)

    if (this.filterSelect === 'NAMA') {
      parameter['nama'] = this.namaEmployee.toUpperCase();
    }
    else if (this.filterSelect === 'NPK') {
      parameter['npk'] = this.namaEmployee.toUpperCase();
    }
    else if (this.filterSelect === 'IDENTITAS') {
      parameter['identitas'] = this.namaEmployee.toUpperCase();
    }

    if (this.disabled === false) {
      parameter['tanggalAwal'] = this.tanggalAwal;
      parameter['tanggalAkhir'] = this.tanggalAkhir;
    }
    this.sendDataToDetail = parameter;
    if (parameter['nama'] === '' && parameter['npk'] === '' && parameter['identitas'] === '' && parameter['tanggalAwal'] === '' && parameter['tanggalAkhir'] === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Mohon isi filter pencarian dan tanggal terlebih dahulu!'
      })
    } else {
      this.toggleLoading.showLoading(true);
      this.serachEmployee = [];
      this.dataSource = new MatTableDataSource(this.serachEmployee);
      this.services.employeeIncentivePost('searchEmployee', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
        if (result.body.status == 'sukses' && result.body.data != null && result.body.data.length > 0) {
          result.body.data.forEach((element: any) => {
            this.serachEmployee.push({
              idEmployee: element.dataId,
              identitas: element.identitas,
              npk: element.npk,
              nama: element.employeeName,
              tanggalPendaftaran: element.insertDate,
              aktif: element.status,
              cabangCreator: element.branchCreator,
              action: element.dataId
            })
          })
          this.serachEmployee.sort((a:any, b:any) => a.idEmployee - b.idEmployee);
          console.log(this.serachEmployee)
          this.dataSource = new MatTableDataSource(this.serachEmployee);
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
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sortCol2;
    this.dataSource.paginator = this.MatPaginator2;
  }

  notifToastr() {
    this.toastrNotif.toastOnNoSearchEmployee();
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "100%";
    dialogConfig.height = "90%";
    this.dialog.open(DetectionDeduplicationCheckComponent, dialogConfig).afterClosed().subscribe(res => {      
    });
  }

  searchResult(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  erroalert() {
    Swal.fire({
      title: "Informasi",
      text: "Fitur ini masih dalam pengembangan",
      icon: 'info',
    });
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
    this.router.navigate(['/detail-employee/' + this.token], {
      queryParams: {
        dataId: data.action,
        idEmployee: data.idEmployee,
        npk: data.npk,
        employeeName: data.nama,
        identitas: data.identitas,
        cabangCreator: data.cabangCreator,
        status: data.aktif
      },
    });
  }
}
