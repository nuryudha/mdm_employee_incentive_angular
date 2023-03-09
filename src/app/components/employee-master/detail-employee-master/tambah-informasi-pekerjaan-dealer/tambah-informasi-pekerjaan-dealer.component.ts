import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TambahPekerjaanElement } from 'src/app/models/mapping-pekerjaan-dealer/mapping-pekerjaan-dealer.model';
import { DealerElement } from 'src/app/models/data-employee-incentive/searchDealer.model';
import { listBankElement, listDocElement } from 'src/app/models/informasi-rekening/listBankandDoc.model';
import { listJobElement } from 'src/app/models/mapping-pekerjaan-dealer/getListJob.model';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { MainService } from 'src/app/services/main.service';
import { catchError } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { param } from 'jquery';
import Swal from 'sweetalert2'
import { Element } from '@angular/compiler';
import { AnonymousSubject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-tambah-informasi-pekerjaan-dealer',
  templateUrl: './tambah-informasi-pekerjaan-dealer.component.html',
  styleUrls: ['./tambah-informasi-pekerjaan-dealer.component.css']
})

export class TambahInformasiPekerjaanDealerComponent implements OnInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  displayedColumnsTambahPekerjaan: string[] = ['kodeJob', 'deskJob', 'kodeDealer', 'namaDealer', 'alamatDealer', 'aksi'];
  dataSourceMapping!: MatTableDataSource<TambahPekerjaanElement>;

  form!: FormGroup;
  cek!: FormGroup;

  showClass: boolean = false;
  tambahPekerjaanElement: TambahPekerjaanElement[] = [];

  bulan: any;
  tempTanggalTerima: Date = new Date();
  tanggalTerima: string = '';

  pilihDokumen: any;
  lisDealer: DealerElement[] = [];
  filteredDealer: any = this.lisDealer;
  listDoc: listDocElement[] = [];
  filteredDoc: any = this.listDoc;
  listJob: listJobElement[] = [];
  filteredJob: any = this.listJob;
  dealer: string = '';
  dataId: any;
  getDataId: any;
  dataNama: string = '';
  accountId: any;
  mapId: any;
  addStatusEmployee: any;
  addDisableDelete: any;
  disableAdd: any;
  nik: any;
  lengthMapId: any;
  roleUser: any;
  statusEmploye: any;
  statusGetDok: any;
  nameDoc: any;
  tanggalTerimaDok: any;
  pdfSrc: any;

  imageSource: any;
  image: any;
  tipeextension: any;
  extension: any;
  namaFile: any;
  sizeFile: any;
  imageSrc: any;
  sellersPermitFile: any;
  sellersPermitString: string = '';
  finalJson = {};
  getJobDealer: any;
  getJobDealerTmp: any;
  jobcodekosong: any;
  branchCode: any;
  saveGetMap: any;
  saveGetMapTmp: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<TambahInformasiPekerjaanDealerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataSourceMapping = new MatTableDataSource(this.tambahPekerjaanElement);
    this.validateInput();
    this.branchCode = this.authUser.profilLocation[0].branch_code;
    this.nik = this.authUser.profileHeader.nik;
    this.roleUser = this.authUser.profileUserRole;
  }

  @ViewChild('sortCol') sortCol!: MatSort;
  @ViewChild('MatPaginator') MatPaginator!: MatPaginator;
  @ViewChild('picker4') picker4: any;

  ngOnInit(): void {
    this.getDealer();
    this.getListDoc();
    this.dataId = this.data.dataId;
    this.getDataId = this.data.getDataId;
    this.dataNama = this.data.dataNama;
    this.accountId = this.data.accountId;
    this.addStatusEmployee = this.data.statusEmployee;
    this.form.controls.namaEmployee.setValue(this.dataNama);
    this.getListMap();
    this.getListJob();
  }

  open() {
    this.picker4.open();
  }

  validateInput() {
    let alphabets: any = Validators.pattern(/^[a-zA-Z ]*$/);
    //let date: any = Validators.pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    let emoji: any = Validators.pattern(/[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]/);
    this.form = this.formBuilder.group(
      {
        namaEmployee: ({ value: this.dataNama, disabled: true }),
        filterPekerjaan: ['', [Validators.required]],
        namaDealer: ['', [Validators.required]],
        namaDokumen: ['', [Validators.required]],
        tanggalTerima: ['', [Validators.required]],
        pilihDokumen: ['', [Validators.required]]
      },
    );
  }

  addEventAwal(type: string, event: MatDatepickerInputEvent<Date>) {
    this.tempTanggalTerima = new Date(`${type}: ${event.value}`);
    this.form.value.tanggalTerima = this.tempTanggalTerima;

    let getBulan = this.form.value.tanggalTerima.getMonth();
    let namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getBulan = namaBulan[getBulan];
    this.bulan = getBulan;

    this.tanggalTerima = (('0' + this.tempTanggalTerima.getDate()).slice(-2) + '-' + (this.bulan) + '-' + this.tempTanggalTerima.getFullYear()).toString()
  }

  getListJob() {
    // let parameter = {
    //   "nik": this.data.nik,
    //   "application": "MDMA"
    // }
    let parameterGetDetailEmployee =
    {
      "id": ""
    }

    if (this.dataId != undefined) {
      parameterGetDetailEmployee['id'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetDetailEmployee['id'] = this.getDataId;
    }
    // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameter).subscribe(result => {
      this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {
        // this.roleUser = result.body.resultProfileUserRole
        if (resultGetEmploye.body.Data) {
          this.statusEmploye = resultGetEmploye.body.Data[0].status;
        } else {
          return;
        }
        if (this.statusEmploye == '0') {
          this.roleUser.forEach((element: any) => {
            // this.services.employeeIncentivePost('getListMapJobDealerRek', parameterGetMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultGet => {
            this.services.employeeIncentiveGet('getListJob', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(resultJob => {
              if (element.role_code == 'INIT_EMPL_INSE_HO' && element.role_code == 'INIT_EMPL_INSE_CAB') {
                this.toggleLoading.showLoading(true);

                if (resultJob.body.Data.length > 0 && resultJob.body.Data != null) {
                  let tempListJob = resultJob.body.Data;
                  let arrayListJob: listJobElement[] = [];
                  tempListJob.forEach((element: any) => {
                    arrayListJob.push({ jobCode: element.jobCode, jobDescription: element.jobCode + " - " + element.jobDescription })
                  })

                  this.listJob = arrayListJob;
                  this.filteredJob = this.listJob;
                  this.toggleLoading.showLoading(false);
                } else {
                  const waitPopUpDone = async () => {
                    await this.toastrNotif.toastOnNoListJob();
                    this.toggleLoading.showLoading(false);
                  }
                  waitPopUpDone();
                }

              }
              else if (element.role_code == 'INIT_EMPL_INSE_HO') {
                this.toggleLoading.showLoading(true);
                // this.services.employeeIncentiveGet('getListJob', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(resultJob => {
                if (resultJob.body.Data.length > 0 && resultJob.body.Data != null) {
                  let tempListJob = resultJob.body.Data;
                  let arrayListJob: listJobElement[] = [];
                  arrayListJob.push({ jobCode: tempListJob[1].jobCode, jobDescription: tempListJob[1].jobCode + " - " + tempListJob[1].jobDescription })
                  arrayListJob.push({ jobCode: tempListJob[4].jobCode, jobDescription: tempListJob[4].jobCode + " - " + tempListJob[4].jobDescription })
                  arrayListJob.push({ jobCode: tempListJob[3].jobCode, jobDescription: tempListJob[3].jobCode + " - " + tempListJob[3].jobDescription })
                  arrayListJob.push({ jobCode: tempListJob[2].jobCode, jobDescription: tempListJob[2].jobCode + " - " + tempListJob[2].jobDescription })
                  this.listJob = arrayListJob;
                  this.filteredJob = this.listJob;
                  this.toggleLoading.showLoading(false);
                } else {
                  const waitPopUpDone = async () => {
                    await this.toastrNotif.toastOnNoListJob();
                    this.toggleLoading.showLoading(false);
                  }
                  waitPopUpDone();
                }
                // })
              }
              else if (element.role_code == 'INIT_EMPL_INSE_CAB') {
                this.toggleLoading.showLoading(true);
                // this.services.employeeIncentiveGet('getListJob', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(resultJob => {
                if (resultJob.body.Data.length > 0 && resultJob.body.Data != null) {
                  let tempListJob = resultJob.body.Data;
                  let arrayListJob: listJobElement[] = [];
                  arrayListJob.push({ jobCode: tempListJob[5].jobCode, jobDescription: tempListJob[5].jobCode + " - " + tempListJob[5].jobDescription })
                  arrayListJob.push({ jobCode: tempListJob[6].jobCode, jobDescription: tempListJob[6].jobCode + " - " + tempListJob[6].jobDescription })
                  arrayListJob.push({ jobCode: tempListJob[0].jobCode, jobDescription: tempListJob[0].jobCode + " - " + tempListJob[0].jobDescription })
                  this.listJob = arrayListJob;
                  this.filteredJob = this.listJob;
                  this.toggleLoading.showLoading(false);
                } else {
                  const waitPopUpDone = async () => {
                    await this.toastrNotif.toastOnNoListJob();
                    this.toggleLoading.showLoading(false);
                  }
                  waitPopUpDone();
                }
                // })
              }
            })
            // })
          })
        } else {
          this.roleUser.forEach((element: any) => {
            // this.services.employeeIncentivePost('getListMapJobDealerRek', parameterGetMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultGet => {
            this.services.employeeIncentiveGet('getListJob', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(resultJob => {
              if (element.role_code == 'INIT_EMPL_INSE_HO') {
                this.toggleLoading.showLoading(true);

                if (resultJob.body.Data.length > 0 && resultJob.body.Data != null) {
                  let tempListJob = resultJob.body.Data;
                  let arrayListJob: listJobElement[] = [];
                  tempListJob.forEach((element: any) => {
                    arrayListJob.push({ jobCode: element.jobCode, jobDescription: element.jobCode + " - " + element.jobDescription })
                  })

                  this.listJob = arrayListJob;
                  this.filteredJob = this.listJob;
                  this.toggleLoading.showLoading(false);
                } else {
                  const waitPopUpDone = async () => {
                    await this.toastrNotif.toastOnNoListJob();
                    this.toggleLoading.showLoading(false);
                  }
                  waitPopUpDone();
                }

              }
              else if (element.role_code == 'INIT_EMPL_INSE_CAB') {
                this.toggleLoading.showLoading(true);
                // this.services.employeeIncentiveGet('getListJob', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(resultJob => {
                if (resultJob.body.Data.length > 0 && resultJob.body.Data != null) {
                  let tempListJob = resultJob.body.Data;
                  let arrayListJob: listJobElement[] = [];
                  arrayListJob.push({ jobCode: tempListJob[5].jobCode, jobDescription: tempListJob[5].jobCode + " - " + tempListJob[5].jobDescription })
                  arrayListJob.push({ jobCode: tempListJob[6].jobCode, jobDescription: tempListJob[6].jobCode + " - " + tempListJob[6].jobDescription })
                  arrayListJob.push({ jobCode: tempListJob[0].jobCode, jobDescription: tempListJob[0].jobCode + " - " + tempListJob[0].jobDescription })
                  this.listJob = arrayListJob;
                  this.filteredJob = this.listJob;
                  this.toggleLoading.showLoading(false);
                } else {
                  const waitPopUpDone = async () => {
                    await this.toastrNotif.toastOnNoListJob();
                    this.toggleLoading.showLoading(false);
                  }
                  waitPopUpDone();
                }
                // })
              }
            })
            // })
          })
        }
      })
    // })
  }
  
  getDealer() {
    // let parameterUser = {
    //   "nik": this.nik,
    //   "application": "MDMA"
    // }
    // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameterUser).subscribe(result => {
      // this.branchCode = result.body.resultUserProfileLocation[0].branch_code
      console.log(this.branchCode)
      let parameter = {
        "branchCode": this.branchCode
      }
      this.services.employeeIncentivePost('getListDealer', parameter, catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {
        JSON.stringify(result);
        if (result.body.Data.length > 0 && result.body.Data != null) {
          let tempListCabang = result.body.Data;
          let arrayListCabang: DealerElement[] = [];
          tempListCabang.forEach((element: any) => {
            arrayListCabang.push({ dlc: element.dlc, dealerName: element.dlc + " - " + element.dealerName })
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
    // })
  }

  getListDoc() {
    this.services.employeeIncentiveGet('getDocMap', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {

      if (result.body.Data.length > 0 && result.body.Data != null) {
        let tempListDoc = result.body.Data;
        let arrayListDoc: listDocElement[] = [];
        tempListDoc.forEach((element: any) => {
          arrayListDoc.push({ docTypeName: element.docTypeName })
        })

        this.listDoc = arrayListDoc;
        this.filteredDoc = this.listDoc;
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          await this.toastrNotif.toastOnNoListDoc();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  resetForm() {
    this.form.controls.filterPekerjaan.reset();
    this.form.controls.namaDealer.reset();
    this.form.controls.namaDokumen.reset();
    this.form.controls.tanggalTerima.reset();
    this.form.controls.pilihDokumen.reset();
  }

  addPictures() {
    this.finalJson = {
      "sellersPermitFile": this.sellersPermitString
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    let extension = ''
    let namaFile = ''
    extension = file.name.replace(/^.*\./, '').toLowerCase();
    namaFile = file.name.toUpperCase();
    let cekNama = [] = namaFile.split(".");
    console.log("nama File", cekNama[0]);
    console.log("extension", extension);
    console.log("file", file);
    this.extension = extension
    this.namaFile = cekNama[0]
    this.sellersPermitFile = file;
    this.handleInputChange(file);
    this.sizeFile = file.size
  }
  handleInputChange(files: any) {
    var file = files;
    var pattern = files;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e: any) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);
    this.sellersPermitString = base64result;

    // console.log('convert', this.sellersPermitString);
  }

  onSubmit() {
    this.pilihDokumen = 1;
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
    if (this.form.valid) {
      if (this.extension == "pdf" || this.extension == "png" || this.extension == "jpeg" || this.extension == "jpg") {
        if (this.sizeFile > 2000000) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Size dokumen melebihi size maksimal. Maksimal 2MB!'
          })
        } else if (this.sizeFile < 2000000) {
          let parameter = {
            "mapId": "",
            "jobCode": this.form.value.filterPekerjaan,
            "dlc": this.form.value.namaDealer,
            "documentName": this.form.value.namaDokumen,
            "docReceivedDate": this.tanggalTerima,
            "documentPath": "",
            "bankAccount": "",
            "accountNo": "",
            "accountName": "",
            "insertedBy": "",
            "updatedBy": "",
            "employeeId": "",
            "accountId": ""
          }
          if (this.dataId != undefined) {
            parameter['employeeId'] = this.dataId;
          } else if (this.getDataId != undefined || this.getDataId != null) {
            parameter['employeeId'] = this.getDataId;
          }

          if (parameter['insertedBy'] == "") {
            parameter['insertedBy'] = this.nik;
            if (this.nik == undefined || this.nik == null) {
              parameter['insertedBy'] = "";
            }
          }

          if (parameter['updatedBy'] == "") {
            parameter['updatedBy'] = this.nik;
            if (this.nik == undefined || this.nik == null) {
              parameter['updatedBy'] = "";
            }
          }

          let parameterGetMap = {
            "employeeId": ""
          }
          if (this.dataId != undefined) {
            parameterGetMap['employeeId'] = this.dataId;
          } else if (this.getDataId != undefined || this.getDataId != null) {
            parameterGetMap['employeeId'] = this.getDataId;
          }

          let parameterGetDetailEmployee =
          {
            "id": ""
          }

          if (this.dataId != undefined) {
            parameterGetDetailEmployee['id'] = this.dataId;
          } else if (this.getDataId != undefined || this.getDataId != null) {
            parameterGetDetailEmployee['id'] = this.getDataId;
          }

          let parameterGetDetailTmp =
          {
            "employeeId": ""
          }

          if (this.dataId != undefined) {
            parameterGetDetailTmp['employeeId'] = this.dataId;
          } else if (this.getDataId != undefined || this.getDataId != null) {
            parameterGetDetailTmp['employeeId'] = this.getDataId;
          }
          console.log("cek param upload:", parameter)
          this.services.employeeIncentivePost('getListMapJobDealerRek', parameterGetMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultGet => {
            this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {
              this.services.employeeIncentivePost('getListMapJobDealerTmp', parameterGetDetailTmp, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultGetTmp => {
                if (resultGetEmploye.body.Data) {
                  this.statusEmploye = resultGetEmploye.body.Data[0].status;
                } else {
                  return;
                }
                // this.toggleLoading.showLoading(true);
                this.getJobDealer = resultGet.body.Data
                this.getJobDealerTmp = resultGetTmp.body.Data
                const tokensTmp = this.getJobDealerTmp.map((x: { jobCode: any; }) => x.jobCode);
                const tokens = this.getJobDealer.map((x: { jobCode: any; }) => x.jobCode);
                console.log("cek token detail", tokens)
                console.log("cek token pop up", tokensTmp)
                console.log("Pekerjaan dorpdown", this.form.value.filterPekerjaan)

                if (resultGetTmp.body.Data.length == 0
                  && resultGet.body.Data.length == 0
                ) {
                  this.toggleLoading.showLoading(true);
                  this.services.employeeIncentivePost('insertMapJobDealerRekTmp', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
                    console.log("result", result)
                    if (result.body.status == 'succes') {
                      let parameterUploadMap = {
                        "jobImageId": "",
                        "employeeId": "",
                        "mapId": result.body.mapId,
                        "fileName": this.namaFile,
                        "docName": this.form.value.namaDokumen,
                        "docImageValue": this.sellersPermitString,
                        "extension": this.extension,
                        "insertedBy": this.nik,
                        "updatedBy": this.nik
                      }
                      console.log("cek data id =====>",this.getDataId)
                      console.log("cek data id =====>",this.dataId)
                      if (this.dataId != undefined) {
                        parameterUploadMap['employeeId'] = this.dataId;
                      } else if (this.getDataId != undefined || this.getDataId != null) {
                        parameterUploadMap['employeeId'] = this.getDataId;
                      }
                      console.log("param upload map ===>",parameterUploadMap)
                      this.services.upload('uploadJobImage', parameterUploadMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultUpload => {
                        console.log("result uploadd map ===>",resultUpload)
                        Toast.fire({
                          icon: 'success',
                          title: 'Add data Berhasil'
                        })
                        // Swal.fire({
                        //   position: 'top-end',
                        //   icon: 'success',
                        //   title: 'Add data Berhasil!',
                        //   showConfirmButton: false,
                        //   timer: 2500
                        // })
                        this.getListMap();
                        this.toggleLoading.showLoading(false);
                      })
                    } else if (result.body.status == 'error') {
                      Toast.fire({
                        icon: 'info',
                        title: 'Tidak boleh menambah <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!'
                      })
                      // Swal.fire({
                      //   position: 'top-end',
                      //   icon: 'info',
                      //   title: 'Tidak boleh menambah <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!',
                      //   showConfirmButton: false,
                      //   timer: 3000
                      // })
                      this.toggleLoading.showLoading(false);
                    } else {
                      Toast.fire({
                        icon: 'error',
                        title: 'Add data gagal!'
                      })
                      // Swal.fire({
                      //   position: 'top-end',
                      //   icon: 'error',
                      //   title: 'Add data gagal!',
                      //   showConfirmButton: false,
                      //   timer: 2500
                      // })
                      this.toggleLoading.showLoading(false);
                    }
                  })
                }
                else if (resultGetTmp.body.Data.length == 0 && resultGet.body.Data.length > 0) {
                  this.toggleLoading.showLoading(true);
                  if ((this.statusEmploye == '0') &&
                    (tokens[0] != this.form.value.filterPekerjaan)) {
                      Toast.fire({
                        icon: 'info',
                        title: 'Tidak boleh menambah <b>Pekerjaan</b> lebih dari satu, saat pertama kali mendaftar!'
                      })
                    // Swal.fire({
                    //   position: 'top-end',
                    //   icon: 'info',
                    //   title: 'Tidak boleh menambah <b>Pekerjaan</b> lebih dari satu, saat pertama kali mendaftar!',
                    //   showConfirmButton: false,
                    //   timer: 3000
                    // })
                    console.log("job token", tokens)
                    this.toggleLoading.showLoading(false);
                  }
                  else {
                    console.log("job token", tokens)
                    console.log("job code dropdown", this.form.value.namaDealer)
                    this.services.employeeIncentivePost('insertMapJobDealerRekTmp', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
                      console.log("result", result)
                      if (result.body.status == 'succes') {
                        let parameterUploadMap = {
                          "jobImageId": "",
                          "employeeId": "",
                          "mapId": result.body.mapId,
                          "fileName": this.namaFile,
                          "docName": this.form.value.namaDokumen,
                          "docImageValue": this.sellersPermitString,
                          "extension": this.extension,
                          "insertedBy": this.nik,
                          "updatedBy": this.nik
                        }
                        console.log("cek data id =====>",this.getDataId)
                        console.log("cek data id =====>",this.dataId)
                        if (this.dataId != undefined) {
                          parameterUploadMap['employeeId'] = this.dataId;
                        } else if (this.getDataId != undefined || this.getDataId != null) {
                          parameterUploadMap['employeeId'] = this.getDataId;
                        }
                        console.log("param upload map ===>",parameterUploadMap)
                        this.services.upload('uploadJobImage', parameterUploadMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultUpload => {
                          console.log("result uploadd map ===>",resultUpload)
                          Toast.fire({
                            icon: 'success',
                            title: 'Add data Berhasil'
                          })
                          // Swal.fire({
                          //   position: 'top-end',
                          //   icon: 'success',
                          //   title: 'Add data Berhasil!',
                          //   showConfirmButton: false,
                          //   timer: 2500
                          // })
                          this.getListMap();
                          this.toggleLoading.showLoading(false);
                        })
                      } else if (result.body.status == 'error') {
                        Toast.fire({
                          icon: 'info',
                          title: 'Tidak boleh menambah <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!'
                        })
                        // Swal.fire({
                        //   position: 'top-end',
                        //   icon: 'info',
                        //   title: 'Tidak boleh menambah <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!',
                        //   showConfirmButton: false,
                        //   timer: 3000
                        // })
                        this.toggleLoading.showLoading(false);
                      } else {
                        Toast.fire({
                          icon: 'error',
                          title: 'Add data gagal'
                        })
                        // Swal.fire({
                        //   position: 'top-end',
                        //   icon: 'error',
                        //   title: 'Add data gagal!',
                        //   showConfirmButton: false,
                        //   timer: 2500
                        // })
                        this.toggleLoading.showLoading(false);
                      }
                    })
                  }
                }
                else {
                  this.toggleLoading.showLoading(true);
                  if ((this.statusEmploye == '0') &&
                    (tokensTmp[0] != this.form.value.filterPekerjaan)) {
                      Toast.fire({
                        icon: 'info',
                        title: 'Tidak boleh tambah <b>Pekerjaan</b> lebih dari satu, saat pertama kali mendaftar!'
                      })
                    // Swal.fire({
                    //   position: 'top-end',
                    //   icon: 'info',
                    //   title: 'Tidak boleh tambah <b>Pekerjaan</b> lebih dari satu, saat pertama kali mendaftar!',
                    //   showConfirmButton: false,
                    //   timer: 3000
                    // })
                    console.log("job token", tokens)
                    this.toggleLoading.showLoading(false);
                  }
                  else {
                    this.services.employeeIncentivePost('insertMapJobDealerRekTmp', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
                      console.log("result", result)
                      console.log("teeeeeeeet approcal", tokensTmp[0])
                      if (result.body.status == 'succes') {
                        let parameterUploadMap = {
                          "jobImageId": "",
                          "employeeId": "",
                          "mapId": result.body.mapId,
                          "fileName": this.namaFile,
                          "docName": this.form.value.namaDokumen,
                          "docImageValue": this.sellersPermitString,
                          "extension": this.extension,
                          "insertedBy": this.nik,
                          "updatedBy": this.nik
                        }
                        console.log("cek data id =====>",this.getDataId)
                        console.log("cek data id =====>",this.dataId)
                        if (this.dataId != undefined) {
                          parameterUploadMap['employeeId'] = this.dataId;
                        } else if (this.getDataId != undefined || this.getDataId != null) {
                          parameterUploadMap['employeeId'] = this.getDataId;
                        }
                        console.log("param upload map ===>",parameterUploadMap)
                        this.services.upload('uploadJobImage', parameterUploadMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultUpload => {
                          console.log("result uploadd map ===>",resultUpload)
                          Toast.fire({
                            icon: 'success',
                            title: 'Add data Berhasil!'
                          })
                          // Swal.fire({
                          //   position: 'top-end',
                          //   icon: 'success',
                          //   title: 'Add data Berhasil!',
                          //   showConfirmButton: false,
                          //   timer: 2500
                          // })
                          this.getListMap();
                          this.toggleLoading.showLoading(false);
                        })
                      } else if (result.body.status == 'error') {
                        Toast.fire({
                          icon: 'info',
                          title: 'Tidak boleh menambah <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!'
                        })
                        // Swal.fire({
                        //   position: 'top-end',
                        //   icon: 'info',
                        //   title: 'Tidak boleh menambah <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!',
                        //   showConfirmButton: false,
                        //   timer: 3000
                        // })
                        this.toggleLoading.showLoading(false);
                      } else {
                        Toast.fire({
                          icon: 'error',
                          title: 'Add data gagal'
                        })
                        // Swal.fire({
                        //   position: 'top-end',
                        //   icon: 'error',
                        //   title: 'Add data gagal!',
                        //   showConfirmButton: false,
                        //   timer: 2500
                        // })
                        this.toggleLoading.showLoading(false);
                      }
                    })
                  }
                }
              })
            })
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Tipe Dokumen Tidak Didukung!'
        })
      }
    } else {
      return;
    }
  }

  getListMap() {
    let parameter = {
      "employeeId": ""
    }
    if (this.dataId != undefined) {
      parameter['employeeId'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['employeeId'] = this.getDataId;
    }

    this.toggleLoading.showLoading(true);
    this.tambahPekerjaanElement = [];
    this.dataSourceMapping = new MatTableDataSource(this.tambahPekerjaanElement);

    this.services.employeeIncentivePost('getListMapJobDealerTmp', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
      result.body.Data.forEach((element: any) => {
        this.tambahPekerjaanElement.push({
          kodeJob: element.jobCode,
          deskJob: element.jobDesc,
          kodeDealer: element.dlc,
          namaDealer: element.dealerName,
          alamatDealer: element.dealerAddress,
          mapId: element.mapId
        })
      })
      this.dataSourceMapping = new MatTableDataSource(this.tambahPekerjaanElement);
      this.ngAfterViewInit();
      this.toggleLoading.showLoading(false);
    })
  }

  getDokumen(data: any) {
    this.toggleLoading.showLoading(true);
    let mapId = data.mapId
    let parameter = {
      "employeeId": "",
      "mapId": mapId
    }
    if (this.dataId != undefined) {
      parameter['employeeId'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['employeeId'] = this.getDataId;
    }
    console.log("param:", parameter)
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
    this.services.upload('getRekImageByEmployeeIdAndMapId', parameter, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(result => {
      console.log("get:", result)
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
        //   timer: 1500
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

  deleteListMap(data: any) {
    let mapId = data.mapId
    let parameter = {
      "mapId": mapId
    }
    console.log("cekk", parameter)
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.services.employeeIncentivePost('deleteMapJobDealerByMapId', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
          if (result.body.Status == "200") {
            Swal.fire(
              'Berhasil!',
              'File anda berhasil di hapus',
              'success'
            ),
              this.getListMap();
          } else {
            Swal.fire(
              'Gagal!',
              'File anda gagal di hapus!',
              'error'
            ),
              this.getListMap();
          }
        })
      }
    })
  }

  saveButtonMap() {
    let parameter = {
      "id": ""
    }
    if (this.dataId != undefined) {
      parameter['id'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameter['id'] = this.getDataId;
    }

    let parameterGetMapTmp = {
      "employeeId": ""
    }
    if (this.dataId != undefined) {
      parameterGetMapTmp['employeeId'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetMapTmp['employeeId'] = this.getDataId;
    }

    let parameterGetDetailEmployee =
    {
      "id": ""
    }

    if (this.dataId != undefined) {
      parameterGetDetailEmployee['id'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetDetailEmployee['id'] = this.getDataId;
    }

    let parameterGetMap = {
      "employeeId": ""
    }
    if (this.dataId != undefined) {
      parameterGetMap['employeeId'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetMap['employeeId'] = this.getDataId;
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
    this.toggleLoading.showLoading(true);
    this.services.employeeIncentivePost('getListMapJobDealerTmp', parameterGetMapTmp, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultGetMapTmp => {
      this.saveGetMapTmp = resultGetMapTmp.body.Data
      if (resultGetMapTmp.body.Data.length > 0) {
        this.services.employeeIncentivePost('confirmMapTmp', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
          if (result.body.msg == 'succes') {
            // this.getListMap();
            Toast.fire({
              icon: 'success',
              title: 'Berhasil Menyimpan Data'
            }).then((resultCek) => {
              if (resultCek) {
                this.dialogRef.close();
                this.toggleLoading.showLoading(false);
              }
            })
            // Swal.fire({
            //   position: 'top-end',
            //   icon: 'success',
            //   title: 'Berhasil Menyimpan Data',
            //   showConfirmButton: false,
            //   timer: 1500
            // }).then((resultCek) => {
            //   if (resultCek) {
            //     console.log("done notif")
            //     this.dialogRef.close();
            //     this.toggleLoading.showLoading(false);
            //   }
            // })
            this.toggleLoading.showLoading(false);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Gagal Menyimpan Data!'
            })
            this.toggleLoading.showLoading(false);
          }
        })
      } else {
        Toast.fire({
          icon: 'info',
          title: 'Harap lengkapi data terlebih dahulu!'
        })
        // Swal.fire({
        //   position: 'top-end',
        //   icon: 'info',
        //   title: 'Tidak ada data yang di tambahkan!',
        //   showConfirmButton: false,
        //   timer: 1500
        // })
        this.toggleLoading.showLoading(false);
      }
    })
  }

  ngAfterViewInit() {
    this.dataSourceMapping.sort = this.sortCol;
    this.dataSourceMapping.paginator = this.MatPaginator;
  }

  //search tabel tambah pekerjaan
  searchTambahPekerjaan(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceMapping.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceMapping.paginator) {
      this.dataSourceMapping.paginator.firstPage();
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