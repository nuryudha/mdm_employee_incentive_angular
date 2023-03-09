import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DealerElement } from 'src/app/models/data-employee-incentive/searchDealer.model';
import { listBankElement, listDocElement } from 'src/app/models/informasi-rekening/listBankandDoc.model';
import { listJobElement } from 'src/app/models/mapping-pekerjaan-dealer/getListJob.model';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { MainService } from 'src/app/services/main.service';
import { catchError } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-edit-detail-pekerjaan-dealer',
  templateUrl: './edit-detail-pekerjaan-dealer.component.html',
  styleUrls: ['./edit-detail-pekerjaan-dealer.component.css']
})
export class EditDetailPekerjaanDealerComponent implements OnInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  form!: FormGroup;
  cek!: FormGroup;
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
  paramAtasNama: any;
  paramNoRekening: any;
  paramBank: any;
  nik: any;
  roleUser: any;
  branchCode: any;
  addStatusEmployee: any;
  filterEmployeeStatus: any;
  pilihDokumenView: any;
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
  statusApv: any;
  statusDetailRek: any;
  validateDlc:any;
  statusGetDok: any;
  nameDoc: any;
  tanggalTerimaDok: any;
  pdfSrc: any;
  statusEmploye: any;

  constructor(private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<EditDetailPekerjaanDealerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validateInput();
    this.branchCode = this.authUser.profilLocation[0].branch_code;
    this.nik = this.authUser.profileHeader.nik;
    this.roleUser = this.authUser.profileUserRole;
  }
  @ViewChild('picker4') picker4: any;

  ngOnInit(): void {
    // this.nik = this.data.nik;
    this.dataId = this.data.dataId;
    this.getDataId = this.data.getDataId;
    this.dataNama = this.data.dataNama;
    this.accountId = this.data.accountId;
    this.mapId = this.data.mapId;
    this.paramNoRekening = this.data.noRekening;
    this.paramAtasNama = this.data.atasNama;
    this.paramBank = this.data.bank;
    this.statusDetailRek = this.data.statusDetailRek
    this.addStatusEmployee = this.data.statusEmployee;
    this.filterEmployeeStatus = this.data.statusDataEmploye;
    this.statusApv = this.data.statusApv;
    this.getDealer();
    this.getListDoc();
    this.form.controls.namaEmployee.setValue(this.dataNama);
    this.getDetailMap();
    this.getListJob();
    if (this.filterEmployeeStatus == "APPROVAL" || this.statusApv == "WAITING APPROVAL 1" || this.statusApv == "WAITING APPROVAL 2") {
      this.form.controls['filterPekerjaan'].disable();
      this.form.controls['namaDealer'].disable();
      this.form.controls['namaDokumen'].disable();
      this.form.controls['tanggalTerima'].disable();
      this.form.controls['pilihDokumen'].disable();
      this.form.controls['noRek'].disable();
      this.form.controls['atasNama'].disable();
      this.form.controls['bank'].disable();
    }

    if (this.data.incentiveSystem == "1" || this.data.differentCab == 'differentCab') {
      this.form.controls['filterPekerjaan'].disable();
      this.form.controls['namaDealer'].disable();
      this.form.controls['namaDokumen'].disable();
      this.form.controls['tanggalTerima'].disable();
      this.form.controls['pilihDokumen'].disable();
      this.form.controls['noRek'].disable();
      this.form.controls['atasNama'].disable();
      this.form.controls['bank'].disable();
    }
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
        // namaEmployee: [''],
        namaEmployee: ({ value: this.dataNama, disabled: true }),
        filterPekerjaan: ['', [Validators.required]],
        namaDealer: ['', [Validators.required]],
        namaDokumen: ['', [Validators.required]],
        tanggalTerima: ['', [Validators.required]],
        pilihDokumen: [''],
        noRek: ({ value: '', disabled: true }),
        atasNama: ({ value: '', disabled: true }),
        bank: ({ value: '', disabled: true })
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

  getDetailMap() {
    let parameterGetDetailMap =
    {
      "employeeId": "",
      "mapId": this.mapId
    }

    if (this.dataId != undefined) {
      parameterGetDetailMap['employeeId'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetDetailMap['employeeId'] = this.getDataId;
    }
    console.log(parameterGetDetailMap)
    this.services.employeeIncentivePost('getDetailMapJobRek', parameterGetDetailMap, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetMap => {
      console.log(resultGetMap)
      if (resultGetMap.body.Data) {
        this.form.controls.filterPekerjaan.setValue(resultGetMap.body.Data[0].jobCode);
        this.form.controls.namaDealer.setValue(resultGetMap.body.Data[0].dlc);
        this.form.controls.namaDokumen.setValue(resultGetMap.body.Data[0].documentName);
        this.form.controls.tanggalTerima.setValue(new Date(resultGetMap.body.Data[0].docReceivedDate));
        this.form.controls.noRek.setValue(resultGetMap.body.Data[0].accountNo);
        this.form.controls.atasNama.setValue(resultGetMap.body.Data[0].accountName);
        this.form.controls.bank.setValue(resultGetMap.body.Data[0].bankAccount);
        this.validateDlc = resultGetMap.body.Data[0].dlc;
      } else {
        return;
      }
    })
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
    console.log(this.statusDetailRek)

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
              }
            })
          })
          // this.statusEmploye == '1'
          // && this.statusDetailRek == 'AKTIF'
        } else {
          this.roleUser.forEach((element: any) => {
            // this.services.employeeIncentivePost('getListMapJobDealerRek', parameterGetMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultGet => {
            this.services.employeeIncentiveGet('getListJob', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(resultJob => {
              if (element.role_code == 'INIT_EMPL_INSE_HO' ||
                element.role_code == 'APPR1_EMPL_INSE_CAB' ||
                element.role_code == 'APPR1_EMPL_INSE_HO' ||
                element.role_code == 'APPR2_EMPL_INSENTIF') {
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
    //   "nik": this.data.nik,
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
    this.toggleLoading.showLoading(true);
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
          await this.toastrNotif.toastOnNoListDealer();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  addPictures() {
    this.finalJson = {
      "sellersPermitFile": this.sellersPermitString
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    console.log("==========>", file)
    const box = document.getElementById('docFile');
    if (box != null) {
      box.style.color = 'black';
    }
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

  getDokumen() {
    let parameter = {
      "employeeId": "",
      "mapId": this.mapId
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
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    this.toggleLoading.showLoading(true);
    this.services.upload('getRekImageByEmployeeIdAndMapId', parameter, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(result => {
      console.log("get:", result)
      this.statusGetDok = result.body.status
      if (this.statusGetDok == true) {
        this.image = result.body.data.docValue
        this.tipeextension = result.body.data.extension
        this.nameDoc = result.body.data.docName
        this.tanggalTerimaDok = result.body.data.updatedTime
        console.log("this.image:", this.nameDoc)
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
          title: 'Belum memiliki file dokumen'
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
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
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
      console.log("=========>", this.sizeFile)
      if (this.extension == "pdf" || this.extension == "png" || this.extension == "jpeg" || this.extension == "jpg" || this.extension == undefined) {
        if (this.sizeFile > 2000000) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Size dokumen melebihi size maksimal. Maksimal 2MB!'
          })
        } else if (this.sizeFile < 2000000 || this.sizeFile == undefined) {
          let parameter = {
            "mapId": this.mapId,
            "jobCode": this.form.value.filterPekerjaan,
            "dlc": "",
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
          if (this.validateDlc != this.form.value.namaDealer) {
            parameter['dlc'] = this.form.value.namaDealer;
          } else {
            parameter['dlc'] = "";
          }
          if (this.dataId != undefined) {
            parameter['employeeId'] = this.dataId;
          } else if (this.getDataId != undefined || this.getDataId != null) {
            parameter['employeeId'] = this.getDataId;
          }

          if (parameter['bankAccount'] == "") {
            parameter['bankAccount'] = this.paramBank;
            if (this.paramBank == undefined || this.paramBank == null) {
              parameter['bankAccount'] = "";
            }
          }

          if (parameter['accountNo'] == "") {
            parameter['accountNo'] = this.paramNoRekening;
            if (this.paramNoRekening == undefined || this.paramNoRekening == null) {
              parameter['accountNo'] = "";
            }
          }

          if (parameter['accountName'] == "") {
            parameter['accountName'] = this.paramAtasNama;
            if (this.paramAtasNama == undefined || this.paramAtasNama == null) {
              parameter['accountName'] = "";
            }
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
          console.log("result", parameter)
          this.services.employeeIncentivePost('getListMapJobDealerRek', parameterGetMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultGet => {
            this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {

              if (resultGetEmploye.body.Data) {
                this.statusEmploye = resultGetEmploye.body.Data[0].status;
              } else {
                return;
              }
              const tokens = resultGet.body.Data.map((x: { jobCode: any; }) => x.jobCode);
              if (resultGet.body.Data.length > 1) {
                console.log(resultGet.body.Data.length)
                if ((this.statusEmploye == '0') &&
                  (tokens[0] != this.form.value.filterPekerjaan)) {
                    Toast.fire({
                      icon: 'info',
                      title: 'Tidak boleh update <b>Pekerjaan</b> yang berbeda, saat pertama kali mendaftar!'
                    })
                  // Swal.fire({
                  //   position: 'top-end',
                  //   icon: 'info',
                  //   title: 'Tidak boleh update <b>Pekerjaan</b> yang berbeda, saat pertama kali mendaftar!',
                  //   showConfirmButton: false,
                  //   timer: 3000
                  // })
                  console.log("job token", tokens)
                  this.toggleLoading.showLoading(false);
                } else {
                  this.toggleLoading.showLoading(true);
                  this.services.employeeIncentivePost('insertMapJobDealerRek', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
                    console.log("result", result)
                    if (result.body.status == 'succes') {
                      if (this.extension != undefined) {
                        let parameterUploadMap = {
                          "jobImageId": "",
                          "employeeId": "",
                          "mapId": this.mapId,
                          "fileName": this.namaFile,
                          "docName": this.form.value.namaDokumen,
                          "docImageValue": this.sellersPermitString,
                          "extension": this.extension,
                          "insertedBy": this.nik,
                          "updatedBy": this.nik
                        }
                        console.log("cek data id =====>", this.getDataId)
                        console.log("cek data id =====>", this.dataId)
                        if (this.dataId != undefined) {
                          parameterUploadMap['employeeId'] = this.dataId;
                        } else if (this.getDataId != undefined || this.getDataId != null) {
                          parameterUploadMap['employeeId'] = this.getDataId;
                        }
                        console.log("param upload map ===>", parameterUploadMap)
                        this.services.upload('uploadJobImage', parameterUploadMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultUpload => {
                          console.log("result uploadd map ===>", resultUpload)
                          Toast.fire({
                            icon: 'success',
                            title: 'Berhasil Update Data'
                          }).then((resultCek) => {
                            if (resultCek) {
                              this.dialogRef.close();
                              this.toggleLoading.showLoading(false);
                            }
                          })
                          // Swal.fire({
                          //   position: 'top-end',
                          //   icon: 'success',
                          //   title: 'Berhasil Update Data',
                          //   showConfirmButton: false,
                          //   timer: 2500
                          // }).then((resultCek) => {
                          //   if (resultCek) {
                          //     this.dialogRef.close();
                          //     this.toggleLoading.showLoading(false);
                          //   }
                          // })
                          this.toggleLoading.showLoading(false);
                        })
                      } else {
                        Toast.fire({
                          icon: 'success',
                          title: 'Berhasil Update Data'
                        }).then((resultCek) => {
                          if (resultCek) {
                            this.dialogRef.close();
                            this.toggleLoading.showLoading(false);
                          }
                        })
                        // Swal.fire({
                        //   position: 'top-end',
                        //   icon: 'success',
                        //   title: 'Berhasil Update Data',
                        //   showConfirmButton: false,
                        //   timer: 2500
                        // }).then((resultCek) => {
                        //   if (resultCek) {
                        //     this.dialogRef.close();
                        //     this.toggleLoading.showLoading(false);
                        //   }
                        // })
                        this.toggleLoading.showLoading(false);
                      }
                    } else if (result.body.status == 'error') {
                      Toast.fire({
                        icon: 'info',
                        title: 'Tidak boleh update <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!'
                      })
                      // Swal.fire({
                      //   position: 'top-end',
                      //   icon: 'info',
                      //   title: 'Tidak boleh update <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!',
                      //   showConfirmButton: false,
                      //   timer: 3000
                      // })
                      this.toggleLoading.showLoading(false);
                    } 
                    // else if (result.body.status == 'info') {
                    //   Swal.fire({
                    //     position: 'top-end',
                    //     icon: 'info',
                    //     title: 'Tidak dapat melakukan edit data mapping, karena sedang dalam pengajuan insentif!',
                    //     showConfirmButton: false,
                    //     timer: 3000
                    //   })
                    //   this.toggleLoading.showLoading(false);
                    // } 
                    else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Gagal Update Data!'
                      })
                      this.toggleLoading.showLoading(false);
                    }
                  })
                }
              } else {
                this.toggleLoading.showLoading(true);
                this.services.employeeIncentivePost('insertMapJobDealerRek', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
                  console.log("result", result)
                  if (result.body.status == 'succes') {
                    if (this.extension != undefined) {
                      let parameterUploadMap = {
                        "jobImageId": "",
                        "employeeId": "",
                        "mapId": this.mapId,
                        "fileName": this.namaFile,
                        "docName": this.form.value.namaDokumen,
                        "docImageValue": this.sellersPermitString,
                        "extension": this.extension,
                        "insertedBy": this.nik,
                        "updatedBy": this.nik
                      }
                      console.log("cek data id =====>", this.getDataId)
                      console.log("cek data id =====>", this.dataId)
                      if (this.dataId != undefined) {
                        parameterUploadMap['employeeId'] = this.dataId;
                      } else if (this.getDataId != undefined || this.getDataId != null) {
                        parameterUploadMap['employeeId'] = this.getDataId;
                      }
                      console.log("param upload map ===>", parameterUploadMap)
                      this.services.upload('uploadJobImage', parameterUploadMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultUpload => {
                        console.log("result uploadd map ===>", resultUpload)
                        Toast.fire({
                          icon: 'success',
                          title: 'Berhasil Update Data'
                        }).then((resultCek) => {
                          if (resultCek) {
                            this.dialogRef.close();
                            this.toggleLoading.showLoading(false);
                          }
                        })
                        // Swal.fire({
                        //   position: 'top-end',
                        //   icon: 'success',
                        //   title: 'Berhasil Update Data',
                        //   showConfirmButton: false,
                        //   timer: 2500
                        // }).then((resultCek) => {
                        //   if (resultCek) {
                        //     this.dialogRef.close();
                        //     this.toggleLoading.showLoading(false);
                        //   }
                        // })
                        this.toggleLoading.showLoading(false);
                      })
                    } else {
                      Toast.fire({
                        icon: 'success',
                        title: 'Berhasil Update Data'
                      }).then((resultCek) => {
                        if (resultCek) {
                          this.dialogRef.close();
                          this.toggleLoading.showLoading(false);
                        }
                      })
                      // Swal.fire({
                      //   position: 'top-end',
                      //   icon: 'success',
                      //   title: 'Berhasil Update Data',
                      //   showConfirmButton: false,
                      //   timer: 2500
                      // }).then((resultCek) => {
                      //   if (resultCek) {
                      //     this.dialogRef.close();
                      //     this.toggleLoading.showLoading(false);
                      //   }
                      // })
                      this.toggleLoading.showLoading(false);
                    }
                  } else if (result.body.status == 'error') {
                    Toast.fire({
                      icon: 'info',
                      title: 'Tidak boleh update <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!'
                    })
                    // Swal.fire({
                    //   position: 'top-end',
                    //   icon: 'info',
                    //   title: 'Tidak boleh update <b>Dealer</b> yang sama dalam satu <b>Pekerjaan</b>!',
                    //   showConfirmButton: false,
                    //   timer: 3000
                    // })
                    this.toggleLoading.showLoading(false);
                  } 
                  // else if (result.body.status == 'info') {
                  //   Swal.fire({
                  //     position: 'top-end',
                  //     icon: 'info',
                  //     title: 'Tidak dapat melakukan edit data mapping, karena sedang dalam pengajuan insentif!',
                  //     showConfirmButton: false,
                  //     timer: 3000
                  //   })
                  //   this.toggleLoading.showLoading(false);
                  // } 
                  else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Gagal Update Data!'
                    })
                    this.toggleLoading.showLoading(false);
                  }
                })
              }
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
}