import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { ToggleLoadingService } from "../loading/toggle-loading.service";
import { ToastrNotifService } from "../toast-notification/toastr-notif.service";

@Injectable({
    providedIn: 'root'
})
export class ErrorRequestService {

  constructor(
    private toastrNotif: ToastrNotifService,
    private toggleLoading: ToggleLoadingService,
    private router: Router
) {}

// handle error get detail user
handleErrorDetailUser(error: HttpErrorResponse) {
    console.log(error.status);
    
    if (error.status === 400) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
    this.router.navigate(['/unauthorized']);
    // const waitPopUpDone = async () => {
    //     await this.toastrNotif.toastOnErrorDetailUser();
    //     this.toggleLoading.showLoading(false);
    //     this.router.navigate(['/unauthorized']);
    // }
    // waitPopUpDone();
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    this.router.navigate(['/unauthorized']);
    // const waitPopUpDone = async () => {
    //     await this.toastrNotif.toastOnErrorDetailUser();
    //     this.toggleLoading.showLoading(false);
    //     this.router.navigate(['/unauthorized']);
    // }
    // waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
}

// handle error get Search Employee
handleErrorSearchEmployee(error: HttpErrorResponse) {
    console.log(error);
    
    if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorSearchEmployee();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorSearchEmployee();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
}


// handle error get Dedup
handleErrorDedup(error: HttpErrorResponse) {
    console.log(error);
    
    if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorDedup();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorDedup();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
}

// handle error get list dealer
handleErrorListDealer(error: HttpErrorResponse) {
    console.log(error);
    
    if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorRequestListDealer();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorRequestListDealer();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
}

// handle error insert data employee
handleErrorInsertDataEmployee(error: HttpErrorResponse) {
    console.log(error);
    
    if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorInsertEmployee();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorInsertEmployee();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
}

// handle error GET DOKUMEN
handleErrorGetDokumen(error: HttpErrorResponse) {
    console.log(error);
    
    if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorGetDokumen();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorGetDokumen();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
}

// handle error GET REKENING
handleErrorGetRekening(error: HttpErrorResponse) {
    console.log(error);
    
    if (error.status === 0) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorGetRekening();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong.
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    const waitPopUpDone = async () => {
        await this.toastrNotif.toastOnErrorGetRekening();
        this.toggleLoading.showLoading(false);
    }
    waitPopUpDone();
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
}






































// // handle error get detail user
// handleErrorDetailUser(error: HttpErrorResponse) {
//     console.log(error);
    
//     if (error.status === 0) {
//     // A client-side or network error occurred. Handle it accordingly.
//     console.error('An error occurred:', error.error);
//     const waitPopUpDone = async () => {
//         await this.toastrNotif.toastOnErrorDetailUser();
//         this.toggleLoading.showLoading(false);
//         this.router.navigate(['/unauthorized']);
//     }
//     waitPopUpDone();
//     } else {
//     // The backend returned an unsuccessful response code.
//     // The response body may contain clues as to what went wrong.
//     console.error(`Backend returned code ${error.status}, body was: `, error.error);
//     const waitPopUpDone = async () => {
//         await this.toastrNotif.toastOnErrorDetailUser();
//         this.toggleLoading.showLoading(false);
//         this.router.navigate(['/unauthorized']);
//     }
//     waitPopUpDone();
//     }
//     // Return an observable with a user-facing error message.
//     return throwError(() => new Error('Something bad happened; please try again later.'));
// }

// // handle error get list cabang
// handleErrorListCabang(error: HttpErrorResponse) {
//     console.log(error);
    
//     if (error.status === 0) {
//     // A client-side or network error occurred. Handle it accordingly.
//     console.error('An error occurred:', error.error);
//     const waitPopUpDone = async () => {
//         await this.toastrNotif.toastOnErrorRequestListCabang();
//         this.toggleLoading.showLoading(false);
//     }
//     waitPopUpDone();
//     } else {
//     // The backend returned an unsuccessful response code.
//     // The response body may contain clues as to what went wrong.
//     console.error(`Backend returned code ${error.status}, body was: `, error.error);
//     const waitPopUpDone = async () => {
//         await this.toastrNotif.toastOnErrorRequestListCabang();
//         this.toggleLoading.showLoading(false);
//     }
//     waitPopUpDone();
//     }
//     // Return an observable with a user-facing error message.
//     return throwError(() => new Error('Something bad happened; please try again later.'));
// }

// // handle error confirm docver
// handleErrorConfirmDocver(error: HttpErrorResponse) {
//     console.log(error);
    
//     if (error.status === 0) {
//     // A client-side or network error occurred. Handle it accordingly.
//     console.error('An error occurred:', error.error);
//     const waitPopUpDone = async () => {
//         await this.toastrNotif.toastOnErrorConfirmRequestDocver();
//         this.toggleLoading.showLoading(false);
//     }
//     waitPopUpDone();
//     } else {
//     // The backend returned an unsuccessful response code.
//     // The response body may contain clues as to what went wrong.
//     console.error(`Backend returned code ${error.status}, body was: `, error.error);
//     const waitPopUpDone = async () => {
//         await this.toastrNotif.toastOnErrorConfirmRequestDocver();
//         this.toggleLoading.showLoading(false);
//     }
//     waitPopUpDone();
//     }
//     // Return an observable with a user-facing error message.
//     return throwError(() => new Error('Something bad happened; please try again later.'));
// }
}
