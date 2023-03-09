import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { MainService } from 'src/app/services/main.service';
import { catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { param } from 'jquery';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.css']
})
export class UploadDocumentComponent implements OnInit {
  authUser: any = JSON.parse(localStorage.getItem('auth-user') || "{}");
  form!: FormGroup;
  pilihDokumen: any;
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
  nameDoc: any;
  dataId: any;
  getDataId: any;
  nik: any;
  namaDok: any;
  terima: any;
  bulan: any;
  tempTanggalTerima: Date = new Date();
  tanggalTerima: string = '';

  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<UploadDocumentComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validateInput();
    this.nik = this.authUser.profileHeader.nik;
  }
  @ViewChild('picker2') picker2: any;

  ngOnInit(): void {
    // this.nik = this.data.nik;
    this.dataId = this.data.dataId;
    this.getDataId = this.data.getDataId;
    this.namaDok = this.data.namaDok;
    this.form.controls.NamaDokumen.setValue(this.namaDok);
    // this.paramQuery();
  }

  open() {
    this.picker2.open();
  }

  paramQuery() {
    this.route.queryParams
      .subscribe(param => {
        this.dataId = param.dataId,
          this.getDataId = param.getDataID
      })
  }

  addEventAwal(type: string, event: MatDatepickerInputEvent<Date>) {
    this.tempTanggalTerima = new Date(`${type}: ${event.value}`);
    this.terima = this.tempTanggalTerima;

    let getBulan = this.terima.getMonth();
    let namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    getBulan = namaBulan[getBulan];
    this.bulan = getBulan;

    this.tanggalTerima = (('0' + this.tempTanggalTerima.getDate()).slice(-2) + '-' + (this.bulan) + '-' + this.tempTanggalTerima.getFullYear()).toString()
  }

  validateInput() {
    let alphabets: any = Validators.pattern(/^[a-zA-Z ]*$/);
    let emoji: any = Validators.pattern(/[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]/);
    this.form = this.formBuilder.group(
      {
        NamaDokumen: ['', [Validators.required]],
        terima: ['', [Validators.required]],
        pilihDokumen: ['', [Validators.required]]
      },
    );
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
    // console.log("nama File", cekNama[0]);
    // console.log("extension", extension);
    // console.log("file", file);
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
    // console.log("cek extension:", this.extension)
    // console.log("cek nama file:", this.namaFile)
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
    this.pilihDokumen = 1;
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
            "employeeId": "",
            "fileName": this.namaFile,
            "docName": this.form.value.NamaDokumen,
            "docImageValue": this.sellersPermitString,
            "extension": this.extension,
            "insertedBy": this.nik,
            "docReceivedDate": this.tanggalTerima,
            "insertedTime": "",
            "updatedBy": this.nik,
            "updatedTime": ""
          }
          console.log("cek parameter dokumen", parameter)
          if (this.dataId != undefined || this.dataId != null) {
            parameter['employeeId'] = this.dataId;
          } else if (this.getDataId != undefined || this.getDataId != null) {
            parameter['employeeId'] = this.getDataId;
          }
          // console.log("parameter", parameter)
          this.toggleLoading.showLoading(true);
          this.services.upload('uploadDocImage', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
            // console.log("test:", result)
            if (result.body.status == true) {
              Toast.fire({
                icon: 'success',
                title: 'Berhasil Upload Dokumen'
              }).then((resultCek) => {
                console.log("satria upload cek")
                if (resultCek) {
                  this.dialogRef.close();
                  this.toggleLoading.showLoading(false);
                }
              })
              this.toggleLoading.showLoading(false);
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'success',
              //   title: 'Berhasil Upload Dokument',
              //   showConfirmButton: false,
              //   timer: 1500
              // })
              // this.dialogRef.close();
              // this.toggleLoading.showLoading(false);
            } else {
              Toast.fire({
                icon: 'error',
                title: 'Gagal Upload Dokumen'
              })
              // Swal.fire({
              //   position: 'top-end',
              //   icon: 'error',
              //   title: 'Gagal Upload Dokument',
              //   showConfirmButton: false,
              //   timer: 1500
              // })
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
}
