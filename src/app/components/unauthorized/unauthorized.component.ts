import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {

  image= './assets/images/unauthorized-image.gif';
  constructor(public services: MainService) { this.authentikasi(); }

  ngOnInit(): void {
    // Swal.fire({
    //   title: 'Look like you re have no permission',
    //   text: 'To access this pages!',
    //   imageUrl: this.image,
    //   imageWidth: 600,
    //   imageHeight: 400,
    //   imageAlt: 'Custom image',
    //   showCancelButton: false,
    //   confirmButtonText: 'Ok'
    // });
  }

  authentikasi() {
    window.parent.postMessage('authminiaps', this.services.urlSkeleton);
  }

}
