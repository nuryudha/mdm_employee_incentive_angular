import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
    providedIn: 'root'
})

export class ToggleLoadingService {

  constructor(
    private ngx_spinner: NgxSpinnerService
) {}

// toggle loading on screen
showLoading(condition: boolean) {
    switch (true) {
    case condition:
        this.ngx_spinner.show();
        break;
    default:
        this.ngx_spinner.hide();
        break;
    }
    return condition;
}
}