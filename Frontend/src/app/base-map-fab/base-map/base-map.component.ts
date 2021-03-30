import { Component, OnInit, Input } from '@angular/core'
@Component({
  selector: 'app-base-map',
  templateUrl: './base-map.component.html',
  styleUrls: ['./base-map.component.css']
})
export class BaseMapComponent implements OnInit {
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
