import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { DedupElement } from 'src/app/models/data-employee-incentive/dedup.models';
import { DealerElement } from 'src/app/models/data-employee-incentive/searchDealer.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { MainService } from 'src/app/services/main.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detection-deduplication-check',
  templateUrl: './detection-deduplication-check.component.html',
  styleUrls: ['./detection-deduplication-check.component.css']
})
export class DetectionDeduplicationCheckComponent implements OnInit, AfterViewInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  form!: FormGroup;
  showClass: boolean = false;
  disabledDealer = true;
  disabledIdentitas = true;
  disabledRekening = true;
  disabledCreate = true;
  disabledAction = true;
  cek = 0;
  cektwo = 0;
  displayedColumnsDedup: string[] = ['employeeNo', 'dlc', 'dealerName', 'identitas', 'npk', 'namaEmployee', 'status', 'cabangCreator', 'action'];
  dataSource!: MatTableDataSource<DedupElement>;
  namaEmployee: string = '';
  dealer: string = '';
  identitas: string = '';
  noRek: string = '';
  dedup: DedupElement[] = [];
  lisDealer: DealerElement[] = [];
  filteredDealer: any = this.lisDealer;
  branchCode: any;
  token: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DetectionDeduplicationCheckComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.branchCode = this.authUser.profilLocation[0].branch_code;
    this.token = this.authUser.token;
    this.dataSource = new MatTableDataSource(this.dedup);
    this.validateInput();
  }

  @ViewChild('sortCol1') sortCol1!: MatSort;
  @ViewChild('MatPaginator1') MatPaginator1!: MatPaginator;

  ngOnInit(): void {
    this.getDealer();
  }

  validateInput() {
    let alphabets: any = Validators.pattern(/^[a-zA-Z ]*$/);
    let emoji: any = Validators.pattern(/[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]/);
    this.form = this.formBuilder.group(
      {
        employeeName: ['', [alphabets, emoji, Validators.required]]
      },
    );
  }

  onSubmit() {
  }

  getDealer() {
    let parameter = {
      "branchCode": this.branchCode
    }
    this.services.employeeIncentivePost('getListDealer', parameter, catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {
      JSON.stringify(result);
      if (result.body.Data.length > 0 && result.body.Data != null) {
        let tempListCabang = result.body.Data;
        let arrayListCabang: DealerElement[] = [];
        tempListCabang.forEach((element: any) => {
          arrayListCabang.push({ dlc: element.dlc, dealerName: element.dlc + "-" + element.dealerName })
        })
        this.lisDealer = arrayListCabang;
        this.filteredDealer = this.lisDealer;
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          await this.toastrNotif.toastOnNoListDealer();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  detectionDeduplication() {
    let parameter = {
      "nama": this.namaEmployee.toUpperCase(),
      "dlc": "",
      "dealer": "",
      "identitas": "",
      "noRekening": "",
      "branchCode": this.branchCode
    }

    if (this.disabledDealer == false) {
      parameter['dlc'] = this.dealer.substring(0, this.dealer.indexOf("-"));
    } else {
      parameter['dlc'] = "";
    }

    if (this.disabledDealer == false) {
      parameter['dealer'] = this.dealer.substring(this.dealer.indexOf("-") + 1);
    } else {
      parameter['dealer'] = "";
    }

    if (this.disabledIdentitas == false) {
      parameter['identitas'] = this.identitas;
    } else {
      parameter['identitas'] = "";
    }

    if (this.disabledRekening == false) {
      parameter['noRekening'] = this.noRek;
    } else {
      parameter['noRekening'] = "";
    }

    if (parameter['nama'] == '' || this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Mohon isi nama employee terlebih dahulu!'
      });
    }
    else {
      console.log(parameter)
      this.toggleLoading.showLoading(true);
      this.dedup = [];
      this.dataSource = new MatTableDataSource(this.dedup);
      this.services.employeeIncentivePost('dedupEmployee', parameter, catchError(this.handleError.handleErrorDedup.bind(this))).subscribe(result => {
        console.log(result)
        if (result.body.status == 'sukses' && result.body.data != null && result.body.data.length > 0) {
          result.body.data.forEach((element: any) => {
            this.dedup.push({
              employeeNo: element.employeeNo,
              dlc: element.dlc,
              dealerName: element.dealerName,
              identitas: element.docNo,
              npk: element.npk,
              namaEmployee: element.employeeName,
              status: element.employeeStatus,
              cabangCreator: element.branchCreator,
              accountNo: element.accountNo,
              action: element.dataId
            })
            if (result.body.info == '100% Match!') {
              this.cek = 3
            } else {
              this.cek = 0
              this.disabledCreate = false;
            }
          })
          this.dataSource = new MatTableDataSource(this.dedup);
          this.ngAfterViewInit();
          this.disabledCreate = false;
          this.toggleLoading.showLoading(false);
        } else {
          const waitPopUpDone = async () => {
            await this.toastrNotif.toastOnNoDedup();
            this.disabledCreate = false;
            this.ngAfterViewInit();
            this.toggleLoading.showLoading(false);
          }
          waitPopUpDone();
        }
      })
    }
  }

  testButtonCreate() {
    if (this.cek == 3) {
      Swal.fire({
        icon: 'info',
        title: 'Informasi',
        text: 'Employee Sudah Terdaftar!'
      });
    } else {
      this.dialogRef.close();
      this.router.navigate(['/detail-employee/' + this.token]);
    }
  }

  actionEdit(data: any) {
    this.dialogRef.close();
    this.router.navigate(['/detail-employee/' + this.token], {
      queryParams: {
        dataId: data.action,
        idEmployee: data.employeeNo,
        dlc: data.dlc,
        dealerName: data.dealerName,
        identitas: data.identitas,
        npk: data.npk,
        employeeName: data.namaEmployee,
        cabangCreator: data.cabangCreator,
        status: data.status
      },
    });
  }

  disableDealer() {
    let dealer = {
      "dealerDisable": this.disabledDealer
    }
    if (dealer['dealerDisable'] === true) {
      this.disabledDealer = false;
    } else {
      this.disabledDealer = true;
    }
  }

  disableIdentitas() {
    let identitas = {
      "identitasDisabled": this.disabledIdentitas
    }
    if (identitas['identitasDisabled'] === true) {
      this.disabledIdentitas = false;
    } else {
      this.disabledIdentitas = true;
    }
  }

  disableRek() {
    let rekening = {
      "rekeningdisabled": this.disabledRekening
    }
    if (rekening['rekeningdisabled'] === true) {
      this.disabledRekening = false;
    } else {
      this.disabledRekening = true;
    }
  }

  searchDedup(event: Event) {
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sortCol1;
    this.dataSource.paginator = this.MatPaginator1;
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
