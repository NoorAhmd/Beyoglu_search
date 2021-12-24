
import { Component, OnInit } from '@angular/core'
import { MapService } from './services/map.service'
import ol_control_cloud from 'ol-ext-datatable/control/Cloud';
import * as $ from "jquery";

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
    //this.mapService.createHighlightLayer()
    // var ctrl = new ol_control_cloud({ opacity: $("#opacity").val(), density: $("#density").val(), windSpeed: Number($("#ws").val()), windAngle: Number($("#wa").val()) * Math.PI / 180 });
    // this.mapService._map.addControl(ctrl);

  }
}
