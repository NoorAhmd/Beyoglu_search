import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-zoom-button',
  templateUrl: './zoom-button.component.html',
  styleUrls: ['./zoom-button.component.css']
})
export class ZoomButtonComponent implements OnInit {
  @Input() view: any
  constructor() { }

  ngOnInit() {
  }

  // animateZoom(zoomLevel) {
  //   this.view.animate({
  //     zoom: this.view.getZoom() + zoomLevel,
  //     duration: 450,
  //   })
  // }
}
