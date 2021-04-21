import { MapService } from './../services/map.service'
import { Component, OnInit } from '@angular/core'

import ol_source_vector from 'ol/source/vector';
import ol_layer_vector from 'ol/layer/vector';
import ol_feature from 'ol/feature';
import ol_format from 'ol/format/wkt';
import ol_extent from 'ol/extent';
import ol_style_fill from 'ol/style/fill';
import ol_style_stroke from 'ol/style/stroke';
import ol_style from 'ol/style/Style';

import proj from 'ol/proj';

import ol_style_circle from "ol/style/circle";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor(private httpClient: HttpClient, private mapService: MapService) { }

  searchResults: Array<any>;
  vectorSource: any
  vectorPolygons: Array<any>
  vectorPolygon: any
  layerArray: any


  ngOnInit() {
  }
  async resetMe() {
    if (this.vectorPolygon) {
      await this.removeLayer()
    }
  }
  async removeLayer() {
    let layerArray: string | any[]
    layerArray = this.mapService._map.getLayers().getArray()
    for await (const layer of layerArray) {
      if (layer.type == "VECTOR") {
        this.mapService._map.removeLayer(layer)
      }
    }
  }
  onSearch(params: any) {
    if (params.target.value !== "") {
      this.httpClient.get('http://127.0.0.1:3001/search?q=' + params.target.value).subscribe((response: any) => {
        this.searchResults = response
        this.removeLayer()
        this.drawLocation(this.searchResults)
        return response
      })
    } else {
      this.removeLayer()
      this.searchResults = []
    }
  }
  drawLocation(results: any) {
    results.map(res => {
      const format = new ol_format()
      const feature = format.readFeature(res._source.st_astext, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
      this.vectorSource = new ol_source_vector({
        features: [feature]
      })
      this.vectorPolygon = new ol_layer_vector({
        source: this.vectorSource,
        displayInLayerSwitcher: false,
        style: this.styleMe(feature)
      })
      this.removeLayer()
      this.mapService._map.addLayer(this.vectorPolygon)
      //this.vectorPolygons.push(this.vectorPolygon)
      //this.mapService._map.getView().fit(this.vectorSource.getExtent(), { size: this.mapService._map.getSize(), maxZoom: 19 })
    })
  }
  styleMe(feature) {
    let style: any
    if (feature.getGeometry().getType() == "Point") {
      var fill = new ol_style_fill({
        color: 'rgba(209, 11, 32,0.4)'
      });
      var stroke = new ol_style_stroke({
        color: '#3399CC',
        width: 1.25
      });
      style = [
        new ol_style({
          image: new ol_style_circle({
            fill: fill,
            stroke: stroke,
            radius: 5
          }),
          fill: fill,
          stroke: stroke
        })
      ];
    }
    else {
      style = new ol_style({
        fill: new ol_style_stroke({
          color: '#863564'
        }),
        stroke: new ol_style_stroke({
          color: '#863564',
          width: 5
        })
      })
      return style
    }
  }
  location(result) {
    const format = new ol_format()
    const feature = format.readFeature(result._source.st_astext, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    let vectorSource = new ol_source_vector({
      features: [feature]
    })
    this.mapService._map.getView().fit(vectorSource.getExtent(), { size: this.mapService._map.getSize(), maxZoom: 19 })
  }
}
