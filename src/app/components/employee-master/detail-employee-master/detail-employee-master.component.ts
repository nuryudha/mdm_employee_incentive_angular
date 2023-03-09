import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { FormControl, FormBuilder, FormGroupDirective, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MainService } from 'src/app/services/main.service';
import { DetailEmployee } from 'src/app/models/detail-employee/detail-employee.model';
import { MappingElement } from 'src/app/models/mapping-pekerjaan-dealer/mappingPekerjaanDealer.model';
import { InformasiRekeningElement } from 'src/app/models/informasi-rekening/informasiRekening.model';
import { ApprovalElement } from 'src/app/models//approval/approvalHistory.model';
import { listReviseElement } from 'src/app/models//approval/listRevise.moddel';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { TambahInformasiPekerjaanDealerComponent } from '../detail-employee-master/tambah-informasi-pekerjaan-dealer/tambah-informasi-pekerjaan-dealer.component';
import { EditDetailPekerjaanDealerComponent } from '../detail-employee-master/edit-detail-pekerjaan-dealer/edit-detail-pekerjaan-dealer.component';
import { TambahRekeningComponent } from '../detail-employee-master/tambah-rekening/tambah-rekening.component';
import { UploadDocumentComponent } from '../detail-employee-master/upload-document/upload-document.component';
import { PopupMappingRekComponent } from '../detail-employee-master/popup-mapping-rek/popup-mapping-rek.component';
import { DetailInformasiRekeningComponent } from '../detail-employee-master/detail-informasi-rekening/detail-informasi-rekening.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Router, ActivatedRoute } from '@angular/router';

// tabel dokumen upload
export interface DokumenUploadElement {
  nama: string;
  tanggal: string;
}

@Component({
  selector: 'app-detail-employee-master',
  templateUrl: './detail-employee-master.component.html',
  styleUrls: ['./detail-employee-master.component.css']
})

export class DetailEmployeeMasterComponent implements OnInit, AfterViewInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  //tabel Dokumen Upload
  displayedColumnsDokumenUp: string[] = ['nama', 'tanggal', 'aksi'];
  dataSourceDokumenUp!: MatTableDataSource<DokumenUploadElement>;
  // selection = new SelectionModel<PeriodicElement>(true, []);

  //tabel Mapping
  displayedColumnsMapping: string[] = ['kodePekerjaan', 'keteranganPekerjaan', 'dlc', 'dealerName', 'noRekening', 'atasNama', 'bank', 'status', 'detail', 'aksi'];
  dataSourceMapping!: MatTableDataSource<MappingElement>;

  //tabel Informasi Rek
  displayedColumnsInformasiRek: string[] = ['bankAccount', 'accountNo', 'accountName', 'accountStatus', 'detailRek', 'aksiRek'];
  dataSourceInformasiRek!: MatTableDataSource<InformasiRekeningElement>;

  //tabel Approval
  displayedColumnsApproval: string[] = ['approval', 'pic', 'tanggalApproval', 'statusApproval', 'detail', 'catatan'];
  dataSourceApproval!: MatTableDataSource<ApprovalElement>;

  showClass: boolean = false;
  dokumenUpload: DokumenUploadElement[] = []
  informasiRekning: InformasiRekeningElement[] = [];
  mappingPekerjaanDealer: MappingElement[] = [];
  historyApprroval: ApprovalElement[] = [];

  tanggalTesKtp: any;

  form!: FormGroup;
  formApproval!: FormGroup;
  formJenisDok!: FormGroup;
  radioJenisEmployee: any
  RadioJenisKel: any;
  RadioKepNPWP: any;
  isDisabled = true;

  getDataID: any;
  jenisEmployee: string = '';
  employeeNo: string = '';
  npk: string = '';
  namaEmployee: string = '';
  filterJenisDoc: string = '';
  selectJenisDoc: DetailEmployee[] = [
    { value: '1', view: 'KTP' },
    { value: '2', view: 'KARTU NAMA' },
    { value: '3', view: 'SURAT PERNYATAAN WILAYAH' },
    { value: '4', view: 'SURAT PERNYATAAN DEALER' }
  ]
  identitas: any;
  identitasAll: any;
  jenisKelamin: string = '';
  tempatLahir: string = '';

  lahir: any;
  bulan: any;
  tempTanggalLahir: Date = new Date();
  tanggalLahir: string = '';

  filterAgama: string = '';
  selectAgama: DetailEmployee[] = [
    { value: 'ISLAM', view: 'ISLAM' },
    { value: 'KRISTEN PROTESTAN', view: 'KRISTEN PROTESTAN' },
    { value: 'KATOLIK', view: 'KRISTEN KATOLIK' },
    { value: 'HINDU', view: 'HINDU' },
    { value: 'BUDDHA', view: 'BUDDHA' },
    { value: 'KONGHUCU', view: 'KONGHUCU' }
  ];
  filterEmployeeStatus: string = '';
  selectEmployeeStatus: DetailEmployee[] = [
    { value: 'AKTIF', view: 'TETAP-AKTIF' },
    { value: 'NON AKTIF', view: 'RESIGN-NON AKTIF' }
  ];
  kepemilikanNpwp: string = '';
  npwpNo: any;
  filterNpwpType: string = '';
  selectNpwpType: DetailEmployee[] = [
    { value: 'BADAN', view: 'BADAN' },
    { value: 'PERORANGAN', view: 'PERORANGAN' }
  ];
  filterPkpType: string = '';
  selectPkpType: DetailEmployee[] = [
    { value: 'PKP', view: 'PKP' },
    { value: 'NON PKP', view: 'NON PKP' }
  ];
  noHp: string = '';
  Email: string = '';

  cek: string = 'Perorangan';
  cek2: string = 'badan';

  imageSource: any;
  image: any;
  tipeextension: any;
  nameDoc: any;
  statusGetDok: any;
  pdfSrc = "";
  tanggalTerimaDok: any;

  filterStatusApv: string = '';
  selectStatusApv: DetailEmployee[] = [
    { value: 'APPROVE', view: 'APPROVE' },
    { value: 'REVISE', view: 'REVISE' }
  ]
  listRevise: listReviseElement[] = [];
  filteredRevise: any = this.listRevise;

  dataID: any;
  employeeID: any;
  getDataId: any;
  statusAproval: any;
  mapId: any;
  accountId: any;
  mapIdAktifButton: any;
  statusAktifButton: any;
  rekAktifButton: any;
  statusRekAktifButton: any;

  getNamaEmployee: any;
  getStatusEmployee: any;
  addStatusEmployee: any;

  tanggalTerima: any;

  disableKonfirm: any;
  tambahButton = new FormControl('');

  addForm!: FormGroup;
  nik: any;
  roleUser: any;
  branchCreator: any;
  branchCode: any;
  textBoxDisabled = true;
  formatNpwp: any;
  dataGm: any;
  apvTwo: any;
  incentiveSystem: any;
  disabledNwpwNo: any;
  branchDetail: any;
  filterEmployeeStatusModel: any;
  resultTimeKtp: any;
  resultTimeNpwp: any;
  resultTimeNama: any;
  resultTimeDealer: any;
  token: any;
  differentCab: any;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSourceDokumenUp = new MatTableDataSource(this.dokumenUpload);
    this.dataSourceMapping = new MatTableDataSource(this.mappingPekerjaanDealer);
    this.dataSourceInformasiRek = new MatTableDataSource(this.informasiRekning);
    this.dataSourceApproval = new MatTableDataSource(this.historyApprroval);
    this.validateInput();
    this.branchCode = this.authUser.profilLocation[0].branch_code;
    this.token = this.authUser.token;
    this.nik = this.authUser.profileHeader.nik;
    this.roleUser = this.authUser.profileUserRole;
  }

  @ViewChild('sortCol1') sortCol1!: MatSort;
  @ViewChild('sortCol2') sortCol2!: MatSort;
  @ViewChild('MatPaginator1') MatPaginator1!: MatPaginator;
  @ViewChild('MatPaginator2') MatPaginator2!: MatPaginator;
  @ViewChild('picker2') picker2: any;

  ngOnInit(): void {
    this.paramQuery();
    // this.employeeID = this.dataID
    console.log("============>",this.differentCab)
    this.getDetail();
    this.getDetailImage();
    this.getRekening();
    this.getMapping();
    this.getHistoryApproval();
    this.form.value.jenisEmployee
    if (this.statusAproval == "WAITING APPROVAL 1" || this.statusAproval == "WAITING APPROVAL 2") {
      this.form.controls['jenisEmployee'].disable();
      this.form.controls['namaEmployee'].disable();
      this.form.controls['filterJenisDoc'].disable();
      this.form.controls['identitas'].disable();
      this.form.controls['idenAll'].disable();
      this.form.controls['KartuNama'].disable();
      this.form.controls['SuratPernyataanWilayah'].disable();
      this.form.controls['SuratPernyataanDealer'].disable();
      this.form.controls['jenisKelamin'].disable();
      this.form.controls['tempatLahir'].disable();
      this.form.controls['lahir'].disable();
      this.form.controls['filterAgama'].disable();
      this.form.controls['filterEmployeeStatus'].disable();
      this.form.controls['kepemilikanNpwp'].disable();
      this.form.controls['npwpNo'].disable();
      this.form.controls['filterNpwpType'].disable();
      this.form.controls['filterPkpType'].disable();
      this.form.controls['noHp'].disable();
      this.form.controls['Email'].disable();
      this.form.controls['filterStatusApv'].setValidators([Validators.required]);
    }
    console.log(":status", this.filterEmployeeStatus)
    if (this.filterEmployeeStatus == "APPROVAL") {
      this.form.controls['jenisEmployee'].disable();
      this.form.controls['namaEmployee'].disable();
      this.form.controls['filterJenisDoc'].disable();
      this.form.controls['identitas'].disable();
      this.form.controls['idenAll'].disable();
      this.form.controls['KartuNama'].disable();
      this.form.controls['SuratPernyataanWilayah'].disable();
      this.form.controls['SuratPernyataanDealer'].disable();
      this.form.controls['jenisKelamin'].disable();
      this.form.controls['tempatLahir'].disable();
      this.form.controls['lahir'].disable();
      this.form.controls['filterAgama'].disable();
      this.form.controls['filterEmployeeStatus'].disable();
      this.form.controls['kepemilikanNpwp'].disable();
      this.form.controls['npwpNo'].disable();
      this.form.controls['filterNpwpType'].disable();
      this.form.controls['filterPkpType'].disable();
      this.form.controls['noHp'].disable();
      this.form.controls['Email'].disable();
      this.form.controls['filterStatusApv'].setValidators([Validators.required]);
    }
    // this.getDetailUserLogin();
    this.getListRevise();
    this.jobGM();
    this.differentCabFunc();
    console.log("apv", this.services.apvTwo)
    console.log("statusemploye", this.statusAproval)
    this.services.revTwo
    this.services.apvTwo
  }

  clickListAproval() {
    this.form.controls.alasanRevise.reset();
  }

  open() {
    this.picker2.open();
  }

  disableDealer() {
    let npwpno = {
      "npwpNoDisable": this.disabledNwpwNo
    }
    if (npwpno['npwpNoDisable'] === true) {
      this.disabledNwpwNo = false;
    } else {
      this.disabledNwpwNo = true;
    }
  }

  toggle() {
    this.textBoxDisabled = !this.textBoxDisabled;
    this.form.controls.npwpNo.reset();
    this.form.controls.filterNpwpType.reset();
    this.form.controls.filterPkpType.reset();
    this.form.get('kepemilikanNpwp')?.valueChanges.subscribe(value => {
      if (value == 'TIDAK') {
        // disable the input when new value is true
        this.form.get('npwpNo')?.disable();
        this.form.get('filterNpwpType')?.disable();
        this.form.get('filterPkpType')?.disable();
      } else {
        // (re-)enable the input when new value is false
        this.form.get('npwpNo')?.enable();
        this.form.get('filterNpwpType')?.enable();
        this.form.get('filterPkpType')?.enable();
      }
    })
  }

  resetRadioButton() {
    this.form.controls.namaEmployee.reset();
    this.form.controls.identitas.reset();
    this.form.controls.idenAll.reset();
    this.form.controls.KartuNama.reset();
    this.form.controls.SuratPernyataanWilayah.reset();
    this.form.controls.SuratPernyataanDealer.reset();
    this.form.controls.filterJenisDoc.reset();
    this.form.controls.jenisKelamin.reset();
    this.form.controls.tempatLahir.reset();
    this.form.controls.lahir.reset();
    this.form.controls.filterAgama.reset();
    this.form.controls.filterEmployeeStatus.reset();
    this.form.controls.kepemilikanNpwp.reset();
    this.form.controls.npwpNo.reset();
    this.form.controls.filterNpwpType.reset();
    this.form.controls.filterPkpType.reset();
    this.form.controls.noHp.reset();
    this.form.controls.Email.reset();
  }

  reformat(event: any) {
    if (event.data) {
      event.target.value = event.target.value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6');
    }
  }

  paramQuery() {
    this.route.queryParams
      .subscribe(param => {
        this.dataID = param.dataId,
          this.employeeID = param.dataId,
          this.getDataId = param.getDataID,
          this.employeeNo = param.idEmployee,
          this.npk = param.npk,
          this.namaEmployee = param.employeeName,
          this.identitas = param.identitas,
          this.filterEmployeeStatus = param.status,
          this.statusAproval = param.statusToDoLits,
          this.mapId = param.mapId,
          this.accountId = param.accountId,
          this.mapIdAktifButton = param.mapIdAktifButton,
          this.statusAktifButton = param.statusAktifButton,
          this.rekAktifButton = param.rekAktifButton,
          this.statusRekAktifButton = param.statusRekAktifButton,
          this.addStatusEmployee = param.employeeStatus
      })
  }

  addEventAwal(type: string, event: MatDatepickerInputEvent<Date>) {
    this.tempTanggalLahir = new Date(`${type}: ${event.value}`);
    this.lahir = this.tempTanggalLahir;

    let getBulan = this.lahir.getMonth();
    let namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getBulan = namaBulan[getBulan];
    this.bulan = getBulan;

    this.tanggalLahir = (('0' + this.tempTanggalLahir.getDate()).slice(-2) + '-' + (this.bulan) + '-' + this.tempTanggalLahir.getFullYear()).toString()
  }

  // getDetailUserLogin() {
  //   let parameterUser = {
  //     "nik": this.route.snapshot.paramMap.get('nik'),
  //     "application": "MDMA"
  //   }
  //   this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameterUser).subscribe(result => {
  //     this.branchCode = result.body.resultUserProfileLocation[result.body.resultUserProfileLocation.length - 1].branch_code
  //     // console.log("cek kode", this.branchCode)
  //   })
  // }

  differentCabFunc() {
    // const nik = this.url.split('?')[0].split('/').pop()
    let parameterGetDetailEmployee =
    {
      "id": ""
    }

    if (this.dataID != undefined) {
      parameterGetDetailEmployee['id'] = this.dataID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetDetailEmployee['id'] = this.getDataId;
      if (this.getDataId == undefined) {
        parameterGetDetailEmployee['id'] = '';
      }
    }

    this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {
      if (resultGetEmploye.body.Data) {
        // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameterUser).subscribe(result => {
          // const branchCreator = this.userDetail.resultUserProfileLocation[0].branch_code
          this.roleUser.forEach((element: any) => {
            if (this.branchCode != resultGetEmploye.body.Data[0].branchCreator && resultGetEmploye.body.Data[0].branchCreator != "0000") {
              if (element.role_code == 'INIT_EMPL_INSE_CAB') {
                this.form.controls['jenisEmployee'].disable();
                this.form.controls['namaEmployee'].disable();
                this.form.controls['filterJenisDoc'].disable();
                this.form.controls['identitas'].disable();
                this.form.controls['idenAll'].disable();
                this.form.controls['KartuNama'].disable();
                this.form.controls['SuratPernyataanWilayah'].disable();
                this.form.controls['SuratPernyataanDealer'].disable();
                this.form.controls['jenisKelamin'].disable();
                this.form.controls['tempatLahir'].disable();
                this.form.controls['lahir'].disable();
                this.form.controls['filterAgama'].disable();
                this.form.controls['filterEmployeeStatus'].disable();
                this.form.controls['kepemilikanNpwp'].disable();
                this.form.controls['npwpNo'].disable();
                this.form.controls['filterNpwpType'].disable();
                this.form.controls['filterPkpType'].disable();
                this.form.controls['noHp'].disable();
                this.form.controls['Email'].disable();
                this.differentCab = "differentCab";
                console.error("trus konsidi",this.differentCab)
                console.error("rolenya",element.role_code)
                console.error("branch login",this.branchCreator + "branch detail:",resultGetEmploye.body.Data[0].branchCreator)
              } else if (element.role_code == 'INIT_EMPL_INSE_HO') {
                console.error("trus kondisi",this.differentCab)
                return;
              }
            } else {
              return;
            }
          })
        // })
      }
    })
  }

  getDetail() {
    let parameterGetDetailEmployee =
    {
      "id": ""
    }

    if (this.dataID != undefined) {
      parameterGetDetailEmployee['id'] = this.dataID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetDetailEmployee['id'] = this.getDataId;
      if (this.getDataId == undefined) {
        parameterGetDetailEmployee['id'] = '';
      }
    }
    this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {
      // console.log(resultGetEmploye)
      if (resultGetEmploye.body.Data) {
        this.branchDetail = resultGetEmploye.body.Data[0].branchCreator
        this.form.controls.jenisEmployee.setValue(resultGetEmploye.body.Data[0].employeeType);
        this.form.controls.employeeNo.setValue(resultGetEmploye.body.Data[0].employeeNo);
        this.form.controls.npk.setValue(resultGetEmploye.body.Data[0].npk);
        this.form.controls.namaEmployee.setValue(resultGetEmploye.body.Data[0].employeeName);
        this.namaEmployee = resultGetEmploye.body.Data[0].employeeName;
        this.form.controls.filterJenisDoc.setValue(resultGetEmploye.body.Data[0].documentId);
        this.identitasAll = resultGetEmploye.body.Data[0].documentNo;
        this.form.controls.jenisKelamin.setValue(resultGetEmploye.body.Data[0].gender);
        this.form.controls.tempatLahir.setValue(resultGetEmploye.body.Data[0].birthPlace);
        this.form.controls.lahir.setValue(new Date(resultGetEmploye.body.Data[0].birthDate));
        this.tanggalLahir = resultGetEmploye.body.Data[0].birthDate;
        this.form.controls.filterAgama.setValue(resultGetEmploye.body.Data[0].religion);
        this.form.controls.filterEmployeeStatus.setValue(resultGetEmploye.body.Data[0].employeeStatus);
        if (resultGetEmploye.body.Data[0].npwpNo != null) {
          this.form.controls.kepemilikanNpwp.setValue("YA");
        } else {
          this.form.controls.kepemilikanNpwp.setValue("TIDAK");
        }
        if (this.form.value.kepemilikanNpwp == "TIDAK") {
          this.form.controls['npwpNo'].disable();
          this.form.controls['filterNpwpType'].disable();
          this.form.controls['filterPkpType'].disable();
        }
        this.form.controls.npwpNo.setValue(resultGetEmploye.body.Data[0].npwpNo);
        if (resultGetEmploye.body.Data[0].npwpNo != null) {
          this.formatNpwp = resultGetEmploye.body.Data[0].npwpNo.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6');
        }
        this.form.value.npwpNo = resultGetEmploye.body.Data[0].npwpNo
        this.form.controls.filterNpwpType.setValue(resultGetEmploye.body.Data[0].npwpType);
        this.form.controls.filterPkpType.setValue(resultGetEmploye.body.Data[0].pkpType);
        this.form.controls.noHp.setValue(resultGetEmploye.body.Data[0].phoneNo);
        this.form.controls.Email.setValue(resultGetEmploye.body.Data[0].email);
        this.incentiveSystem = resultGetEmploye.body.Info
        if (resultGetEmploye.body.Info == "1") {
          this.form.controls['filterEmployeeStatus'].disable();
        }
        console.log("info", this.incentiveSystem)
      } else {
        return;
      }
    })
  }

  getDetailImage() {
    this.dokumenUpload = [];
    this.dataSourceDokumenUp = new MatTableDataSource(this.dokumenUpload);
    this.dokumenUpload.push({
      nama: 'KTP',
      tanggal: ''
    }, {
      nama: 'NPWP',
      tanggal: ''
    }, {
      nama: 'KARTU NAMA',
      tanggal: ''
    }, {
      nama: 'SURAT PERNYATAAN DEALER',
      tanggal: ''
    })
    let parameter = {
      "employeeId": "",
      "docName": ''
    }
    if (this.employeeID != undefined) {
      parameter['employeeId'] = this.employeeID;
    } else if (this.getDataId != undefined) {
      parameter['employeeId'] = this.getDataId;
    }

    parameter['docName'] = 'KTP';
    console.log("param=============:", parameter)
    this.services.upload('getDocImageByEmployeeIdAndDocName', parameter, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(resultKtp => {
      parameter['docName'] = 'NPWP';
      this.services.upload('getDocImageByEmployeeIdAndDocName', parameter, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(resultNpwp => {
        parameter['docName'] = 'KARTU NAMA';
        this.services.upload('getDocImageByEmployeeIdAndDocName', parameter, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(resultNama => {
          parameter['docName'] = 'SURAT PERNYATAAN DEALER';
          this.services.upload('getDocImageByEmployeeIdAndDocName', parameter, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(resultDealer => {
            if (resultKtp.body.status == true) {
              this.resultTimeKtp = resultKtp.body.data.docReceivedDate
              if (resultKtp.body.data.docReceivedDate == null) {
                this.resultTimeKtp = 'No Data!'
              }
            } else {
              this.resultTimeKtp = 'No Data!'
            }
            if (resultNpwp.body.status == true) {
              this.resultTimeNpwp = resultNpwp.body.data.docReceivedDate
              if (resultNpwp.body.data.docReceivedDate == null) {
                this.resultTimeNpwp = 'No Data!'
              }
            } else {
              this.resultTimeNpwp = 'No Data!'
            }
            if (resultNama.body.status == true) {
              this.resultTimeNama = resultNama.body.data.docReceivedDate
              if (resultNama.body.data.docReceivedDate == null) {
                this.resultTimeNama = 'No Data!'
              }
            } else {
              this.resultTimeNama = 'No Data!'
            }
            if (resultDealer.body.status == true) {
              this.resultTimeDealer = resultDealer.body.data.docReceivedDate
              if (resultDealer.body.data.docReceivedDate == null) {
                this.resultTimeDealer = 'No Data!'
              }
            } else {
              this.resultTimeDealer = 'No Data!'
            }
            this.dokumenUpload = [];
            this.dataSourceDokumenUp = new MatTableDataSource(this.dokumenUpload);
            this.dokumenUpload.push(
              {
                nama: 'KTP',
                tanggal: this.resultTimeKtp
              }, {
              nama: 'NPWP',
              tanggal: this.resultTimeNpwp
            }, {
              nama: 'KARTU NAMA',
              tanggal: this.resultTimeNama
            }, {
              nama: 'SURAT PERNYATAAN DEALER',
              tanggal: this.resultTimeDealer
            })
          })
        })
      })
    })
  }

  jobGM() {
    let parameterMap =
    {
      "employeeId": ""
    }
    if (this.employeeID != undefined) {
      parameterMap['employeeId'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterMap['employeeId'] = this.getDataId;
    }

    // let parameterUser = {
    //   "nik": this.route.snapshot.paramMap.get('nik'),
    //   "application": "MDMA"
    // }
    this.services.employeeIncentivePost('getListMapJobDealerRek', parameterMap, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultMap => {
      // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameterUser).subscribe(resultGm => {
      console.log(this.roleUser)
      this.roleUser.forEach((element: any) => {
        if (resultMap.body.Data != null && resultMap.body.Data.length > 0) {
          resultMap.body.Data.forEach((elementGm: any) => {
            if (element.role_code == 'INIT_EMPL_INSE_CAB') {
              // console.log()
              if ((elementGm.jobCode == "GMG" || elementGm.jobCode == "OWN" || elementGm.jobCode == "OFF" || elementGm.jobCode == "DIR") &&
                (elementGm.status == "AKTIF")) {
                this.form.controls['jenisEmployee'].disable();
                this.form.controls['namaEmployee'].disable();
                this.form.controls['filterJenisDoc'].disable();
                this.form.controls['identitas'].disable();
                this.form.controls['idenAll'].disable();
                this.form.controls['KartuNama'].disable();
                this.form.controls['SuratPernyataanWilayah'].disable();
                this.form.controls['SuratPernyataanDealer'].disable();
                this.form.controls['jenisKelamin'].disable();
                this.form.controls['tempatLahir'].disable();
                this.form.controls['lahir'].disable();
                this.form.controls['filterAgama'].disable();
                this.form.controls['filterEmployeeStatus'].disable();
                this.form.controls['kepemilikanNpwp'].disable();
                this.form.controls['npwpNo'].disable();
                this.form.controls['filterNpwpType'].disable();
                this.form.controls['filterPkpType'].disable();
                this.form.controls['noHp'].disable();
                this.form.controls['Email'].disable();
                this.dataGm = "DataHoGM"
                console.log("riview")
              } else {
                console.log("gagal")
                return;
              }
            } else {
              console.log("gagal")
              return;
            }
          })
        }
      })
      // })
    })
  }

  validateInput() {
    let alphabets: any = Validators.pattern(/^[a-zA-Z ]*$/);
    let date: any = Validators.pattern(/^(\d{2})-(\d{2})-(\d{4})$/);
    let emoji: any = Validators.pattern(/[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]/);
    this.form = this.formBuilder.group(
      {
        jenisEmployee: ['', [Validators.required]],
        employeeNo: ({ value: '', disabled: this.isDisabled }),
        npk: ({ value: this.npk, disabled: true }),
        namaEmployee: ['', [alphabets, emoji, Validators.required]],
        filterJenisDoc: ['', [Validators.required]],
        idenAll: [''],
        identitas: ['', [Validators.pattern(/^[0-9]*\.?[0-9]*$/), Validators.maxLength(16), Validators.minLength(16)]],
        KartuNama: [''],
        SuratPernyataanWilayah: [''],
        SuratPernyataanDealer: [''],
        jenisKelamin: [''],
        tempatLahir: [''],
        lahir: [''],
        filterAgama: [''],
        filterEmployeeStatus: ['', [Validators.required]],
        kepemilikanNpwp: ['', [Validators.required]],
        npwpNo: ['', [Validators.minLength(15), Validators.maxLength(20)]],
        filterNpwpType: [''],
        filterPkpType: [''],
        noHp: ['', [Validators.pattern(/^[0-9]*\.?[0-9]*$/), Validators.maxLength(13)]],
        Email: ['', [Validators.email, Validators.pattern(/[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]/)]],
        filterStatusApv: [],
        alasanRevise: [],
        catatan: []
      },
    );
    this.form.controls.jenisEmployee.setValue('P');
    if (this.form.value.jenisEmployee == 'P') {
      this.form.controls.jenisKelamin.setValidators([Validators.required]);
      this.form.controls.tempatLahir.setValidators([Validators.required]);
      this.form.controls.lahir.setValidators([Validators.required]);
      this.form.controls.filterAgama.setValidators([Validators.required]);
    } else if (this.form.value.jenisEmployee == 'C') {
      this.form.controls.jenisKelamin.setValidators([]);
      this.form.controls.tempatLahir.setValidators([]);
      this.form.controls.lahir.setValidators([]);
      this.form.controls.filterAgama.setValidators([]);
    }
  }

  dopdownReset() {
    this.identitasAll = "";
  }

  resetForm() {
    this.form.controls.namaEmployee.reset();
    this.form.controls.identitas.reset();
    this.form.controls.idenAll.reset();
    this.form.controls.KartuNama.reset();
    this.form.controls.SuratPernyataanWilayah.reset();
    this.form.controls.SuratPernyataanDealer.reset();
    this.form.controls.filterJenisDoc.reset();
    this.form.controls.jenisKelamin.reset();
    this.form.controls.tempatLahir.reset();
    this.form.controls.lahir.reset();
    this.form.controls.filterAgama.reset();
    this.form.controls.filterEmployeeStatus.reset();
    this.form.controls.kepemilikanNpwp.reset();
    this.form.controls.npwpNo.reset();
    this.form.controls.filterNpwpType.reset();
    this.form.controls.filterPkpType.reset();
    this.form.controls.noHp.reset();
    this.form.controls.Email.reset();
  }

  onSubmit() {
    if (this.form.value.jenisEmployee == 'C') {
      this.form.controls.jenisKelamin.setValidators([]);
      this.form.controls.tempatLahir.setValidators([]);
      this.form.controls.lahir.setValidators([]);
      this.form.controls.filterAgama.setValidators([]);
      this.form.controls.jenisKelamin.reset();
      this.form.controls.tempatLahir.reset();
      this.form.controls.lahir.reset();
      this.form.controls.filterAgama.reset();
    }

    this.radioJenisEmployee = 1;
    this.RadioJenisKel = 1;
    this.RadioKepNPWP = 1;
    console.log("parameter", this.form.value.npwpNo)
    if (this.form.value.kepemilikanNpwp == "YA" && (this.form.value.npwpNo == "" || this.form.value.npwpNo == null)) {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'Nomor NPWP harus diisi!'
      })
    }

    if (this.form.value.filterJenisDoc == "1" && (this.form.value.identitas == "" || this.form.value.identitas == undefined || this.form.value.identitas == null)) {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'Nomor identitas KTP harus diisi!'
      })
    } else if (this.form.value.filterJenisDoc == "3" && (this.form.value.SuratPernyataanWilayah == "" || this.form.value.SuratPernyataanWilayah == undefined || this.form.value.SuratPernyataanWilayah == null)) {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'Nomor identitas Surat Pernyataan Wilayah harus diisi!'
      })
    } else if (this.form.value.filterJenisDoc == "4" && (this.form.value.SuratPernyataanDealer == "" || this.form.value.SuratPernyataanDealer == undefined || this.form.value.SuratPernyataanDealer == null)) {
      Swal.fire({
        icon: 'info',
        title: 'Oops...',
        text: 'Nomor identitas Surat Pernyataan Dealer harus diisi!'
      })
    }

    let parameter = {
      "dataId": "",
      "status": "",
      "employeeType": this.form.value.jenisEmployee.toUpperCase(),
      "employeeNo": "",
      "npk": "",
      "employeeName": this.form.value.namaEmployee.toUpperCase(),
      "documentId": this.form.value.filterJenisDoc,
      "documentNo": "",
      "gender": "",
      "birthPlace": "",
      "birthDate": "",
      "religion": "",
      "employeeStatus": "",
      "npwpNo": "",
      "npwpType": "",
      "pkpType": "",
      "phoneNo": "",
      "email": "",
      "insertBy": "",
      "updateBy": "",
      "branchCreator": ""
    }

    if (this.form.value.filterJenisDoc == "1" ||
      this.form.value.filterJenisDoc == "2" ||
      this.form.value.filterJenisDoc == "3" ||
      this.form.value.filterJenisDoc == "4") {
      parameter['documentNo'] = this.identitasAll;
      if (this.identitasAll == undefined || this.identitasAll == null) {
        parameter['documentNo'] = "";
      }
    }

    if (this.dataID != undefined) {
      parameter['dataId'] = this.dataID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['dataId'] = this.getDataId;
      if (this.getDataId == undefined) {
        parameter['dataId'] = '';
      }
    }

    if (parameter['employeeNo'] == "") {
      parameter['employeeNo'] = this.form.value.employeeNo;
      if (this.form.value.employeeNo == undefined || this.form.value.employeeNo == null) {
        parameter['employeeNo'] = "";
      }
    }

    if (parameter['npk'] == "") {
      parameter['npk'] = this.npk;
      if (this.npk == undefined || this.npk == null) {
        parameter['npk'] = "";
      }
    }

    if (parameter['employeeStatus'] == "") {
      parameter['employeeStatus'] = this.filterEmployeeStatusModel;
      // if (this.form.value.filterEmployeeStatus == undefined || this.form.value.filterEmployeeStatus == null) {
      //   parameter['employeeStatus'] = "";
      // }
    }

    if (this.form.value.kepemilikanNpwp == 'YA') {
      parameter['npwpType'] = this.form.value.filterNpwpType;
      if (this.form.value.filterNpwpType == null || this.form.value.filterNpwpType == undefined) {
        parameter['npwpType'] = "";
      }
    } else {
      parameter['npwpType'] = "";
    }

    if (this.form.value.kepemilikanNpwp == 'YA') {
      parameter['pkpType'] = this.form.value.filterPkpType;
      if (this.form.value.filterPkpType == null || this.form.value.filterPkpType == undefined) {
        parameter['pkpType'] = "";
      }
    } else {
      parameter['pkpType'] = "";
    }

    if (this.form.value.jenisKelamin == null) {
      parameter['gender'] = "";
      parameter['birthPlace'] = "";
      parameter['birthDate'] = "";
      parameter['religion'] = "";
    }
    else {
      parameter['gender'] = this.form.value.jenisKelamin;
      parameter['birthPlace'] = this.form.value.tempatLahir;
      parameter['birthDate'] = this.tanggalLahir;
      parameter['religion'] = this.form.value.filterAgama;
    }

    if (this.form.value.kepemilikanNpwp == 'YA') {
      parameter['npwpNo'] = this.form.value.npwpNo.replace(/[^a-zA-Z0-9 ]/g, '');
      if (this.form.value.npwpNo == null || this.form.value.npwpNo == undefined) {
        parameter['npwpNo'] = "";
      }
    } else {
      parameter['npwpNo'] = "";
    }

    if (parameter['phoneNo'] == "") {
      parameter['phoneNo'] = this.form.value.noHp;
      if (this.form.value.noHp == undefined || this.form.value.noHp == null) {
        parameter['phoneNo'] = "";
      }
    }

    if (parameter['email'] == "") {
      parameter['email'] = this.form.value.Email;
      if (this.form.value.Email == undefined || this.form.value.Email == null) {
        parameter['email'] = "";
      }
    }

    if (parameter['insertBy'] == "") {
      parameter['insertBy'] = this.nik;
      if (this.nik == undefined || this.nik == null) {
        parameter['insertBy'] = "";
      }
    }

    if (parameter['updateBy'] == "") {
      parameter['updateBy'] = this.nik;
      if (this.nik == undefined || this.nik == null) {
        parameter['updateBy'] = "";
      }
    }

    if (parameter['branchCreator'] == "") {
      parameter['branchCreator'] = this.branchCode;
      if (this.branchCode == undefined || this.branchCode == null) {
        parameter['branchCreator'] = "";
      }
    }

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    console.log("parameter Detail Employee", parameter)

    console.log("cek identitas", this.form.value.identitas)
    if (this.form.valid && (parameter['documentNo'] != "" || (this.form.valid && this.form.value.filterJenisDoc == "2" && parameter['documentNo'] == "")) && (this.form.value.kepemilikanNpwp == "TIDAK" || this.form.value.kepemilikanNpwp == "YA" && (this.form.value.npwpNo != null || parameter['npwpType'] != "" || parameter['pkpType'] != ""))) {

      if (parameter['npwpNo'].length <= 14 && this.form.value.kepemilikanNpwp == 'YA') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Format Npwp Invalid!'
        })
      } else if (this.form.value.kepemilikanNpwp == 'YA' && (this.form.value.filterNpwpType == null || this.form.value.filterNpwpType == "")) {
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'NPWP Type tidak boleh kosong!'
        })
      } else if (this.form.value.kepemilikanNpwp == 'YA' && (this.form.value.filterPkpType == null || this.form.value.filterPkpType == "")) {
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'PKP Type tidak boleh kosong!'
        })
      } else if (this.form.value.jenisEmployee == "P" && (parameter['gender'] == "" || parameter['gender'] == null)) {
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'Jenis Kelamin tidak boleh kosong!'
        })
      } else if (this.form.value.jenisEmployee == "P" && (parameter['birthPlace'] == "" || parameter['birthPlace'] == null)) {
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'Tempat Lahir tidak boleh kosong!'
        })
      } else if (this.form.value.jenisEmployee == "P" && (parameter['birthDate'] == "" || parameter['birthDate'] == null)) {
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'Tanggal Lahir tidak boleh kosong!'
        })
      } else if (this.form.value.jenisEmployee == "P" && (parameter['religion'] == "" || parameter['religion'] == null)) {
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          text: 'Agama tidak boleh kosong!'
        })
      }
      else {
        // let parameterUser = {
        //   "nik": this.nik,
        //   "application": "MDMA"
        // }
        // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameterUser).subscribe(result => {
        //   this.branchCreator = result.body.resultUserProfileLocation
        //   this.branchCreator.forEach((element: any) => {
        //     if (element.branch_code) {
        //       parameter['branchCreator'] = element.branch_code;
        //     }
        //   })
        this.toggleLoading.showLoading(true);
        this.services.employeeIncentivePost('insertDataEmployee', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
          console.log("dasdada", result)
          if (result.body.status == 'succes' && result.body.dataId != null) {
            Toast.fire({
              icon: 'success',
              title: 'Berhasil Menyimpan Data'
            })
            // Swal.fire({
            //   position: 'top-end',
            //   icon: 'success',
            //   title: 'Berhasil Menyimpan Data',
            //   showConfirmButton: false,
            //   timer: 2500
            // })
            this.getDataID = result.body.dataId
            this.getNamaEmployee = result.body.employeeName
            this.getStatusEmployee = result.body.employeeStatus
            this.router.navigate(['/detail-employee-auth'], {
              queryParams: {
                getDataID: this.getDataID,
                employeeName: this.getNamaEmployee,
                employeeStatus: this.getStatusEmployee
              },
              queryParamsHandling: 'merge'
            });
            this.toggleLoading.showLoading(false);
          } else if (result.body.status == 'succes' && result.body.dataId == null) {
            Toast.fire({
              icon: 'success',
              title: 'Berhasil Update Data'
            })
            // Swal.fire({
            //   position: 'top-end',
            //   icon: 'success',
            //   title: 'Berhasil Update Data',
            //   showConfirmButton: false,
            //   timer: 2500
            // })
            this.getDetail();
            // console.log("dasdada",result)
            this.toggleLoading.showLoading(false);
          } else if (result.body.status == 'error') {
            Swal.fire({
              icon: 'info',
              title: 'Oops...',
              text: 'Nomor identitas sudah tersedia!'
            })
            this.toggleLoading.showLoading(false);
          }
          // else if (result.body.status == 'info') {
          //   Swal.fire({
          //     icon: 'info',
          //     title: 'Oops...',
          //     text: 'Tidak dapat melakukan edit data employee, karena sedang dalam pengajuan insentif!'
          //   })
          //   this.toggleLoading.showLoading(false);
          // } 
          else {
            const waitPopUpDone = async () => {
              await this.toastrNotif.toastOnInsertEmployee();
              this.ngAfterViewInit();
              this.toggleLoading.showLoading(false);
            }
            waitPopUpDone();
          }
        })
        // })
      }
    }
    else {
      return;
    }
  }

  getDokumen(data: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    let namadok = data.nama;
    // console.log("cek namadok:", namadok)
    let parameter = {
      "employeeId": "",
      "docName": namadok
    }
    if (this.employeeID != undefined) {
      parameter['employeeId'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['employeeId'] = this.getDataId;
    }
    // console.log("param:", parameter)

    this.toggleLoading.showLoading(true);
    this.services.upload('getDocImageByEmployeeIdAndDocName', parameter, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(result => {
      // console.log("get:", result)

      this.statusGetDok = result.body.status
      if (this.statusGetDok == true) {
        this.image = result.body.data.docValue
        this.tipeextension = result.body.data.extension
        this.nameDoc = result.body.data.docName
        this.tanggalTerimaDok = result.body.data.updatedTime
        console.log("this.image:", this.image)
        const byteArray = new Uint8Array(
          atob(this.image)
            .split("")
            .map(char => char.charCodeAt(0))
        );
        if (this.tipeextension == "pdf") {
          // let pdfName = "reports.pdf";
          const file = new Blob([byteArray], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          this.pdfSrc = fileURL;
          window.open(fileURL);
        } else if (this.tipeextension == "png") {
          const file = new Blob([byteArray], { type: "image/png" });
          const fileURL = URL.createObjectURL(file);
          this.pdfSrc = fileURL;
          // window.open(fileURL);
          Swal.fire({
            title: "Nama Dokumen: " + this.nameDoc,
            imageUrl: fileURL,
            imageWidth: 800,
            imageHeight: 300,
            imageAlt: 'Custom image',
          })
        } else if (this.tipeextension == "jpeg") {
          const file = new Blob([byteArray], { type: "image/jpeg" });
          const fileURL = URL.createObjectURL(file);
          this.pdfSrc = fileURL;
          // window.open(fileURL);
          Swal.fire({
            title: "Nama Dokumen: " + this.nameDoc,
            imageUrl: fileURL,
            imageWidth: 800,
            imageHeight: 300,
            imageAlt: 'Custom image',
          })
        } else if (this.tipeextension == "jpg") {
          const file = new Blob([byteArray], { type: "image/jpg" });
          const fileURL = URL.createObjectURL(file);
          this.pdfSrc = fileURL;
          // window.open(fileURL);
          Swal.fire({
            title: "Nama Dokumen: " + this.nameDoc,
            imageUrl: fileURL,
            imageWidth: 800,
            imageHeight: 300,
            imageAlt: 'Custom image',
          })
        }
        this.toggleLoading.showLoading(false);
      } else if (this.statusGetDok == false) {
        Toast.fire({
          icon: 'info',
          title: 'Belum memiliki file dokumen!'
        })
        // Swal.fire({
        //   position: 'top-end',
        //   icon: 'info',
        //   title: 'Belum memiliki file dokumen',
        //   showConfirmButton: false,
        //   timer: 2500
        // })
        this.toggleLoading.showLoading(false);
      }
      else {
        const waitPopUpDone = async () => {
          await this.toastrNotif.toastOnGetDokumen();
          this.ngAfterViewInit();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  flagApv: any;
  flagRev: any;
  getRekening() {
    let parameter =
    {
      "employeeId": ""
    }
    if (this.employeeID != undefined) {
      parameter['employeeId'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['employeeId'] = this.getDataId;
    }
    this.toggleLoading.showLoading(true);
    this.informasiRekning = [];
    this.dataSourceInformasiRek = new MatTableDataSource(this.informasiRekning);
    this.services.employeeIncentivePost('getRekening', parameter, catchError(this.handleError.handleErrorGetRekening.bind(this))).subscribe(result => {
      if (result.body.Data != null && result.body.Data.length > 0) {
        result.body.Data.forEach((element: any) => {
          this.informasiRekning.push({
            bankAccount: element.bankAccount,
            accountNo: element.accountNo,
            accountName: element.accountName,
            accountStatus: element.accountStatus,
            detailRek: element.accountId,
            flag: element.flag,
          })
          if (element.flag == "6") {
            this.flagApv = "6";
          } else if (element.flag == "7") {
            this.flagRev = "7";
          }
        })
        this.dataSourceInformasiRek = new MatTableDataSource(this.informasiRekning);
        this.ngAfterViewInit();
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          this.ngAfterViewInit();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  getMapping() {
    let parameter =
    {
      "employeeId": ""
    }
    if (this.employeeID != undefined) {
      parameter['employeeId'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['employeeId'] = this.getDataId;
    }
    this.toggleLoading.showLoading(true);
    this.mappingPekerjaanDealer = [];
    this.dataSourceMapping = new MatTableDataSource(this.mappingPekerjaanDealer);
    this.services.employeeIncentivePost('getListMapJobDealerRek', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
      if (result.body.Data != null && result.body.Data.length > 0) {
        result.body.Data.forEach((element: any) => {
          this.mappingPekerjaanDealer.push({
            kodePekerjaan: element.jobCode,
            keteranganPekerjaan: element.jobDesc,
            dlc: element.dlc,
            dealerName: element.dealerName,
            noRekening: element.accountNo,
            atasNama: element.accountName,
            bank: element.bankAccount,
            status: element.status,
            detail: element.mapId,
            flag: element.flag
          })
        })
        this.dataSourceMapping = new MatTableDataSource(this.mappingPekerjaanDealer);
        this.ngAfterViewInit();
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          this.ngAfterViewInit();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  buttonAktifAndNonMap(data: any) {
    let mapIdAktifButton = data.detail
    let statusAktifButton = data.status
    if (statusAktifButton == 'AKTIF') {
      Swal.fire({
        icon: 'warning',
        title: this.namaEmployee,
        text: 'Anda yakin untuk melakukan penonaktifan Mapping informasi Pekerjaan, Dealer & Rekening ?',
        cancelButtonText: 'BATAL',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YA',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          let parameter =
          {
            "mapId": mapIdAktifButton
          }
          console.log(parameter)
          this.services.employeeIncentivePost('nonAktifMapping', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
            if (result.body.Status == "200") {
              Swal.fire(
                'Berhasil!',
                'Menunggu approval untuk di Non-Aktifkan.',
                'success'
              ),
                this.getMapping();
            }
            else {
              Swal.fire(
                'Gagal!',
                'Mapping informasi Pekerjaan, Dealer & Rekening gagal di Non-Aktifkan.',
                'error'
              ),
                this.getMapping();
            }
          })
          // window.location.reload();
        } else {
          return;
        }
      })
    } else if (statusAktifButton == 'NON-AKTIF') {
      Swal.fire({
        icon: 'warning',
        title: this.namaEmployee,
        text: 'Anda yakin untuk melakukan pengaktifan Mapping informasi Pekerjaan, Dealer & Rekening ?',
        cancelButtonText: 'BATAL',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YA',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          let parameter =
          {
            "mapId": mapIdAktifButton
          }
          this.services.employeeIncentivePost('aktifMapping', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
            if (result.body.Status == "200") {
              Swal.fire(
                'Berhasil!',
                'Menunggu approval untuk di Aktifkan.',
                'success'
              ),
                this.getMapping();
            } else {
              Swal.fire(
                'Gagal!',
                'Mapping informasi Pekerjaan, Dealer & Rekening gagal di Aktifkan.',
                'error'
              ),
                this.getMapping();
            }
          })
          // window.location.reload();
        }
      })
    }

  }

  buttonAktifAndNonRek(data: any) {
    let rekAktifButton = data.detailRek
    let statusRekAktifButton = data.accountStatus
    if (statusRekAktifButton == 'AKTIF') {
      Swal.fire({
        icon: 'warning',
        title: this.namaEmployee,
        text: 'Anda yakin untuk melakukan penonaktifan Rekening ?',
        cancelButtonText: 'BATAL',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YA',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          let parameter =
          {
            "rekId": rekAktifButton
          }
          console.log(parameter)
          this.services.employeeIncentivePost('nonAktifRekening', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
            if (result.body.Status == "200") {
              Swal.fire(
                'Berhasil!',
                'Menunggu approval untuk di Non-Aktifkan.',
                'success'
              ),
                this.getRekening();
            } else if (result.body.Status == "error") {
              Swal.fire(
                'Informasi!',
                'Rekening anda tidak bisa di Non-Aktifkan karena masih di-mapping di jabatan & dealer yang masih aktif!',
                'info'
              )
            } else {
              Swal.fire(
                'Gagal!',
                'Rekening anda gagal di Non-Aktifkan.',
                'error'
              )
            }
          })
          // window.location.reload();
        } else {
          return;
        }
      })
    } else if (statusRekAktifButton == 'NON-AKTIF') {
      Swal.fire({
        icon: 'warning',
        title: this.namaEmployee,
        text: 'Anda yakin untuk melakukan pengaktifan Rekening ?',
        cancelButtonText: 'BATAL',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YA',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          let parameter =
          {
            "rekId": rekAktifButton
          }
          console.log(parameter)
          this.services.employeeIncentivePost('aktifRekening', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
            if (result.body.Status == "200") {
              Swal.fire(
                'Berhasil!',
                'Menunggu approval untuk di Aktifkan.',
                'success'
              ),
                this.getRekening();
            } else {
              Swal.fire(
                'Gagal!',
                'Rekening anda gagal di Aktifkan.',
                'error'
              ),
                this.getRekening();
            }
          })
          // window.location.reload();
        }
      })
    }
  }

  konfirmasi() {
    let parameter =
    {
      "id": "",
      "branchCreator": this.branchCode
    }
    if (this.employeeID != undefined) {
      parameter['id'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['id'] = this.getDataId;
    }

    let parameterGetDetailEmployee =
    {
      "id": ""
    }
    if (this.employeeID != undefined) {
      parameterGetDetailEmployee['id'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetDetailEmployee['id'] = this.getDataId;
    }

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    console.log("parameter konfirmasi", parameter)
    if (parameter['id'] == undefined || parameter['id'] == null || parameter['id'] == '') {
      Toast.fire({
        icon: 'info',
        title: 'Harap lengkapi <b>Data Employee</b> terlebih dahulu!'
      })
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'error',
      //   title: 'Harap lengkapi <b>Data Employee</b> terlebih dahulu !',
      //   showConfirmButton: false,
      //   timer: 2500
      // })
    } else {
      //tambah kondisi validasi bagi yang madatory
      this.toggleLoading.showLoading(true);
      this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {
        console.log("cek detail employee:", resultGetEmploye)
        const dokumenId = resultGetEmploye.body.Data[0].documentId;
        const npwpNoGet = resultGetEmploye.body.Data[0].npwpNo;
        console.log("cek detail employee:", dokumenId)

        if (dokumenId == "1" || dokumenId == "2" || dokumenId == "3" || dokumenId == "4" || npwpNoGet != null) {
          let parameterGetFile = {
            "employeeId": "",
            "docName": ""
          }
          if (this.employeeID != undefined) {
            parameterGetFile['employeeId'] = this.employeeID;
          } else if (this.getDataId != undefined || this.getDataId != null) {
            parameterGetFile['employeeId'] = this.getDataId;
          }
          if (dokumenId == "1") {
            parameterGetFile['docName'] = "KTP";
          } else if (dokumenId == "2") {
            parameterGetFile['docName'] = "KARTU NAMA";
          } else if (dokumenId == "3") {
            parameterGetFile['docName'] = "SURAT PERNYATAAN WILAYAH";
          } else if (dokumenId == "4") {
            parameterGetFile['docName'] = "SURAT PERNYATAAN DEALER";
          }
          console.log("cek get detail param:", parameterGetFile)
          this.services.upload('getDocImageByEmployeeIdAndDocName', parameterGetFile, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(resultGetFile => {
            const statusGetFile = resultGetFile.body.status;
            console.log("cek status", statusGetFile)
            if (statusGetFile == false && dokumenId == "1") {
              Toast.fire({
                icon: 'info',
                title: 'Harap upload dokumen <b>KTP</b> terlebih dahulu!'
              })
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'error',
              //   title: 'Harap upload dokumen <b>KTP</b> terlebih dahulu !',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              this.toggleLoading.showLoading(false);
            } else if (statusGetFile == false && dokumenId == "2") {
              Toast.fire({
                icon: 'info',
                title: 'Harap upload dokumen <b>Kartu Nama</b> terlebih dahulu!'
              })
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'error',
              //   title: 'Harap upload dokumen <b>Kartu Nama</b> terlebih dahulu !',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              this.toggleLoading.showLoading(false);
            } else if (statusGetFile == false && dokumenId == "4") {
              Toast.fire({
                icon: 'info',
                title: 'Harap upload dokumen <b>Surat Pernyataan Dealer</b> terlebih dahulu!',
              })
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'error',
              //   title: 'Harap upload dokumen <b>Surat Pernyataan Dealer</b> terlebih dahulu !',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              this.toggleLoading.showLoading(false);
            } else if ((statusGetFile == true && (dokumenId == "4" || dokumenId == "3" || dokumenId == "2" || dokumenId == "1")) || (statusGetFile == false && dokumenId == "3")) {
              let parameterGetFileTWO = {
                "employeeId": "",
                "docName": ""
              }
              if (this.employeeID != undefined) {
                parameterGetFileTWO['employeeId'] = this.employeeID;
              } else if (this.getDataId != undefined || this.getDataId != null) {
                parameterGetFileTWO['employeeId'] = this.getDataId;
              }
              if (npwpNoGet != null) {
                parameterGetFileTWO['docName'] = "NPWP";
              }
              console.log("CEK:", parameterGetFileTWO)
              this.services.upload('getDocImageByEmployeeIdAndDocName', parameterGetFileTWO, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(resultGetFileTwo => {
                const statusGetFileTWO = resultGetFileTwo.body.status;
                console.log("resultGetFileTwo:", statusGetFileTWO)
                if (statusGetFileTWO == false && parameterGetFileTWO['docName'] == "NPWP") {
                  Toast.fire({
                    icon: 'info',
                    title: 'Harap upload dokumen <b>NPWP</b> terlebih dahulu!'
                  })
                  // Swal.fire({
                  //   position: 'top-end',
                  //   icon: 'error',
                  //   title: 'Harap upload dokumen <b>NPWP</b> terlebih dahulu !',
                  //   showConfirmButton: false,
                  //   timer: 2500
                  // })
                  this.toggleLoading.showLoading(false);
                } else if (statusGetFileTWO == false && parameterGetFileTWO['docName'] == "") {
                  let parameterRek =
                  {
                    "employeeId": ""
                  }
                  if (this.employeeID != undefined) {
                    parameterRek['employeeId'] = this.employeeID;
                  } else if (this.getDataId != undefined || this.getDataId != null) {
                    parameterRek['employeeId'] = this.getDataId;
                  }
                  this.services.employeeIncentivePost('getRekening', parameterRek, catchError(this.handleError.handleErrorGetRekening.bind(this))).subscribe(resultRek => {
                    if (resultRek.body.Data.length > 0) {
                      let parameterMap =
                      {
                        "employeeId": ""
                      }
                      if (this.employeeID != undefined) {
                        parameterMap['employeeId'] = this.employeeID;
                      } else if (this.getDataId != undefined || this.getDataId != null) {
                        parameterMap['employeeId'] = this.getDataId;
                      }
                      this.services.employeeIncentivePost('getListMapJobDealerRek', parameterMap, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultMap => {
                        if (resultMap.body.Data.length > 0) {
                          this.toggleLoading.showLoading(false);
                          Swal.fire({
                            icon: 'question',
                            title: 'Apakah anda yakin ingin melakukan Konfirmasi dengan Nama Employee berikut?',
                            confirmButtonText: 'YA',
                            cancelButtonText: 'TIDAK',
                            showCancelButton: true,
                            html: `<label style='display:block;'><b><span>${this.namaEmployee}</span><b></label>`,
                            confirmButtonColor: '#f7ad00',
                            reverseButtons: true
                          }).then((result) => {
                            if (result.isConfirmed) {
                              this.toggleLoading.showLoading(true);
                              this.services.employeeIncentivePost('setConfirm', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultData => {
                                console.log(resultData)
                                if (resultData.body.status == "200") {
                                  Toast.fire({
                                    icon: 'success',
                                    title: 'Data Berhasil Di Konfirmasi'
                                  }).then((resultCek) => {
                                    if (resultCek) {
                                      this.router.navigate(['/data-employee/' + this.token]);
                                      window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                      window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                      window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                      this.toggleLoading.showLoading(false);
                                    }
                                  })
                                  // Swal.fire({
                                  //   position: 'top-end',
                                  //   icon: 'success',
                                  //   title: 'Data Berhasil Di Konfirmasi',
                                  //   showConfirmButton: false,
                                  //   timer: 2500
                                  // }).then((resultCek) => {
                                  //   if (resultCek) {
                                  //     this.router.navigate(['/data-employee/' + this.token]);
                                  //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                  //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                  //     window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                  //     this.toggleLoading.showLoading(false);
                                  //   }
                                  // })
                                  // this.disableKonfirm = '0';
                                  // this.getMapping();
                                  this.toggleLoading.showLoading(false);

                                } else if (resultData.body.status == "500") {
                                  Toast.fire({
                                    icon: 'error',
                                    title: 'Gagal Konfirmasi Data Employee!'
                                  })
                                  // Swal.fire({
                                  //   position: 'top-end',
                                  //   icon: 'error',
                                  //   title: 'Gagal Konfirmasi Data Employee!',
                                  //   showConfirmButton: false,
                                  //   timer: 2500
                                  // })
                                  this.toggleLoading.showLoading(false);
                                } else {
                                  Toast.fire({
                                    icon: 'error',
                                    title: 'Gagal Konfirmasi Data Employee!'
                                  })
                                  // Swal.fire({
                                  //   position: 'top-end',
                                  //   icon: 'error',
                                  //   title: 'Gagal Konfirmasi Data Employee!',
                                  //   showConfirmButton: false,
                                  //   timer: 2500
                                  // })
                                  this.toggleLoading.showLoading(false);
                                }
                              })
                            }
                          })
                        } else {
                          Toast.fire({
                            icon: 'info',
                            title: 'Harap lengkapi <b>Data Mapping Pekerjaan, Dealer & Rekening</b> terlebih dahulu!'
                          })
                          // Swal.fire({
                          //   position: 'top-end',
                          //   icon: 'error',
                          //   title: 'Harap lengkapi <b>Data Mapping Pekerjaan, Dealer & Rekening</b> terlebih dahulu !',
                          //   showConfirmButton: false,
                          //   timer: 3000
                          // })
                          this.toggleLoading.showLoading(false);
                        }
                      })
                    } else {
                      Toast.fire({
                        icon: 'info',
                        title: 'Harap lengkapi <b>Data Rekening</b> terlebih dahulu!'
                      })
                      // Swal.fire({
                      //   position: 'top-end',
                      //   icon: 'error',
                      //   title: 'Harap lengkapi <b>Data Rekening</b> terlebih dahulu !',
                      //   showConfirmButton: false,
                      //   timer: 2500
                      // })
                      this.toggleLoading.showLoading(false);
                    }
                  })
                } else if (statusGetFileTWO == true) {
                  let parameterRek =
                  {
                    "employeeId": ""
                  }
                  if (this.employeeID != undefined) {
                    parameterRek['employeeId'] = this.employeeID;
                  } else if (this.getDataId != undefined || this.getDataId != null) {
                    parameterRek['employeeId'] = this.getDataId;
                  }
                  this.services.employeeIncentivePost('getRekening', parameterRek, catchError(this.handleError.handleErrorGetRekening.bind(this))).subscribe(resultRek => {
                    if (resultRek.body.Data.length > 0) {
                      let parameterMap =
                      {
                        "employeeId": ""
                      }
                      if (this.employeeID != undefined) {
                        parameterMap['employeeId'] = this.employeeID;
                      } else if (this.getDataId != undefined || this.getDataId != null) {
                        parameterMap['employeeId'] = this.getDataId;
                      }
                      this.services.employeeIncentivePost('getListMapJobDealerRek', parameterMap, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultMap => {
                        if (resultMap.body.Data.length > 0) {
                          this.toggleLoading.showLoading(false);
                          Swal.fire({
                            icon: 'question',
                            title: 'Apakah anda yakin ingin melakukan Konfirmasi dengan Nama Employee berikut?',
                            confirmButtonText: 'YA',
                            cancelButtonText: 'TIDAK',
                            showCancelButton: true,
                            html: `<label style='display:block;'><b><span>${this.namaEmployee}</span><b></label>`,
                            confirmButtonColor: '#f7ad00',
                            reverseButtons: true
                          }).then((result) => {
                            if (result.isConfirmed) {
                              this.toggleLoading.showLoading(true);
                              this.services.employeeIncentivePost('setConfirm', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultData => {
                                console.log(resultData)
                                if (resultData.body.status == "200") {
                                  Toast.fire({
                                    icon: 'success',
                                    title: 'Data Berhasil Di Konfirmasi'
                                  }).then((resultCek) => {
                                    if (resultCek) {
                                      this.router.navigate(['/data-employee/' + this.token]);
                                      window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                      window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                      window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                      this.toggleLoading.showLoading(false);
                                    }
                                  })
                                  // Swal.fire({
                                  //   position: 'top-end',
                                  //   icon: 'success',
                                  //   title: 'Data Berhasil Di Konfirmasi',
                                  //   showConfirmButton: false,
                                  //   timer: 2500
                                  // }).then((resultCek) => {
                                  //   if (resultCek) {
                                  //     this.router.navigate(['/data-employee/' + this.token]);
                                  //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                  //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                  //     window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                                  //     this.toggleLoading.showLoading(false);
                                  //   }
                                  // })
                                  // this.disableKonfirm = '0';
                                  // this.getMapping();
                                  this.toggleLoading.showLoading(false);

                                } else if (resultData.body.status == "500") {
                                  Toast.fire({
                                    icon: 'error',
                                    title: 'Gagal Konfirmasi Data Employee!'
                                  })
                                  // Swal.fire({
                                  //   position: 'top-end',
                                  //   icon: 'error',
                                  //   title: 'Gagal Konfirmasi Data Employee!',
                                  //   showConfirmButton: false,
                                  //   timer: 2500
                                  // })
                                  this.toggleLoading.showLoading(false);
                                } else {
                                  Toast.fire({
                                    icon: 'error',
                                    title: 'Gagal Konfirmasi Data Employee!'
                                  })
                                  // Swal.fire({
                                  //   position: 'top-end',
                                  //   icon: 'error',
                                  //   title: 'Gagal Konfirmasi Data Employee!',
                                  //   showConfirmButton: false,
                                  //   timer: 2500
                                  // })
                                  this.toggleLoading.showLoading(false);
                                }
                              })
                            }
                          })
                        } else {
                          Toast.fire({
                            icon: 'info',
                            title: 'Harap lengkapi <b>Data Mapping Pekerjaan, Dealer & Rekening</b> terlebih dahulu!'
                          })
                          // Swal.fire({
                          //   position: 'top-end',
                          //   icon: 'error',
                          //   title: 'Harap lengkapi <b>Data Mapping Pekerjaan, Dealer & Rekening</b> terlebih dahulu !',
                          //   showConfirmButton: false,
                          //   timer: 3000
                          // })
                          this.toggleLoading.showLoading(false);
                        }
                      })
                    } else {
                      Toast.fire({
                        icon: 'info',
                        title: 'Harap lengkapi <b>Data Rekening</b> terlebih dahulu!'
                      })
                      // Swal.fire({
                      //   position: 'top-end',
                      //   icon: 'error',
                      //   title: 'Harap lengkapi <b>Data Rekening</b> terlebih dahulu !',
                      //   showConfirmButton: false,
                      //   timer: 2500
                      // })
                      this.toggleLoading.showLoading(false);
                    }
                  })
                } else {
                  Toast.fire({
                    icon: 'error',
                    title: 'Terjadi Masalah Saat Konfirmasi Data Employee!'
                  })
                  // Swal.fire({
                  //   position: 'top-end',
                  //   icon: 'error',
                  //   title: 'Terjadi Masalah Saat Konfirmasi Data Employee!',
                  //   showConfirmButton: false,
                  //   timer: 2500
                  // })
                  this.toggleLoading.showLoading(false);
                }
              })
            }
          })
        }
      })
    }
  }

  konfirmasiApvTwo() {
    console.log("revTwo", this.services.revTwo)
    console.log("apvTwo", this.services.apvTwo)
    let parameter =
    {
      "id": "",
      "branchCreator": this.branchDetail
    }
    if (this.employeeID != undefined) {
      parameter['id'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['id'] = this.getDataId;
    }
    console.log("cek parameter", parameter)
    console.log("flag", this.flagApv)
    console.log("flag", this.flagRev)
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    if (this.flagApv == "6" || this.flagRev == "7") {
      Swal.fire({
        icon: 'question',
        title: 'Apakah anda yakin ingin melakukan Konfirmasi Approval dengan Nama Employee berikut?',
        confirmButtonText: 'YA',
        cancelButtonText: 'TIDAK',
        showCancelButton: true,
        html: `<label style='display:block;'><b><span>${this.namaEmployee}</span></b></label>`,
        confirmButtonColor: '#f7ad00',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.toggleLoading.showLoading(true);
          this.services.employeeIncentivePost('setConfirm', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultData => {
            console.log(resultData)
            console.log("cek parameter", parameter)
            if (resultData.body.status == "200") {
              Toast.fire({
                icon: 'success',
                title: 'Data Berhasil Di Konfirmasi'
              }).then((resultCek) => {
                if (resultCek) {
                  this.router.navigate(['/to-do-list/' + this.token]);
                  window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                  window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                  window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                  this.toggleLoading.showLoading(false);
                }
              })
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'success',
              //   title: 'Data Berhasil Di Konfirmasi',
              //   showConfirmButton: false,
              //   timer: 2500
              // }).then((resultCek) => {
              //   if (resultCek) {
              //     this.router.navigate(['/to-do-list/' + this.token]);
              //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
              //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
              //     window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
              //     this.toggleLoading.showLoading(false);
              //   }
              // })
              // this.disableKonfirm = '0';
              // this.getMapping();
              this.toggleLoading.showLoading(false);

            } else if (resultData.body.status == "500") {
              Toast.fire({
                icon: 'error',
                title: 'Gagal Konfirmasi Data Employee!'
              })
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'error',
              //   title: 'Gagal Konfirmasi Data Employee!',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              this.toggleLoading.showLoading(false);
            } else {
              Toast.fire({
                icon: 'error',
                title: 'Gagal Konfirmasi Data Employee!'
              })
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'error',
              //   title: 'Gagal Konfirmasi Data Employee!',
              //   showConfirmButton: false,
              //   timer: 2500
              // })
              this.toggleLoading.showLoading(false);
            }
          })
        }
      })
    } else {
      Toast.fire({
        icon: 'info',
        title: 'Silahkan Melakukan Approval Rekening Terlebih Dahulu!'
      })
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'info',
      //   title: 'Silahkan Melakukan Approval Rekening Terlebih Dahulu!',
      //   showConfirmButton: false,
      //   timer: 2500
      // })
      this.toggleLoading.showLoading(false);
    }
  }

  getHistoryApproval() {
    let parameter =
    {
      "employeeId": ""
    }
    if (this.employeeID != undefined) {
      parameter['employeeId'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['employeeId'] = this.getDataId;
    }
    this.toggleLoading.showLoading(true);
    this.historyApprroval = [];
    this.dataSourceApproval = new MatTableDataSource(this.historyApprroval);
    this.services.employeeIncentivePost('getViewHistoryApv', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
      if (result.body.Data != null && result.body.Data.length > 0) {
        result.body.Data.forEach((element: any) => {
          if (element.action == "APPROVE") {
            this.historyApprroval.push({
              approval: element.approval,
              pic: element.insertedBy,
              tanggalApproval: element.insertedTime,
              statusApproval: element.action,
              detail: element.detail,
              catatan: element.catatan,
            })
          } else {
            this.historyApprroval.push({
              approval: element.approval,
              pic: element.insertedBy,
              tanggalApproval: element.insertedTime,
              statusApproval: element.action + " - " + element.alasan,
              detail: element.detail,
              catatan: element.catatan,
            })
          }

        })
        this.dataSourceApproval = new MatTableDataSource(this.historyApprroval);
        this.ngAfterViewInit();
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          this.ngAfterViewInit();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  getListRevise() {
    // let parameter = {
    //   "nik": this.nik,
    //   "application": "MDMA"
    // }
    // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameter).subscribe(result => {
    //   this.roleUser = result.body.resultProfileUserRole
    console.log("=======>>>>>>>>>>>>>>>>>>>>>>>>>", this.roleUser)
    this.roleUser.forEach((element: any) => {
      if (element.role_code == 'APPR1_EMPL_INSE_CAB' || element.role_code == 'APPR1_EMPL_INSE_HO') {
        this.services.employeeIncentiveGet('getListRevise', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {
          if (result.body.Data.length > 0 && result.body.Data != null) {
            let tempListRevise = result.body.Data;
            let arrayListRevise: listReviseElement[] = [];
            arrayListRevise.push({ reviseId: tempListRevise[0].reviseId, approverLevel: tempListRevise[0].approverLevel, reviseDesc: tempListRevise[0].reviseDesc })
            arrayListRevise.push({ reviseId: tempListRevise[1].reviseId, approverLevel: tempListRevise[1].approverLevel, reviseDesc: tempListRevise[1].reviseDesc })
            arrayListRevise.push({ reviseId: tempListRevise[2].reviseId, approverLevel: tempListRevise[2].approverLevel, reviseDesc: tempListRevise[2].reviseDesc })
            console.log("cek get revise:", arrayListRevise)
            this.listRevise = arrayListRevise;
            this.filteredRevise = this.listRevise;
            this.toggleLoading.showLoading(false);
          } else {
            const waitPopUpDone = async () => {
              await this.toastrNotif.toastOnNoListRevise();
              this.toggleLoading.showLoading(false);
            }
            waitPopUpDone();
          }
        })
      } else if (element.role_code == 'APPR2_EMPL_INSENTIF') {
        this.services.employeeIncentiveGet('getListRevise', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {
          if (result.body.Data.length > 0 && result.body.Data != null) {
            let tempListRevise = result.body.Data;
            let arrayListRevise: listReviseElement[] = [];
            arrayListRevise.push({ reviseId: tempListRevise[3].reviseId, approverLevel: tempListRevise[3].approverLevel, reviseDesc: tempListRevise[3].reviseDesc })
            arrayListRevise.push({ reviseId: tempListRevise[4].reviseId, approverLevel: tempListRevise[4].approverLevel, reviseDesc: tempListRevise[4].reviseDesc })
            arrayListRevise.push({ reviseId: tempListRevise[5].reviseId, approverLevel: tempListRevise[5].approverLevel, reviseDesc: tempListRevise[5].reviseDesc })
            console.log("cek get revise:", arrayListRevise)
            this.listRevise = arrayListRevise;
            this.filteredRevise = this.listRevise;
            this.toggleLoading.showLoading(false);
          } else {
            const waitPopUpDone = async () => {
              await this.toastrNotif.toastOnNoListRevise();
              this.toggleLoading.showLoading(false);
            }
            waitPopUpDone();
          }
        })
      }
    })
    // })
  }

  onSubmitApprovalOne() {
    let parameter = {
      "historyId": "",
      "employeeId": "",
      "mapId": "",
      "action": this.form.value.filterStatusApv,
      "alasan": "",
      "detail": "",
      "catatan": "",
      "insertedBy": this.nik,
      "updatedBy": this.nik
    }
    console.log("cek param:", parameter)
    if (this.employeeID != undefined) {
      parameter['employeeId'] = this.employeeID;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['employeeId'] = this.getDataId;
    }

    if (parameter['alasan'] == "") {
      parameter['alasan'] = this.form.value.alasanRevise;
      if (this.form.value.alasanRevise == null || this.form.value.alasanRevise == undefined) {
        parameter['alasan'] = "";
      }
    }

    if (parameter['catatan'] == "") {
      parameter['catatan'] = this.form.value.catatan;
      if (this.form.value.catatan == null || this.form.value.catatan == undefined) {
        parameter['catatan'] = "";
      }
    }

    if (parameter['mapId'] == "") {
      parameter['mapId'] = this.mapId;
      if (this.mapId == null || this.mapId == undefined) {
        parameter['mapId'] = "";
      }
    }

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    if (this.form.valid && this.form.value.filterStatusApv == 'REVISE') {
      if (this.form.value.alasanRevise == null) {
        Swal.fire({
          icon: 'info',
          title: 'Oops...',
          html: 'Silahkan Masukkan <b>Alasan Revise!</b>',
        })
      }
      else {
        Swal.fire({
          icon: 'question',
          html: 'Anda yakin untuk melakukan Revise dengan Nama Employee<b> ' + this.namaEmployee + ' </b>?',
          confirmButtonText: 'YA',
          cancelButtonText: 'TIDAK',
          showCancelButton: true,
          confirmButtonColor: '#f7ad00',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.toggleLoading.showLoading(true);
            this.services.employeeIncentivePost('insertHistoryApv1', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
              console.log("cek ketiga", result)
              if (result.body.Status == '200') {
                Toast.fire({
                  icon: 'success',
                  title: 'Berhasil Revise Data'
                }).then((resultCek) => {
                  if (resultCek) {
                    this.router.navigate(['/to-do-list/' + this.token]);
                    window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                    window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                    window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                    this.toggleLoading.showLoading(false);
                  }
                })
                // Swal.fire({
                //   icon: 'success',
                //   title: 'Berhasil Revise Data',
                //   timer: 2000,
                //   showConfirmButton: false
                // }
                // ).then((resultCek) => {
                //   if (resultCek) {
                //     this.router.navigate(['/to-do-list/' + this.token]);
                //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                //     window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                //     this.toggleLoading.showLoading(false);
                //   }
                // })
                this.toggleLoading.showLoading(false);
              } else {
                Toast.fire({
                  icon: 'error',
                  title: 'Gagal Approve Data'
                })
                // Swal.fire({
                //   position: 'top-end',
                //   icon: 'error',
                //   title: 'Gagal Approve Data',
                //   showConfirmButton: false,
                //   timer: 2000
                // })
                this.toggleLoading.showLoading(false);
              }
            })
          }
        })
      }
    }
    else if (this.form.valid && this.form.value.filterStatusApv == 'APPROVE') {
      Swal.fire({
        icon: 'question',
        html: 'Anda yakin untuk melakukan Approval dengan Nama Employee<b> ' + this.namaEmployee + ' </b>?',
        confirmButtonText: 'YA',
        cancelButtonText: 'TIDAK',
        showCancelButton: true,
        confirmButtonColor: '#f7ad00',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.toggleLoading.showLoading(true);
          this.services.employeeIncentivePost('insertHistoryApv1', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
            console.log("cek ketiga", result)
            if (result.body.Status == '200') {
              Toast.fire({
                icon: 'success',
                title: 'Berhasil Approve Data'
              }).then((resultCek) => {
                if (resultCek) {
                  this.router.navigate(['/to-do-list/' + this.token]);
                  window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                  window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                  window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
                  this.toggleLoading.showLoading(false);
                }
              })
              // Swal.fire({
              //   icon: 'success',
              //   title: 'Berhasil Approve Data',
              //   timer: 2000,
              //   showConfirmButton: false
              // }).then((resultCek) => {
              //   if (resultCek) {
              //     this.router.navigate(['/to-do-list/' + this.token]);
              //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-dev.apps.ocp4dev.muf.co.id/#/dashboard/layout');
              //     window.parent.postMessage('PendInse', 'http://mdm-skeleton-uat.apps.ocp4dev.muf.co.id/#/dashboard/layout');
              //     window.parent.postMessage('PendInse', 'http://mdm-skeleton.apps.ocp4dev.muf.co.id/#/dashboard/layout');
              //     this.toggleLoading.showLoading(false);
              //   }
              // })
              this.toggleLoading.showLoading(false);
            } else {
              Toast.fire({
                icon: 'error',
                title: 'Gagal Approve Data'
              })
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'error',
              //   title: 'Gagal Approve Data',
              //   showConfirmButton: false,
              //   timer: 2000
              // })
              this.toggleLoading.showLoading(false);
            }
          })
        }
      })
    }
  }

  ngAfterViewInit() {
    this.dataSourceMapping.sort = this.sortCol1;
    this.dataSourceInformasiRek.sort = this.sortCol2;
    this.dataSourceMapping.paginator = this.MatPaginator1;
    this.dataSourceInformasiRek.paginator = this.MatPaginator2;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMapping.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceMapping.paginator) {
      this.dataSourceMapping.paginator.firstPage();
    }
  }

  searchInformasiRekening(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceInformasiRek.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceInformasiRek.paginator) {
      this.dataSourceInformasiRek.paginator.firstPage();
    }
  }

  //pop up tambah pekerjaan
  openTambahPekerjaan() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "90%";
    dialogConfig.data =
    {
      nik: this.nik,
      dataId: this.dataID,
      getDataId: this.getDataId,
      dataNama: this.namaEmployee,
      accountId: this.accountId,
      statusEmployee: this.addStatusEmployee
    };
    this.dialog.open(TambahInformasiPekerjaanDealerComponent, dialogConfig).afterClosed().subscribe(res => {
      this.getMapping();
      // if (this.getDataId) {
      //   this.getMapping();
      // } else {
      //   window.location.reload();
      // }
    });
  }

  //pop up edit detail pekerjaan
  openEditDetailPekerjaan(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.height = "90%";
    dialogConfig.data =
    {
      nik: this.nik,
      dataId: this.dataID,
      getDataId: this.getDataId,
      dataNama: this.namaEmployee,
      accountId: this.accountId,
      mapId: data.detail,
      kodePekerjaan: data.kodePekerjaan,
      dlc: data.dlc,
      noRekening: data.noRekening,
      atasNama: data.atasNama,
      bank: data.bank,
      statusDetailRek: data.status,
      statusEmployee: this.addStatusEmployee,
      statusDataEmploye: this.filterEmployeeStatus,
      statusApv: this.statusAproval,
      incentiveSystem: this.incentiveSystem,
      differentCab: this.differentCab
    };
    this.dialog.open(EditDetailPekerjaanDealerComponent, dialogConfig).afterClosed().subscribe(res => {
      this.getMapping();
      // if (this.getDataId) {
      //   this.getMapping();
      // } else {
      //   window.location.reload();
      // }
    });
  }

  //pop up Tambah Rekening
  openTambahRekening() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.height = "90%";
    dialogConfig.data =
    {
      nik: this.nik,
      dataId: this.dataID,
      getDataId: this.getDataId,
      dataNama: this.namaEmployee,
      accountId: this.accountId,
      statusEmployee: this.addStatusEmployee
    };
    this.dialog.open(TambahRekeningComponent, dialogConfig).afterClosed().subscribe(res => {
      this.getRekening();
      // if (this.getDataId) {
      //   this.getRekening();
      // } else {
      //   window.location.reload();
      // }
    });
  }

  //pop up Detail Informasi Rekening
  openDetailInformasiRekening(data: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.height = "90%";
    dialogConfig.data =
    {
      nik: this.nik,
      dataId: this.dataID,
      getDataId: this.getDataId,
      dataNama: this.namaEmployee,
      accountIdData: data.detailRek,
      bankAccount: data.bankAccount,
      accountNo: data.accountNo,
      accountName: data.accountName,
      accountStatus: data.accountStatus,
      statusDataEmploye: this.filterEmployeeStatus,
      statusApv: this.statusAproval,
      incentiveSystem: this.incentiveSystem,
      differentCab: this.differentCab
    };
    this.dialog.open(DetailInformasiRekeningComponent, dialogConfig).afterClosed().subscribe(res => {
      this.getRekening();
      // if (this.getDataId) {
      //   this.getRekening();
      // } else {
      //   window.location.reload();
      // }
    });
  }

  //pop up Upload Dokument
  openUploadDocument(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data =
    {
      nik: this.nik,
      dataId: this.dataID,
      getDataId: this.getDataId,
      namaDok: data.nama
    }
    this.dialog.open(UploadDocumentComponent, dialogConfig).afterClosed().subscribe(res => {
      this.getDetailImage();
      // window.location.reload()
      // this.getDokumen();
    });
  }

  //pop up Mapping Rekening
  openMappingRek(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.width = "60%";
    dialogConfig.height = "90%";
    dialogConfig.data =
    {
      nik: this.nik,
      dataId: this.dataID,
      getDataId: this.getDataId,
      dataNama: this.namaEmployee,
      accountId: this.accountId,
      mapId: data.detail,
      kodePekerjaan: data.kodePekerjaan,
      dlc: data.dlc,
      noRekening: data.noRekening,
      atasNama: data.atasNama,
      bank: data.bank
    };
    this.dialog.open(PopupMappingRekComponent, dialogConfig).afterClosed().subscribe(res => {
      // window.location.reload()
      this.getMapping();
    });
  }

  //swalalert
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
}