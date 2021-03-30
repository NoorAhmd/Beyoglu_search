import { DataService } from './services/data.service'
import { Component, OnInit } from '@angular/core'
import { MapService } from './services/map.service'
import * as config from '../../config.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public mapService: MapService) { }

  ngOnInit() {
    //this.mapService.mapInit(config)
    this.mapService.createMap(document.getElementById('olMAP'))
    this.mapService.createBaseMaps()
    this.mapService.createHighlightLayer()

  }
}
