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
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { data, param } from 'jquery';

// tabel dokumen upload
export interface DokumenUploadElement {
  nama: string;
  value: string;
}

const ELEMENT_DOKUMEN_UPLOAD: DokumenUploadElement[] = [
  { nama: 'KTP', value: 'KTP' },
  { nama: 'NPWP', value: 'NPWP' },
  { nama: 'KARTU NAMA', value: 'KARTU NAMA' },
  { nama: 'SURAT PERNYATAAN DEALER', value: 'SURAT PERNYATAAN DEALER' },
];
@Component({
  selector: 'app-view-monitoring',
  templateUrl: './view-monitoring.component.html',
  styleUrls: ['./view-monitoring.component.css']
})
export class ViewMonitoringComponent implements OnInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  //tabel Dokumen Upload
  displayedColumnsDokumenUp: string[] = ['nama', 'aksi'];
  dataSourceDokumenUp = new MatTableDataSource<DokumenUploadElement>(ELEMENT_DOKUMEN_UPLOAD);
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
  informasiRekning: InformasiRekeningElement[] = [];
  mappingPekerjaanDealer: MappingElement[] = [];
  historyApprroval: ApprovalElement[] = [];

  form!: FormGroup;
  formApproval!: FormGroup;
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
  identitas: string = '';
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
  npwpNo: string = '';
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

  disableKonfirm: any;
  tambahButton = new FormControl('');

  addForm!: FormGroup;
  nik: any;
  roleUser: any;
  branchCreator: any;
  formatNpwp: any;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSourceMapping = new MatTableDataSource(this.mappingPekerjaanDealer);
    this.dataSourceInformasiRek = new MatTableDataSource(this.informasiRekning);
    this.dataSourceApproval = new MatTableDataSource(this.historyApprroval);
    this.validateInput();
    this.nik = this.authUser.profileHeader.nik;
    this.roleUser = this.authUser.profileUserRole;
    this.dataSourceMapping.filterPredicate = (data: any, filter: string) => {
      return data.dlc.includes(filter);
    };
    this.dataSourceMapping.filter = "012146";
  }

  @ViewChild('sortCol1') sortCol1!: MatSort;
  @ViewChild('sortCol2') sortCol2!: MatSort;
  @ViewChild('MatPaginator1') MatPaginator1!: MatPaginator;
  @ViewChild('MatPaginator2') MatPaginator2!: MatPaginator;

  ngOnInit(): void {
    // this.nik = this.route.snapshot.paramMap.get('nik');
    this.paramQuery();
    this.employeeID = this.dataID
    this.getDetail();
    this.getRekening();
    this.getMapping();
    this.getHistoryApproval();
    this.getListRevise();
    this.form.value.jenisEmployee
    this.form.controls['jenisEmployee'].disable();
    this.form.controls['namaEmployee'].disable();
    this.form.controls['filterJenisDoc'].disable();
    this.form.controls['identitas'].disable();
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

  getDetail() {
    let parameterGetDetailEmployee =
    {
      "id": this.dataID
    }
    console.log("cek:", parameterGetDetailEmployee)
    this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {
      if (resultGetEmploye.body.Data) {
        this.form.controls.jenisEmployee.setValue(resultGetEmploye.body.Data[0].employeeType);
        this.form.controls.employeeNo.setValue(resultGetEmploye.body.Data[0].employeeNo);
        this.form.controls.npk.setValue(resultGetEmploye.body.Data[0].npk);
        this.form.controls.namaEmployee.setValue(resultGetEmploye.body.Data[0].employeeName);
        this.namaEmployee = resultGetEmploye.body.Data[0].employeeName;
        this.form.controls.filterJenisDoc.setValue(resultGetEmploye.body.Data[0].documentId);
        this.form.controls.identitas.setValue(resultGetEmploye.body.Data[0].documentNo);
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
        this.form.controls.npwpNo.setValue(resultGetEmploye.body.Data[0].npwpNo);
        if (resultGetEmploye.body.Data[0].npwpNo != null) {
          this.formatNpwp = resultGetEmploye.body.Data[0].npwpNo.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6');
        }
        this.form.value.npwpNo = resultGetEmploye.body.Data[0].npwpNo
        console.log(this.form.value.npwpNo)
        console.log(this.form.controls.npwpNo)

        this.form.controls.filterNpwpType.setValue(resultGetEmploye.body.Data[0].npwpType);
        this.form.controls.filterPkpType.setValue(resultGetEmploye.body.Data[0].pkpType);
        this.form.controls.noHp.setValue(resultGetEmploye.body.Data[0].phoneNo);
        this.form.controls.Email.setValue(resultGetEmploye.body.Data[0].email);
      } else {
        return;
      }
    })
  }
  masterDealer: any;
  dealerId: any;
  paramQuery() {
    this.route.queryParams
      .subscribe(param => {
        this.dataID = param.dataId,
          this.employeeID = param.dataID,
          this.getDataId = param.getDataID,
          this.form.controls.employeeNo.setValue(param.idEmployee),
          this.employeeNo = param.idEmployee,
          this.form.controls.npk.setValue(param.npk),
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
          this.addStatusEmployee = param.employeeStatus,
          this.masterDealer = param.masterId,
          this.dealerId = param.dealerId
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

  validateInput() {
    let alphabets: any = Validators.pattern(/^[a-zA-Z ]*$/);
    let date: any = Validators.pattern(/^(\d{2})-(\d{2})-(\d{4})$/);
    let emoji: any = Validators.pattern(/[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]/);
    this.form = this.formBuilder.group(
      {
        jenisEmployee: ['', [Validators.required]],
        employeeNo: ({ value: this.employeeNo, disabled: this.isDisabled }),
        npk: ({ value: this.npk, disabled: true }),
        namaEmployee: ['', [alphabets, emoji, Validators.required]],
        filterJenisDoc: ['', [Validators.required]],
        identitas: ['', [Validators.pattern(/^[0-9]*\.?[0-9]*$/), Validators.maxLength(15)]],
        jenisKelamin: [''],
        tempatLahir: [''],
        lahir: [''],
        filterAgama: [''],
        filterEmployeeStatus: ({ value: this.filterEmployeeStatus }),
        kepemilikanNpwp: ['', [Validators.required]],
        npwpNo: [],
        filterNpwpType: [],
        filterPkpType: [],
        noHp: ['', [Validators.pattern(/^[0-9]*\.?[0-9]*$/), Validators.maxLength(13)]],
        Email: ['', [Validators.email]],
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

  resetForm() {
    // this.form.controls.namaEmployee.reset();
    // this.form.controls.identitas.reset();
    // this.form.controls.filterJenisDoc.reset();
    // this.form.controls.jenisKelamin.reset();
    // this.form.controls.tempatLahir.reset();
    // this.form.controls.lahir.reset();
    // this.form.controls.filterAgama.reset();
    // this.form.controls.filterEmployeeStatus.reset();
    // this.form.controls.kepemilikanNpwp.reset();
    // this.form.controls.npwpNo.reset();
    // this.form.controls.filterNpwpType.reset();
    // this.form.controls.filterPkpType.reset();
    // this.form.controls.noHp.reset();
    // this.form.controls.Email.reset();
  }

  onSubmit() {
    // if (this.form.value.jenisEmployee == 'C') {
    //   this.form.controls.jenisKelamin.setValidators([]);
    //   this.form.controls.tempatLahir.setValidators([]);
    //   this.form.controls.lahir.setValidators([]);
    //   this.form.controls.filterAgama.setValidators([]);
    //   this.form.controls.jenisKelamin.reset();
    //   this.form.controls.tempatLahir.reset();
    //   this.form.controls.lahir.reset();
    //   this.form.controls.filterAgama.reset();
    // }
    // this.radioJenisEmployee = 1;
    // this.RadioJenisKel = 1;
    // this.RadioKepNPWP = 1;
    // if (this.form.value.filterJenisDoc == "1" && (this.form.value.identitas == "" || this.form.value.identitas == undefined || this.form.value.identitas == null)) {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'Oops...',
    //     text: 'Nomor identitas KTP harus diisi!'
    //   })
    // } else if (this.form.value.filterJenisDoc == "3" && (this.form.value.identitas == "" || this.form.value.identitas == undefined || this.form.value.identitas == null)) {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'Oops...',
    //     text: 'Nomor identitas Surat Pernyataan Wilayah harus diisi!'
    //   })
    // } else if (this.form.value.filterJenisDoc == "4" && (this.form.value.identitas == "" || this.form.value.identitas == undefined || this.form.value.identitas == null)) {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'Oops...',
    //     text: 'Nomor identitas Surat Pernyataan Dealer harus diisi!'
    //   })
    // }

    // if (this.form.valid && this.form.value.identitas != "" || (this.form.valid && this.form.value.filterJenisDoc == "2" && this.form.value.identitas == "")) {
    //   let parameter = {
    //     "dataId": "",
    //     "status": "",
    //     "employeeType": this.form.value.jenisEmployee.toUpperCase(),
    //     "employeeNo": "",
    //     "npk": "",
    //     "employeeName": this.form.value.namaEmployee.toUpperCase(),
    //     "documentId": this.form.value.filterJenisDoc,
    //     "documentNo": "",
    //     "gender": "",
    //     "birthPlace": "",
    //     "birthDate": "",
    //     "religion": "",
    //     "employeeStatus": "",
    //     "npwpNo": "",
    //     "npwpType": "",
    //     "pkpType": "",
    //     "phoneNo": "",
    //     "email": "",
    //     "insertBy": "",
    //     "updateBy": "",
    //     "branchCreator": ""
    //   }

    //   if (this.form.value.filterJenisDoc == "1" ||
    //     this.form.value.filterJenisDoc == "2" ||
    //     this.form.value.filterJenisDoc == "3" ||
    //     this.form.value.filterJenisDoc == "4") {
    //     parameter['documentNo'] = this.form.value.identitas;
    //     if (this.form.value.identitas == undefined) {
    //       parameter['documentNo'] = "";
    //     }
    //   }

    //   if (this.dataID != undefined) {
    //     parameter['dataId'] = this.dataID;
    //   } else if (this.dataID == undefined) {
    //     parameter['dataId'] = this.getDataId;
    //     if (this.getDataId == undefined) {
    //       parameter['dataId'] = '';
    //     }
    //   }

    //   if (parameter['employeeNo'] == "") {
    //     parameter['employeeNo'] = this.employeeNo;
    //     if (this.employeeNo == undefined || this.employeeNo == null) {
    //       parameter['employeeNo'] = "";
    //     }
    //   }

    //   if (parameter['npk'] == "") {
    //     parameter['npk'] = this.npk;
    //     if (this.npk == undefined || this.npk == null) {
    //       parameter['npk'] = "";
    //     }
    //   }

    //   if (parameter['employeeStatus'] == "") {
    //     parameter['employeeStatus'] = this.form.value.filterEmployeeStatus;
    //     if (this.form.value.filterEmployeeStatus == undefined || this.form.value.filterEmployeeStatus == null) {
    //       parameter['employeeStatus'] = "";
    //     }
    //   }

    //   if (parameter['npwpType'] == "") {
    //     parameter['npwpType'] = this.form.value.filterNpwpType;
    //     if (this.form.value.filterNpwpType == null || this.form.value.filterNpwpType == undefined) {
    //       parameter['npwpType'] = "";
    //     }
    //   }

    //   if (parameter['pkpType'] == "") {
    //     parameter['pkpType'] = this.form.value.filterPkpType;
    //     if (this.form.value.filterPkpType == null || this.form.value.filterPkpType == undefined) {
    //       parameter['pkpType'] = "";
    //     }
    //   }

    //   if (this.jenisEmployee == 'P') {
    //     parameter['gender'] = this.form.value.jenisKelamin.toUpperCase();
    //     parameter['birthPlace'] = this.form.value.tempatLahir.toUpperCase();
    //     parameter['birthDate'] = this.tanggalLahir;
    //     parameter['religion'] = this.form.value.filterAgama.toUpperCase();
    //   } else {
    //     parameter['gender'] = this.form.value.jenisKelamin.toUpperCase();
    //     parameter['birthPlace'] = this.form.value.tempatLahir.toUpperCase();
    //     parameter['birthDate'] = this.tanggalLahir;
    //     parameter['religion'] = this.form.value.filterAgama.toUpperCase();
    //   }

    //   if (this.form.value.kepemilikanNpwp == 'YA') {
    //     parameter['npwpNo'] = this.form.value.npwpNo;
    //     if (this.form.value.npwpNo == null || this.form.value.npwpNo == undefined) {
    //       parameter['npwpNo'] = "";
    //     }
    //   }

    //   if (parameter['phoneNo'] == "") {
    //     parameter['phoneNo'] = this.form.value.noHp;
    //     if (this.form.value.noHp == undefined || this.form.value.noHp == null) {
    //       parameter['phoneNo'] = "";
    //     }
    //   }

    //   if (parameter['email'] == "") {
    //     parameter['email'] = this.form.value.Email;
    //     if (this.form.value.Email == undefined || this.form.value.Email == null) {
    //       parameter['email'] = "";
    //     }
    //   }

    //   if (parameter['insertBy'] == "") {
    //     parameter['insertBy'] = this.nik;
    //     if (this.nik == undefined || this.nik == null) {
    //       parameter['insertBy'] = "";
    //     }
    //   }

    //   if (parameter['updateBy'] == "") {
    //     parameter['updateBy'] = this.nik;
    //     if (this.nik == undefined || this.nik == null) {
    //       parameter['updateBy'] = "";
    //     }
    //   }
    //   // console.log("parameter",parameter)
    //   let parameterUser = {
    //     "nik": this.nik,
    //     "application": "MDMA"
    //   }
    //   this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameterUser).subscribe(result => {
    //     this.branchCreator = result.body.resultUserProfileLocation
    //     this.branchCreator.forEach((element: any) => {
    //       if (element.branch_code) {
    //         parameter['branchCreator'] = element.branch_code;
    //       }
    //     })
    //     this.toggleLoading.showLoading(true);
    //     this.services.employeeIncentivePost('insertDataEmployee', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
    //       if (result.body.status == 'succes' && result.body.dataId != null) {
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'success',
    //           title: 'Berhasil Menyimpan Data',
    //           showConfirmButton: false,
    //           timer: 1500
    //         })
    //         this.getDataID = result.body.dataId
    //         this.getNamaEmployee = result.body.employeeName
    //         this.getStatusEmployee = result.body.employeeStatus
    //         this.router.navigate(['/detail-employee/' + this.nik], {
    //           queryParams: {
    //             getDataID: this.getDataID,
    //             employeeName: this.getNamaEmployee,
    //             employeeStatus: this.getStatusEmployee
    //           },
    //         });
    //         this.toggleLoading.showLoading(false);
    //       } else if (result.body.status == 'succes' && result.body.dataId == null) {
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'success',
    //           title: 'Berhasil Update Data',
    //           showConfirmButton: false,
    //           timer: 1500
    //         })
    //         console.log("dasdada", result)
    //         this.toggleLoading.showLoading(false);
    //       } else if (result.body.status == 'error') {
    //         Swal.fire({
    //           icon: 'info',
    //           title: 'Oops...',
    //           text: 'Nomor identitas sudah tersedia!'
    //         })
    //         this.toggleLoading.showLoading(false);
    //       } else {
    //         const waitPopUpDone = async () => {
    //           await this.toastrNotif.toastOnInsertEmployee();
    //           this.ngAfterViewInit();
    //           this.toggleLoading.showLoading(false);
    //         }
    //         waitPopUpDone();
    //       }
    //     })
    //   })
    // }
    // else {
    //   return;
    // }
  }

  getDokumen(data: any) {
    this.toggleLoading.showLoading(true);
    let namadok = data.nama;
    // console.log("cek namadok:", namadok)
    let parameter = {
      "employeeId": "",
      "docName": namadok
    }
    if (this.employeeID == undefined) {
      parameter['employeeId'] = this.getDataId;
    } else if (this.getDataId == undefined) {
      parameter['employeeId'] = this.employeeID;
    }
    // console.log("param:", parameter)
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
        Swal.fire({
          position: 'top-end',
          icon: 'info',
          title: 'Belum memiliki file dokumen',
          showConfirmButton: false,
          timer: 1500
        })
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

  getRekening() {
    let parameter =
    {
      "employeeId": ""
    }
    if (this.employeeID == undefined) {
      parameter['employeeId'] = this.getDataId;
    } else if (this.getDataId == undefined) {
      parameter['employeeId'] = this.employeeID;
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
            flag: element.flag
          })
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
    if (this.employeeID == undefined) {
      parameter['employeeId'] = this.getDataId;
    } else if (this.getDataId == undefined) {
      parameter['employeeId'] = this.employeeID;
    }
    this.toggleLoading.showLoading(true);
    this.mappingPekerjaanDealer = [];
    this.dataSourceMapping = new MatTableDataSource(this.mappingPekerjaanDealer);
    this.services.employeeIncentivePost('getListMapJobDealerRek', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
      console.log("Dealer id", this.dealerId)
      console.log("Master Dealer", this.masterDealer)
      if (result.body.Data != null && result.body.Data.length > 0) {
        if (this.masterDealer == "MD") {
          result.body.Data.forEach((element: any) => {
            if (element.dlc == this.dealerId) {
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
            }
          })
          this.dataSourceMapping = new MatTableDataSource(this.mappingPekerjaanDealer);
          this.ngAfterViewInit();
          this.toggleLoading.showLoading(false);
        } else {
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
        }
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
    // let mapIdAktifButton = data.detail
    // let statusAktifButton = data.status
    // Swal.fire({
    //   icon: 'warning',
    //   title: this.namaEmployee,
    //   text: 'Anda yakin untuk melakukan penonaktifan atau aktifkan data ?',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes!'
    // }).then((result) => {
    //   if (result.isConfirmed && statusAktifButton == 'AKTIF') {
    //     let parameter =
    //     {
    //       "mapId": mapIdAktifButton
    //     }
    //     this.services.employeeIncentivePost('nonAktifMapping', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
    //       if (result.body.Status == "200") {
    //         Swal.fire(
    //           'Deleted!',
    //           'File Anda berhasil di Non-Aktifkan.',
    //           'success'
    //         ),
    //           this.getMapping();
    //       } else {
    //         Swal.fire(
    //           'Deleted!',
    //           'File Anda gagal di Non-Aktifkan.',
    //           'error'
    //         ),
    //           this.getMapping();
    //       }
    //     })
    //     // window.location.reload();
    //   }
    //   else if (result.isConfirmed && statusAktifButton == 'NON-AKTIF') {
    //     let parameter =
    //     {
    //       "mapId": mapIdAktifButton
    //     }
    //     this.services.employeeIncentivePost('aktifMapping', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
    //       if (result.body.Status == "200") {
    //         Swal.fire(
    //           'Deleted!',
    //           'File Anda berhasil di Aktifkan.',
    //           'success'
    //         ),
    //           this.getMapping();
    //       } else {
    //         Swal.fire(
    //           'Deleted!',
    //           'File Anda gagal di Aktifkan.',
    //           'error'
    //         ),
    //           this.getMapping();
    //       }
    //     })
    //     // window.location.reload();
    //   }
    // })
  }

  buttonAktifAndNonRek(data: any) {
    // let rekAktifButton = data.detailRek
    // let statusRekAktifButton = data.accountStatus
    // Swal.fire({
    //   icon: 'warning',
    //   title: this.namaEmployee,
    //   text: 'Anda yakin untuk melakukan penonaktifan atau aktifkan data ?',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes!'
    // }).then((result) => {
    //   if (result.isConfirmed && statusRekAktifButton == 'AKTIF') {
    //     let parameter =
    //     {
    //       "rekId": rekAktifButton
    //     }
    //     this.services.employeeIncentivePost('nonAktifRekening', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
    //       if (result.body.Status == "200") {
    //         Swal.fire(
    //           'Deleted!',
    //           'File Anda berhasil di Non-Aktifkan.',
    //           'success'
    //         ),
    //           this.getRekening();
    //       } else {
    //         Swal.fire(
    //           'Deleted!',
    //           'File Anda gagal di Non-Aktifkan.',
    //           'error'
    //         ),
    //           this.getRekening();
    //       }
    //     })
    //     // window.location.reload();
    //   }
    //   else if (result.isConfirmed && statusRekAktifButton == 'NON-AKTIF') {
    //     Swal.fire(
    //       'Success!',
    //       'Your Rekening has been activated.',
    //       'success'
    //     )
    //     let parameter =
    //     {
    //       "rekId": rekAktifButton
    //     }
    //     this.services.employeeIncentivePost('aktifRekening', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
    //       if (result.body.Status == "200") {
    //         Swal.fire(
    //           'Deleted!',
    //           'File Anda berhasil di Aktifkan.',
    //           'success'
    //         ),
    //           this.getRekening();
    //       } else {
    //         Swal.fire(
    //           'Deleted!',
    //           'File Anda gagal di Aktifkan.',
    //           'error'
    //         ),
    //           this.getRekening();
    //       }
    //     })
    //     // window.location.reload();
    //   }
    // })
  }

  konfirmasi() {
    // let parameter =
    // {
    //   "id": ""
    // }
    // if (this.employeeID == undefined) {
    //   parameter['id'] = this.getDataId;
    // } else if (this.getDataId == undefined) {
    //   parameter['id'] = this.employeeID;
    // }

    // let parameterGetDetailEmployee =
    // {
    //   "id": ""
    // }
    // if (this.employeeID == undefined) {
    //   parameterGetDetailEmployee['id'] = this.getDataId;
    // } else if (this.getDataId == undefined) {
    //   parameterGetDetailEmployee['id'] = this.employeeID;
    // }


    // if (this.getDataId == undefined) {
    //   Swal.fire({
    //     position: 'top-end',
    //     icon: 'error',
    //     title: 'Harap lengkapi data employee',
    //     showConfirmButton: false,
    //     timer: 1500
    //   })
    // } else {
    //   this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {
    //     console.log("cek detail employee:", resultGetEmploye)
    //     const dokumenId = resultGetEmploye.body.Data[0].documentId;
    //     const npwpNoGet = resultGetEmploye.body.Data[0].npwpNo;
    //     console.log("cek detail employee:", dokumenId)

    //     if (dokumenId == "1" || dokumenId == "2" || dokumenId == "4" || npwpNoGet != null) {
    //       let parameterGetFile = {
    //         "employeeId": "",
    //         "docName": ""
    //       }
    //       if (this.employeeID == undefined) {
    //         parameterGetFile['employeeId'] = this.getDataId;
    //       } else if (this.getDataId == undefined) {
    //         parameterGetFile['employeeId'] = this.employeeID;
    //       }
    //       if (dokumenId == "1") {
    //         parameterGetFile['docName'] = "KTP";
    //       } else if (dokumenId == "2") {
    //         parameterGetFile['docName'] = "KARTU NAMA";
    //       } else if (dokumenId == "4") {
    //         parameterGetFile['docName'] = "SURAT PERNYATAAN DEALER";
    //       }
    //       console.log("cek get detail param:", parameterGetFile)
    //       this.services.upload('getDocImageByEmployeeIdAndDocName', parameterGetFile, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(resultGetFile => {
    //         const statusGetFile = resultGetFile.body.status;
    //         console.log("cek status", statusGetFile)
    //         if (statusGetFile == false && dokumenId == "1") {
    //           Swal.fire({
    //             position: 'top-end',
    //             icon: 'error',
    //             title: 'Harap upload dokumen KTP',
    //             showConfirmButton: false,
    //             timer: 1500
    //           })
    //         } else if (statusGetFile == false && dokumenId == "2") {
    //           Swal.fire({
    //             position: 'top-end',
    //             icon: 'error',
    //             title: 'Harap upload dokumen Kartu Nama',
    //             showConfirmButton: false,
    //             timer: 1500
    //           })
    //         } else if (statusGetFile == false && dokumenId == "4") {
    //           Swal.fire({
    //             position: 'top-end',
    //             icon: 'error',
    //             title: 'Harap upload dokumen Surat Pernyataan Dealer',
    //             showConfirmButton: false,
    //             timer: 1500
    //           })
    //         } else if (statusGetFile == true && (dokumenId == "4" || dokumenId == "2" || dokumenId == "1")) {
    //           let parameterGetFileTWO = {
    //             "employeeId": "",
    //             "docName": ""
    //           }
    //           if (this.employeeID == undefined) {
    //             parameterGetFileTWO['employeeId'] = this.getDataId;
    //           } else if (this.getDataId == undefined) {
    //             parameterGetFileTWO['employeeId'] = this.employeeID;
    //           }
    //           if (npwpNoGet != null) {
    //             parameterGetFileTWO['docName'] = "NPWP";
    //           }
    //           console.log("CEK:", parameterGetFileTWO)
    //           this.services.upload('getDocImageByEmployeeIdAndDocName', parameterGetFileTWO, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(resultGetFileTwo => {
    //             const statusGetFileTWO = resultGetFileTwo.body.status;
    //             console.log("resultGetFileTwo:", resultGetFileTwo)
    //             if (statusGetFileTWO == false && parameterGetFileTWO['docName'] == "NPWP") {
    //               Swal.fire({
    //                 position: 'top-end',
    //                 icon: 'error',
    //                 title: 'Harap upload NPWP',
    //                 showConfirmButton: false,
    //                 timer: 1500
    //               })
    //             } else if (statusGetFileTWO == false && parameterGetFileTWO['docName'] == "") {
    //               this.toggleLoading.showLoading(true);
    //               this.services.employeeIncentivePost('setConfirm', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
    //                 if (result.body.Status == "200") {
    //                   Swal.fire({
    //                     position: 'top-end',
    //                     icon: 'success',
    //                     title: 'Data Berhasil Di Konfirmasi',
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                   })
    //                   this.form.controls['jenisEmployee'].disable();
    //                   this.form.controls['namaEmployee'].disable();
    //                   this.form.controls['filterJenisDoc'].disable();
    //                   this.form.controls['identitas'].disable();
    //                   this.form.controls['jenisKelamin'].disable();
    //                   this.form.controls['tempatLahir'].disable();
    //                   this.form.controls['lahir'].disable();
    //                   this.form.controls['filterAgama'].disable();
    //                   this.form.controls['filterEmployeeStatus'].disable();
    //                   this.form.controls['kepemilikanNpwp'].disable();
    //                   this.form.controls['npwpNo'].disable();
    //                   this.form.controls['filterNpwpType'].disable();
    //                   this.form.controls['filterPkpType'].disable();
    //                   this.form.controls['noHp'].disable();
    //                   this.form.controls['Email'].disable();
    //                   this.disableKonfirm = '0';
    //                   this.getMapping();
    //                   this.router.navigate(['/data-employee/' + this.nik]);
    //                   this.toggleLoading.showLoading(false);

    //                 } else if (result.body.status == "500") {
    //                   Swal.fire({
    //                     position: 'top-end',
    //                     icon: 'info',
    //                     title: 'Gagal Konfirmasi',
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                   })
    //                   this.toggleLoading.showLoading(false);
    //                 } else {
    //                   const waitPopUpDone = async () => {
    //                     // await this.toastrNotif.toastOnNoSearchEmployee();
    //                     this.ngAfterViewInit();
    //                     this.toggleLoading.showLoading(false);
    //                   }
    //                   waitPopUpDone();
    //                 }
    //               })
    //             } else if (statusGetFileTWO == true) {
    //               this.toggleLoading.showLoading(true);
    //               this.services.employeeIncentivePost('setConfirm', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
    //                 if (result.body.Status == "200") {
    //                   Swal.fire({
    //                     position: 'top-end',
    //                     icon: 'success',
    //                     title: 'Data Berhasil Di Konfirmasi',
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                   })
    //                   this.form.controls['jenisEmployee'].disable();
    //                   this.form.controls['namaEmployee'].disable();
    //                   this.form.controls['filterJenisDoc'].disable();
    //                   this.form.controls['identitas'].disable();
    //                   this.form.controls['jenisKelamin'].disable();
    //                   this.form.controls['tempatLahir'].disable();
    //                   this.form.controls['lahir'].disable();
    //                   this.form.controls['filterAgama'].disable();
    //                   this.form.controls['filterEmployeeStatus'].disable();
    //                   this.form.controls['kepemilikanNpwp'].disable();
    //                   this.form.controls['npwpNo'].disable();
    //                   this.form.controls['filterNpwpType'].disable();
    //                   this.form.controls['filterPkpType'].disable();
    //                   this.form.controls['noHp'].disable();
    //                   this.form.controls['Email'].disable();
    //                   this.disableKonfirm = '0';
    //                   this.getMapping();
    //                   this.router.navigate(['/data-employee/' + this.nik]);
    //                   this.toggleLoading.showLoading(false);

    //                 } else if (result.body.status == "500") {
    //                   Swal.fire({
    //                     position: 'top-end',
    //                     icon: 'info',
    //                     title: 'Gagal Konfirmasi',
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                   })
    //                   this.toggleLoading.showLoading(false);
    //                 } else {
    //                   const waitPopUpDone = async () => {
    //                     // await this.toastrNotif.toastOnNoSearchEmployee();
    //                     this.ngAfterViewInit();
    //                     this.toggleLoading.showLoading(false);
    //                   }
    //                   waitPopUpDone();
    //                 }
    //               })
    //             }
    //           })


    //         }

    //       })
    //     }




    //   })

















    // }

  }

  getHistoryApproval() {
    let parameter =
    {
      "employeeId": ""
    }
    if (this.employeeID == undefined) {
      parameter['employeeId'] = this.getDataId;
    } else if (this.getDataId == undefined) {
      parameter['employeeId'] = this.employeeID;
    }
    this.toggleLoading.showLoading(true);
    this.historyApprroval = [];
    this.dataSourceApproval = new MatTableDataSource(this.historyApprroval);
    this.services.employeeIncentivePost('getViewHistoryApv', parameter, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(result => {
      if (result.body.Data != null && result.body.Data.length > 0) {
        result.body.Data.forEach((element: any) => {
          this.historyApprroval.push({
            approval: element.approval,
            pic: element.insertedBy,
            tanggalApproval: element.insertedTime,
            statusApproval: element.action,
            detail: element.detail,
            catatan: element.catatan,
          })
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
    //   // console.log("cekrole:", this.roleUser)
    //   // console.log("cekrole:", result)
    //   this.roleUser.forEach((element: any) => {
    //     if (element.role_code == 'APPR1_EMPL_INSE_CAB' || element.role_code == 'APPR1_EMPL_INSE_HO') {
    //       this.services.employeeIncentiveGet('getListRevise', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {
    //         if (result.body.Data.length > 0 && result.body.Data != null) {
    //           let tempListRevise = result.body.Data;
    //           let arrayListRevise: listReviseElement[] = [];
    //           arrayListRevise.push({ reviseId: tempListRevise[0].reviseId, approverLevel: tempListRevise[0].approverLevel, reviseDesc: tempListRevise[0].reviseDesc })
    //           arrayListRevise.push({ reviseId: tempListRevise[1].reviseId, approverLevel: tempListRevise[1].approverLevel, reviseDesc: tempListRevise[1].reviseDesc })
    //           arrayListRevise.push({ reviseId: tempListRevise[2].reviseId, approverLevel: tempListRevise[2].approverLevel, reviseDesc: tempListRevise[2].reviseDesc })
    //           console.log("cek get revise:", arrayListRevise)
    //           this.listRevise = arrayListRevise;
    //           this.filteredRevise = this.listRevise;
    //           this.toggleLoading.showLoading(false);
    //         } else {
    //           const waitPopUpDone = async () => {
    //             await this.toastrNotif.toastOnNoListDealer();
    //             this.toggleLoading.showLoading(false);
    //           }
    //           waitPopUpDone();
    //         }
    //       })
    //     } else if (element.role_code == 'APPR2_EMPL_INSENTIF') {
    //       this.services.employeeIncentiveGet('getListRevise', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {
    //         if (result.body.Data.length > 0 && result.body.Data != null) {
    //           let tempListRevise = result.body.Data;
    //           let arrayListRevise: listReviseElement[] = [];
    //           arrayListRevise.push({ reviseId: tempListRevise[3].reviseId, approverLevel: tempListRevise[3].approverLevel, reviseDesc: tempListRevise[3].reviseDesc })
    //           arrayListRevise.push({ reviseId: tempListRevise[4].reviseId, approverLevel: tempListRevise[4].approverLevel, reviseDesc: tempListRevise[4].reviseDesc })
    //           arrayListRevise.push({ reviseId: tempListRevise[5].reviseId, approverLevel: tempListRevise[5].approverLevel, reviseDesc: tempListRevise[5].reviseDesc })
    //           console.log("cek get revise:", arrayListRevise)
    //           this.listRevise = arrayListRevise;
    //           this.filteredRevise = this.listRevise;
    //           this.toggleLoading.showLoading(false);
    //         } else {
    //           const waitPopUpDone = async () => {
    //             await this.toastrNotif.toastOnNoListDealer();
    //             this.toggleLoading.showLoading(false);
    //           }
    //           waitPopUpDone();
    //         }
    //       })
    //     }
    //   })
    // })
  }

  onSubmitApprovalOne() {
    // let parameter = {
    //   "historyId": "",
    //   "employeeId": "",
    //   "mapId": "",
    //   "action": this.form.value.filterStatusApv,
    //   "alasan": "",
    //   "detail": "",
    //   "catatan": "",
    //   "insertedBy": this.nik,
    //   "updatedBy": this.nik
    // }
    // console.log("cek param:", parameter)
    // if (this.employeeID == undefined) {
    //   parameter['employeeId'] = this.getDataId;
    // } else if (this.getDataId == undefined) {
    //   parameter['employeeId'] = this.employeeID;
    // }

    // if (parameter['alasan'] == "") {
    //   parameter['alasan'] = this.form.value.alasanRevise;
    //   if (this.form.value.alasanRevise == null || this.form.value.alasanRevise == undefined) {
    //     parameter['alasan'] = "";
    //   }
    // }

    // if (parameter['catatan'] == "") {
    //   parameter['catatan'] = this.form.value.catatan;
    //   if (this.form.value.catatan == null || this.form.value.catatan == undefined) {
    //     parameter['catatan'] = "";
    //   }
    // }

    // if (parameter['mapId'] == "") {
    //   parameter['mapId'] = this.mapId;
    //   if (this.mapId == null || this.mapId == undefined) {
    //     parameter['mapId'] = "";
    //   }
    // }

    // if (this.form.valid && this.form.value.filterStatusApv == 'REVISE') {
    //   if (this.form.value.alasanRevise == null) {
    //     Swal.fire({
    //       icon: 'info',
    //       title: 'Oops...',
    //       html: 'Silahkan Masukkan <b>Alasan Revise!</b>',
    //     })
    //   }
    //   else {
    //     this.toggleLoading.showLoading(true);
    //     this.services.employeeIncentivePost('insertHistoryApv1', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
    //       console.log("cek kedua", result)
    //       if (result.body.Status == '200') {
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'success',
    //           title: 'Berhasil Approve Data',
    //           showConfirmButton: false,
    //           timer: 1500
    //         })
    //         this.router.navigate(['/to-do-list/' + this.nik]);
    //         this.toggleLoading.showLoading(false);
    //         // this.ngOnInit();
    //       } else {
    //         Swal.fire({
    //           position: 'top-end',
    //           icon: 'error',
    //           title: 'Gagal Approve Data',
    //           showConfirmButton: false,
    //           timer: 1500
    //         })
    //         this.toggleLoading.showLoading(false);
    //       }
    //     })
    //   }
    // }
    // else if (this.form.valid && this.form.value.filterStatusApv == 'APPROVE') {
    //   this.toggleLoading.showLoading(true);
    //   this.services.employeeIncentivePost('insertHistoryApv1', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
    //     console.log("cek ketiga", result)
    //     if (result.body.Status == '200') {
    //       Swal.fire({
    //         position: 'top-end',
    //         icon: 'success',
    //         title: 'Berhasil Approve Data',
    //         showConfirmButton: false,
    //         timer: 1500,
    //       })
    //       this.router.navigate(['/to-do-list/' + this.nik]);
    //       this.toggleLoading.showLoading(false);
    //       // this.ngOnInit();
    //     } else {
    //       Swal.fire({
    //         position: 'top-end',
    //         icon: 'error',
    //         title: 'Gagal Approve Data',
    //         showConfirmButton: false,
    //         timer: 1500
    //       })
    //       this.toggleLoading.showLoading(false);
    //     }
    //   })
    // }
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
