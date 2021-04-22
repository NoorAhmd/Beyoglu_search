import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-base-map-fab',
  templateUrl: './base-map-fab.component.html',
  styleUrls: ['./base-map-fab.component.css']
})
export class BaseMapFabComponent implements OnInit {
  @Input() baseMaps: any[]

  constructor() { }

  ngOnInit() {
  }

  changeBaseMaps(baseMap) {
    const visibleBaseMap = this.baseMaps.find((tileLayer) => tileLayer.getVisible() === true)
    visibleBaseMap.setVisible(false)
    baseMap.setVisible(true)
  }

}
