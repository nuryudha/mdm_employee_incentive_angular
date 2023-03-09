import { Component, OnInit, Inject } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DealerElement } from 'src/app/models/data-employee-incentive/searchDealer.model';
import { listBankElement, listDocElement } from 'src/app/models/informasi-rekening/listBankandDoc.model';
import { listRekElement } from 'src/app/models/mapping-pekerjaan-dealer/listMappingRek.model';
import { listJobElement } from 'src/app/models/mapping-pekerjaan-dealer/getListJob.model';
import { ErrorRequestService } from 'src/app/shared/handle-error/error-request.service';
import { ToggleLoadingService } from 'src/app/shared/loading/toggle-loading.service';
import { ToastrNotifService } from 'src/app/shared/toast-notification/toastr-notif.service';
import { MainService } from 'src/app/services/main.service';
import { catchError } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { param } from 'jquery';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-popup-mapping-rek',
  templateUrl: './popup-mapping-rek.component.html',
  styleUrls: ['./popup-mapping-rek.component.css']
})
export class PopupMappingRekComponent implements OnInit {
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
  listRek: listRekElement[] = [];
  filteredRek: any = this.listRek;

  dealer: string = '';
  dataId: any;
  getDataId: any;
  dataNama: string = '';
  accountId: any;
  mapId: any;
  nik: any;
  paramAtasNama: any;
  paramNoRekening: any;
  paramBank: any;
  
  filterPekerjaan: any;
  namaDealer: any;
  namaDokumen: any;
  tanggalTerimaMap: any;
  pilihDokumenMap: any;
  noRek: any;
  atasNama: any;
  bank: any;
  
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
  branchCode: any;

  constructor(
    private formBuilder: FormBuilder,
    private services: MainService,
    private handleError: ErrorRequestService,
    private toggleLoading: ToggleLoadingService,
    private toastrNotif: ToastrNotifService,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<PopupMappingRekComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validateInput();
    this.branchCode = this.authUser.profilLocation[0].branch_code;
    this.nik = this.authUser.profileHeader.nik;
  }

  ngOnInit(): void {
    // this.nik = this.data.nik;
    this.dataId = this.data.dataId;
    this.getDataId = this.data.getDataId;
    this.accountId = this.data.accountId;
    this.mapId = this.data.mapId;
    this.getListJob();
    this.getDealer();
    this.getListDoc();
    this.getNoRek();
    this.getDetailMap();
    this.form.get('filterPekerjaan')?.disable();
    this.form.get('namaDealer')?.disable();
    this.form.get('namaDokumen')?.disable();
    this.form.get('tanggalTerima')?.disable();
    this.form.get('pilihDokumen')?.disable();
    this.form.get('atasNama')?.disable();
    this.form.get('bank')?.disable();
  }

  validateInput() {
    let alphabets: any = Validators.pattern(/^[a-zA-Z ]*$/);
    //let date: any = Validators.pattern(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    let emoji: any = Validators.pattern(/[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]/);
    this.form = this.formBuilder.group(
      {
        filterPekerjaan: [''],
        namaDealer: [''],
        namaDokumen: [''],
        tanggalTerima: [''],
        pilihDokumen: [''],
        noRek: ['', [Validators.required]],
        atasNama: [''],
        bank: ['']
      },
    );
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
        // this.form.controls.noRek.setValue(resultGetMap.body.Data[0].accountNo);
        // this.form.controls.atasNama.setValue(resultGetMap.body.Data[0].accountName);
        // this.form.controls.bank.setValue(resultGetMap.body.Data[0].bankAccount);

        this.filterPekerjaan = resultGetMap.body.Data[0].jobCode
        this.namaDealer = resultGetMap.body.Data[0].dlc
        this.namaDokumen = resultGetMap.body.Data[0].documentName
        this.tanggalTerimaMap = resultGetMap.body.Data[0].docReceivedDate
        this.pilihDokumenMap = 'gambar upload'
        this.noRek = resultGetMap.body.Data[0].accountNo
        // this.atasNama = resultGetMap.body.Data[0].accountName
        // this.bank = resultGetMap.body.Data[0].bankAccount
      } else {
        return;
      }
    })
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
    this.services.employeeIncentiveGet('getListJob', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {

      if (result.body.Data.length > 0 && result.body.Data != null) {
        let tempListJob = result.body.Data;
        let arrayListJob: listJobElement[] = [];
        tempListJob.forEach((element: any) => {
          arrayListJob.push({ jobCode: element.jobCode, jobDescription: element.jobCode + " - " + element.jobDescription })
        })

        this.listJob = arrayListJob;
        this.filteredJob = this.listJob;
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          // await this.toastrNotif.toastOnNoListDealer();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
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
            // await this.toastrNotif.toastOnNoListDealer();
            this.toggleLoading.showLoading(false);
          }
          waitPopUpDone();
        }
      })
    // })
  }

  getListDoc() {
    this.services.employeeIncentiveGet('getListDocument', catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {

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
          // await this.toastrNotif.toastOnNoListDealer();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  getNoRek() {
    let parameter =
    {
      "employeeId": this.dataId
    }

    this.services.employeeIncentivePost('getListRekMap', parameter, catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {

      if (result.body.Data != null) {
        let tempListRek = result.body.Data;
        let arrayListRek: listRekElement[] = [];
        tempListRek.forEach((element: any) => {
          arrayListRek.push({ accountId: element.accountId, accountNo: element.accountNo, accountName: element.accountName, bankAccount: element.bankAccount })
        })
        this.listRek = tempListRek;
        this.filteredRek = this.listRek;
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          // await this.toastrNotif.toastOnNoListDealer();
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  onChange(value: any) {
    let parameter =
    {
      "employeeId" : this.dataId,
      "accountId" : value.value
  }
    console.log("-=-=-=-=-=--=-", parameter)
    this.services.employeeIncentivePost('getDetailRek', parameter, catchError(this.handleError.handleErrorListDealer.bind(this))).subscribe(result => {
      console.log("-=-=-=-=-=--=-", result)
      if (result.body.Data != null) {
        this.atasNama = result.body.Data[0].accountName;
        this.bank = result.body.Data[0].bankAccount;
        console.log("-=-=-=-=-=--=-", this.atasNama)
        this.toggleLoading.showLoading(false);
      } else {
        const waitPopUpDone = async () => {
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  getDokumen() {
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
    this.toggleLoading.showLoading(true);
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
          this.toggleLoading.showLoading(false);
        }
        waitPopUpDone();
      }
    })
  }

  onSubmit() {
    this.pilihDokumen = 1;
    console.log('=======>', this.tanggalTerimaMap)
    if (this.form.valid) {
      console.log('=======>', this.form)
      let parameter = {
        "mapId": this.mapId,
        "jobCode": "",
        "dlc": "",
        "documentName": "",
        "docReceivedDate": "",
        "documentPath": "",
        "bankAccount": "",
        "accountNo": "",
        "accountName": "",
        "insertedBy": this.nik,
        "updatedBy": this.nik,
        "employeeId": "",
        "accountId": this.form.value.noRek
      }
      if (this.dataId != undefined) {
        parameter['employeeId'] = this.dataId;
      } else if (this.getDataId != undefined || this.getDataId != null) {
        parameter['employeeId'] = this.getDataId;
      }
      console.log(parameter)
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
      this.services.employeeIncentivePost('insertMapJobDealerRek', parameter, catchError(this.handleError.handleErrorInsertDataEmployee.bind(this))).subscribe(result => {
        console.log(result);
        if (result.body.status == 'succes') {
          Toast.fire({
            icon: 'success',
            title: 'Berhasil mapping Pekerjaan dan Dealer dengan Rekening'
          }).then((resultCek) => {
            if (resultCek) {
              this.dialogRef.close();
              this.toggleLoading.showLoading(false);
            }
          })
          // Swal.fire({
          //   position: 'top-end',
          //   icon: 'success',
          //   title: 'Berhasil Update Mapping Pekerjaan, Dealer, Rekening',
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
        // else if (result.body.status == 'info') {
        //   Swal.fire({
        //     icon: 'info',
        //     title: 'Oops...',
        //     text: 'Tidak dapat melakukan edit data mapping, karena sedang dalam pengajuan insentif!'
        //   })
        //   this.toggleLoading.showLoading(false);
        // } 
        else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Gagal mapping Pekerjaan dan Dealer dengan Rekening!'
          })
          this.toggleLoading.showLoading(false);
        }
      })
    } else {
      return;
    }
  }

  onFileSelected(event: Event) {
    console.log(event);
  }
}