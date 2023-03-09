import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { listBankElement, listDocElement } from 'src/app/models/informasi-rekening/listBankandDoc.model';
import { DetailEmployee } from 'src/app/models/detail-employee/detail-employee.model';
import { listReviseElement } from 'src/app/models//approval/listRevise.moddel';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { MainService } from 'src/app/services/main.service';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { param } from 'jquery';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-detail-informasi-rekening',
  templateUrl: './detail-informasi-rekening.component.html',
  styleUrls: ['./detail-informasi-rekening.component.css']
})
export class DetailInformasiRekeningComponent implements OnInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  form!: FormGroup;
  cek!: FormGroup;
  test!: FormGroup;

  bulan: any;
  tempTanggalTerima: Date = new Date();
  tanggalTerima: string = '';

  listBank: listBankElement[] = [];
  filteredBank: any = this.listBank;
  listDoc: listDocElement[] = [];
  filteredDoc: any = this.listDoc;

  errorMessage: string = "";
  pilihDokumen: any;
  dataId: any;
  getDataId: any;
  employeeID: any;
  dataNama: string = '';
  accountId: any;
  bankAccount: any;
  accountNo: any;
  accountName: string = '';
  accountStatus: any;
  filterStatusApv: string = '';
  selectStatusApv: DetailEmployee[] = [
    { value: 'APPROVE', view: 'APPROVE' },
    { value: 'REVISE', view: 'REVISE' }
  ]
  listRevise: listReviseElement[] = [];
  filteredRevise: any = this.listRevise;
  statusAproval: any;
  mapId: any;
  nik: any;
  roleUser: any;
  accountIdData: any;

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

  statusGetDok: any;
  nameDoc: any;
  tanggalTerimaDok: any;
  pdfSrc: any;
  filterEmployeeStatus: any;
  statusApv: any;

  constructor(
    private formBuilder: FormBuilder,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private route: ActivatedRoute,
    private router: Router,
    public dialogRef: MatDialogRef<DetailInformasiRekeningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.validateInput();
    this.nik = this.authUser.profileHeader.nik;
    this.roleUser = this.authUser.profileUserRole;
  }
  @ViewChild('picker4') picker4:any;

  ngOnInit(): void {
    // this.nik = this.data.nik;
    this.dataId = this.data.dataId;
    this.getDataId = this.data.getDataId;
    this.dataNama = this.data.dataNama;
    this.accountIdData = this.data.accountIdData;
    this.bankAccount = this.data.bankAccount;
    this.accountNo = this.data.accountNo;
    this.accountName = this.data.accountName;
    this.accountStatus = this.data.accountStatus;
    this.filterEmployeeStatus = this.data.statusDataEmploye;
    this.statusApv = this.data.statusApv;
    this.route.queryParams
      .subscribe(param => {
        this.statusAproval = param.statusToDoLits,
          this.mapId = param.mapId,
          this.accountId = param.accountId
      })
    this.getDetailRek();
    this.getListBank();
    this.getListDoc();
    this.cek = this.formBuilder.group(
      {
        namaEmployee: ({ value: this.dataNama, disabled: true })
      },
    );
    if (this.statusAproval == "WAITING APPROVAL 1" || this.statusAproval == "WAITING APPROVAL 2") {
      this.form.controls['bankAccount'].disable();
      this.form.controls['accountNo'].disable();
      this.form.controls['accountName'].disable();
      this.form.controls['namaDokumen'].disable();
      this.form.controls['tanggalTerima'].disable();
      this.form.controls['pilihDokumen'].disable();
      this.form.controls['filterStatusApv'].setValidators([Validators.required]);
    }
    this.getListRevise();
    console.log("========>",this.accountStatus)
    if (this.filterEmployeeStatus == "APPROVAL" || this.accountStatus == "AKTIF") {
      this.form.controls['bankAccount'].disable();
      this.form.controls['accountNo'].disable();
      this.form.controls['accountName'].disable();
      this.form.controls['namaDokumen'].disable();
      this.form.controls['tanggalTerima'].disable();
      this.form.controls['pilihDokumen'].disable();
    }
    if (this.data.incentiveSystem == "1" || this.data.differentCab == "differentCab") {
      this.form.controls['bankAccount'].disable();
      this.form.controls['accountNo'].disable();
      this.form.controls['accountName'].disable();
      this.form.controls['namaDokumen'].disable();
      this.form.controls['tanggalTerima'].disable();
      this.form.controls['pilihDokumen'].disable();
    }
    console.log("==========",this.bankAccount)
    if (this.bankAccount.includes("MANDIRI")) {
      this.form.controls.accountNo.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13)])
      this.form.controls.accountNo.reset();
    } else {
      this.form.controls.accountNo.setValidators([Validators.required, Validators.maxLength(15)])
      this.form.controls.accountNo.reset();
    }
  }

  clickListAproval() {
    this.form.controls.alasanRevise.reset();
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
        bankAccount: ['',[Validators.required]],
        accountNo: ['', [Validators.required, Validators.pattern(/^[0-9]*\.?[0-9]*$/), Validators.maxLength(15)]],
        accountName: ['', [alphabets, emoji, Validators.required]],
        namaDokumen: ['', [Validators.required]],
        tanggalTerima: ['', [Validators.required]],
        pilihDokumen: [''],
        filterStatusApv: [],
        alasanRevise: [],
        catatan: []
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

  getDetailRek() {
    let parameterGetDetailRek =
    {
      "employeeId" : "",
      "accountId" : this.accountIdData
    }

    if (this.dataId != undefined) {
      parameterGetDetailRek['employeeId'] = this.dataId;
    } else if (this.getDataId != undefined || this.getDataId != null) {
      parameterGetDetailRek['employeeId'] = this.getDataId;
    }
    console.log(parameterGetDetailRek)
    this.services.employeeIncentivePost('getDetailRek', parameterGetDetailRek, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetRek => {
      console.log("result",resultGetRek)
      if (resultGetRek.body.Data) {
        this.form.controls.bankAccount.setValue(resultGetRek.body.Data[0].bankAccount);
        this.form.controls.accountNo.setValue(resultGetRek.body.Data[0].accountNo);
        this.form.controls.accountName.setValue(resultGetRek.body.Data[0].accountName);
        this.form.controls.namaDokumen.setValue(resultGetRek.body.Data[0].docName);
        this.form.controls.tanggalTerima.setValue(new Date (resultGetRek.body.Data[0].docReceivedDate));
        // this.form.controls.pilihDokumen.setValue(resultGetRek.body.Data[0].docName);
      } else {
        return;
      }
      
    })
  }

  getListBank() {
    this.toggleLoading.showLoading(true);
    this.services.employeeIncentiveGet('getListBank', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {

      if (result.body.Data.length > 0 && result.body.Data != null) {
        let tempListBank = result.body.Data;
        let arrayListBank: listBankElement[] = [];
        tempListBank.forEach((element: any) => {
          arrayListBank.push({ bankName: element.bankName, bankCode: element.bankCode + " - " + element.bankName })
        })

        this.listBank = arrayListBank;
        this.filteredBank = this.listBank;
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          await this.toastrNotif.toastOnNoListBank();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  getListDoc() {
    this.toggleLoading.showLoading(true);
    this.services.employeeIncentiveGet('getDocRek', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {

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

  onNoClick(): void {
    this.dialogRef.close();
  }

  addPictures() {
    this.finalJson = {
      "sellersPermitFile": this.sellersPermitString
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
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
  }

  onChange(selectedValue: string) {
    console.log("=========", selectedValue);
    console.log("=========",this.form.controls.bankAccount)
    if (selectedValue.includes("MANDIRI")) {
      this.form.controls.accountNo.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13)])
      this.form.controls.accountNo.reset();
    } else {
      this.form.controls.accountNo.setValidators([Validators.required, Validators.maxLength(15)])
      this.form.controls.accountNo.reset();
    }
  }

  onSubmit() {
    this.pilihDokumen = 1;
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    if (this.form.valid) {
      if (this.extension == "pdf" || this.extension == "png" || this.extension == "jpeg" || this.extension == "jpg" || this.extension == undefined) {
        if (this.sizeFile > 2000000) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Size dokumen melebihi size maksimal. Maksimal 2MB!'
          })
        } else if (this.sizeFile < 2000000 || this.sizeFile == undefined) {
          let parameter = {
            "accountId": this.accountIdData,
            "employeeId": "",
            "bankAccount": this.form.value.bankAccount,
            "accountNo": this.form.value.accountNo,
            "accountName": this.form.value.accountName,
            "documentName": this.form.value.namaDokumen,
            "docReceivedDate": this.tanggalTerima,
            "documentPath": this.form.value.pilihDokumen,
            "insertedBy": "",
            "updatedBy": ""
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
          console.log("param", parameter)
          this.toggleLoading.showLoading(true);
          this.services.employeeIncentivePost('insertRekeningEmployee', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
            console.log("result", result)
            if (result.body.status == 'succes') {
              if (this.extension != undefined) {
                let parameterUploadMap = {
                  "employeeId": "",
                  "accountId": result.body.accountId,
                  "fileName": this.namaFile,
                  "docName": this.form.value.namaDokumen,
                  "docImageValue": this.sellersPermitString,
                  "extension": this.extension,
                  "insertedBy": this.nik,
                  "insertedTime": "",
                  "updatedBy": this.nik,
                  "updatedTime": ""
                }
                console.log("cek data id =====>",this.getDataId)
                console.log("cek data id =====>",this.dataId)
                if (this.dataId != undefined) {
                  parameterUploadMap['employeeId'] = this.dataId;
                } else if (this.getDataId != undefined || this.getDataId != null) {
                  parameterUploadMap['employeeId'] = this.getDataId;
                }
                console.log("param upload map ===>",parameterUploadMap)
                this.services.upload('uploadRekImage', parameterUploadMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultUpload => {
                  console.log("result uploadd map ===>",resultUpload)
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
              Swal.fire({
                icon: 'info',
                title: 'Oops...',
                html: 'Nomor Rekening terdeteksi duplikat dengan employee no <b>'+ result.body.data[0].employeeNo  +'</b>, nama employe <b>'+ result.body.data[0].employeeName +'</b>. Mohon cek kembali!'
              })
              this.toggleLoading.showLoading(false);
            } 
            // else if (result.body.status == 'info') {
            //   Swal.fire({
            //     icon: 'info',
            //     title: 'Oops...',
            //     html: 'Tidak dapat melakukan edit data rekening, karena sedang dalam pengajuan insentif!'
            //   })
            //   this.toggleLoading.showLoading(false);
            // } 
            else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal Update Rekening!'
              })
              this.toggleLoading.showLoading(false);
            }
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

  getDokumen() {
    this.toggleLoading.showLoading(true);
    let parameter = {
      "employeeId": "",
      "accountId": this.accountIdData
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
    this.services.upload('getRekImageByEmployeeIdAndAccountId', parameter, catchError(this.handleError.handleErrorGetDokumen.bind(this))).subscribe(result => {
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
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  getListRevise() {
    // let parameter = {
    //   "nik": this.data.nik,
    //   "application": "MDMA"
    // }
    // this.services.getUserProfile('?app=login&endpoint=getDetailUserProfile', parameter).subscribe(result => {
      // this.roleUser = result.body.resultProfileUserRole
      // console.log("cekrole:", this.roleUser )
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

  onSubmitApprovalTwo() {
    let parameter = {
      "historyId": "",
      "employeeId": this.dataId,
      "accountId": this.accountIdData,
      "action": this.form.value.filterStatusApv,
      "alasan": "",
      "detail": "",
      "catatan": "",
      "insertedBy": this.nik,
      "updatedBy": this.nik
    }

    if (this.dataId != undefined) {
      parameter['employeeId'] = this.dataId;
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
    console.log("result:", parameter)
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
          html: 'Anda yakin untuk melakukan Revise dengan Nama Account<b> ' + this.dataNama + ' </b>?',
          confirmButtonText: 'YA',
          cancelButtonText: 'TIDAK',
          showCancelButton: true,
          confirmButtonColor: '#f7ad00',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.toggleLoading.showLoading(true);
            console.log("parameter:", parameter)
            this.services.employeeIncentivePost('insertHistoryApv2', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
              console.log("result:", result)
              if (result.body.Status == '200') {
                this.services.apvTwo = "YES";
                Toast.fire({
                  icon: 'success',
                  title: 'Berhasil Revise Data'
                }).then((resultCek) => {
                  if (resultCek) {
                  // this.router.navigate(['/to-do-list/' + this.nik]);
                  this.services.revTwo = "YES"
                  this.toggleLoading.showLoading(false);
                  this.dialogRef.close();
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
                //   // this.router.navigate(['/to-do-list/' + this.nik]);
                //   this.services.revTwo = "YES"
                //   this.toggleLoading.showLoading(false);
                //   this.dialogRef.close();
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
                //   timer: 2500
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
        html: 'Anda yakin untuk melakukan Approval dengan Nama Account<b> ' + this.dataNama + ' </b>?',
        confirmButtonText: 'YA',
        cancelButtonText: 'TIDAK',
        showCancelButton: true,
        confirmButtonColor: '#f7ad00',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.toggleLoading.showLoading(true);
          this.services.employeeIncentivePost('insertHistoryApv2', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
            if (result.body.Status == '200') {
              this.services.apvTwo = "YES";
              Toast.fire({
                icon: 'success',
                title: 'Berhasil Approve Data'
              }).then((resultCek) => {
                if (resultCek) {
                  // this.router.navigate(['/to-do-list/' + this.nik]);
                  this.services.apvTwo = "YES";
                  this.toggleLoading.showLoading(false); 
                  this.dialogRef.close();
                }
              })
              // Swal.fire({
              //   icon: 'success',
              //   title: 'Berhasil Approve Data',
              //   timer: 2000,
              //   showConfirmButton: false
              // }).then((resultCek) => {
              //   if (resultCek) {
              //     // this.router.navigate(['/to-do-list/' + this.nik]);
              //     this.services.apvTwo = "YES";
              //     this.toggleLoading.showLoading(false); 
              //     this.dialogRef.close();
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
              //   timer: 1500
              // })
              // console.log("result:", result)
              this.toggleLoading.showLoading(false);
            }
          })
        } 
      })
    }
  }
}