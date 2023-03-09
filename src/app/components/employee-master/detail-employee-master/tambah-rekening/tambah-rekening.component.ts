import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { listBankElement, listDocElement } from 'src/app/models/informasi-rekening/listBankandDoc.model';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { MainService } from 'src/app/services/main.service';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { param } from 'jquery';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-tambah-rekening',
  templateUrl: './tambah-rekening.component.html',
  styleUrls: ['./tambah-rekening.component.css']
})
export class TambahRekeningComponent implements OnInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  form!: FormGroup;
  cek!: FormGroup;

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
  dataNama: string = '';
  accountId: any;
  nik: any;
  addStatusEmployee: any;
  statusEmploye: any;
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

  constructor(
    private formBuilder: FormBuilder,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<TambahRekeningComponent>, @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.validateInput();
    this.nik = this.authUser.profileHeader.nik;
  }
  @ViewChild('picker4') picker4: any;

  ngOnInit(): void {
    this.getListBank();
    this.getListDoc();
    this.dataId = this.data.dataId;
    this.getDataId = this.data.getDataId;
    this.dataNama = this.data.dataNama;
    this.accountId = this.data.accountId;
    this.addStatusEmployee = this.data.statusEmployee;
    this.cek = this.formBuilder.group(
      {
        namaEmployee: ({ value: this.dataNama, disabled: true })
      },
    );
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
        bankAccount: ['', [Validators.required]],
        accountNo: ['', [Validators.required, Validators.pattern(/^[0-9]*\.?[0-9]*$/), Validators.maxLength(15)]],
        accountName: ['', [alphabets, emoji, Validators.required]],
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

  getListBank() {
    // this.toggleLoading.showLoading(true);
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
    console.log("=========",this.form.controls.bankAccount)
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
            "accountId": "",
            "employeeId": "",
            "bankAccount": this.form.value.bankAccount,
            "accountNo": this.form.value.accountNo,
            "accountName": this.form.value.accountName.toUpperCase(),
            "documentName": this.form.value.namaDokumen,
            "docReceivedDate": this.tanggalTerima,
            "documentPath": "",
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

          let parameterRek =
          {
            "employeeId": ""
          }
          if (this.dataId != undefined) {
            parameterRek['employeeId'] = this.dataId;
          } else if (this.getDataId != undefined || this.getDataId != null) {
            parameterRek['employeeId'] = this.getDataId;
          }
          this.services.employeeIncentivePost('getRekening', parameterRek, catchError(this.handleError.handleErrorGetRekening.bind(this))).subscribe(resultRek => {
            console.log("cekRekening:", resultRek)
            let parameterGetDetailEmployee =
            {
              "id": ""
            }

            if (this.dataId != undefined) {
              parameterGetDetailEmployee['id'] = this.dataId;
            } else if (this.getDataId != undefined || this.getDataId != null) {
              parameterGetDetailEmployee['id'] = this.getDataId;
            }

            this.services.employeeIncentivePost('getDetailEmpl', parameterGetDetailEmployee, catchError(this.handleError.handleErrorSearchEmployee.bind(this))).subscribe(resultGetEmploye => {
              if (resultGetEmploye.body.Data[0]) {
                this.statusEmploye = resultGetEmploye.body.Data[0].status;
              } else {
                return;
              }

              this.toggleLoading.showLoading(true);
              if ((this.statusEmploye == '0') && resultRek.body.Data.length > 0) {
                Toast.fire({
                  icon: 'info',
                  title: 'Tidak boleh tambah rekening lebih dari satu ketika pertama kali mendaftar!'
                })
                // Swal.fire({
                //   position: 'top-end',
                //   icon: 'error',
                //   title: 'Tidak boleh tambah rekening lebih dari satu ketika pertama kali mendaftar!',
                //   showConfirmButton: false,
                //   timer: 2500
                // })
                this.toggleLoading.showLoading(false);
              } else {
                console.log("result:", parameter)
                this.services.employeeIncentivePost('insertRekeningEmployee', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
                  console.log("result:", result)
                  if (result.body.status == 'succes') {
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
                    console.log("cek data id =====>", this.getDataId)
                    console.log("cek data id =====>", this.dataId)
                    if (this.dataId != undefined) {
                      parameterUploadMap['employeeId'] = this.dataId;
                    } else if (this.getDataId != undefined || this.getDataId != null) {
                      parameterUploadMap['employeeId'] = this.getDataId;
                    }
                    console.log("param upload map ===>", parameterUploadMap)
                    this.services.upload('uploadRekImage', parameterUploadMap, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(resultUpload => {
                      console.log("result uploadd map ===>", resultUpload)
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
                      //   timer: 2500
                      // }).then((resultCek) => {
                      //   if (resultCek) {
                      //     this.dialogRef.close();
                      //     this.toggleLoading.showLoading(false);
                      //   }
                      // })
                      this.toggleLoading.showLoading(false);
                    })
                  } else if (result.body.status == 'error') {
                    Swal.fire({
                      icon: 'info',
                      title: 'Oops...',
                      html: 'Nomor Rekening terdeteksi duplikat dengan employee no <b>' + result.body.data[0].employeeNo + '</b>, nama employe <b>' + result.body.data[0].employeeName + '</b>. Mohon cek kembali!'
                    })
                    this.toggleLoading.showLoading(false);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Gagal Menambah Rekening!'
                    })
                    this.toggleLoading.showLoading(false);
                  }
                })
              }
            })
          })
          // }

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