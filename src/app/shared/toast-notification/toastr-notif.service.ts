import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root'
})

export class ToastrNotifService {

    isDesktop: boolean = false;
    positionToast: string = '';

    constructor(
        private breakpointObserver: BreakpointObserver,
        private toastr: ToastrService
    ) {
        this.breakpointObserver.observe([
            "(max-width: 992px)"
        ]).subscribe((result: BreakpointState) => {
            if (result.matches) {
                this.isDesktop = false;
            } else {
                this.isDesktop = true;
            }
        });

        this.isDesktop == false ? this.positionToast = 'toast-top-center' : this.positionToast = 'toast-top-right';
    }

    toastOnErrorDetailUser() {

        return new Promise<void>((resolve, reject) => {

            this.toastr.error(
                `Terjadi masalah saat proses get detail user`,
                'Whoops!..',
                {
                timeOut: 2000,
                positionClass: `${this.positionToast}`,
                enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if(shouldResolve) {
                    resolve();
                }else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    //search employee notif
    toastOnNoSearchEmployee() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada data ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnErrorSearchEmployee() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `404 Service Not Found`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    //dedup notif
    toastOnNoDedup() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada data ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnErrorDedup() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `404 Service Not Found`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    //Insert data employe notif
    toastOnInsertEmployee() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Gagal Insert Data Employee`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnErrorInsertEmployee() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `404 Service Not Found`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListDealer() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada list delaer yang ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListDoc() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada list dokumen yang ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListJob() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada list pekerjaan yang ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnErrorRequestListDealer() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `404 Service Not Found`,
                'Whoops!..',
                {
                    timeOut: 2000,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    //GET DOKUMEN
    toastOnGetDokumen() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Error : something went wrong!`,
                'Whoops!..',
                {
                    timeOut: 2000,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnErrorGetDokumen() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `404 Service Not Found`,
                'Whoops!..',
                {
                    timeOut: 2000,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    //GET REKENING
    toastOnGetRekening() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Rekening tidak ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2000,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnErrorGetRekening() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `404 Service Not Found`,
                'Whoops!..',
                {
                    timeOut: 2000,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListStatus() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada list status yang ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListHO() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada data Inisiator HO yang ditemukan`,
                'Whoops!..',
                {
                timeOut: 3000,
                positionClass: `${this.positionToast}`,
                enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if(shouldResolve) {
                    resolve();
                }else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListCAB() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada data Inisiator Cabang yang ditemukan`,
                'Whoops!..',
                {
                timeOut: 3000,
                positionClass: `${this.positionToast}`,
                enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if(shouldResolve) {
                    resolve();
                }else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListAppr() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada data Pendaftaran yang ditemukan`,
                'Whoops!..',
                {
                timeOut: 3000,
                positionClass: `${this.positionToast}`,
                enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if(shouldResolve) {
                    resolve();
                }else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListInse() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada data Insentif yang ditemukan`,
                'Whoops!..',
                {
                timeOut: 3000,
                positionClass: `${this.positionToast}`,
                enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if(shouldResolve) {
                    resolve();
                }else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListRevise() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada list Revise yang ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }

    toastOnNoListBank() {
        return new Promise<void>((resolve, reject) => {
            this.toastr.error(
                `Tidak ada list Bank yang ditemukan`,
                'Whoops!..',
                {
                    timeOut: 2500,
                    positionClass: `${this.positionToast}`,
                    enableHtml: true
                }
            )
            setTimeout(() => {
                const shouldResolve = true;
                if (shouldResolve) {
                    resolve();
                } else {
                    reject("Error : something went wrong!");
                }
            }, 2000);
        })
    }
}
