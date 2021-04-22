import { MapService } from './../services/map.service'
import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';

import VectorSource from 'ol/source/vector';
import VectorLayer from 'ol/layer/vector';
import Feature from 'ol/feature';
import Format from 'ol/format/wkt';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/Style';
import Circle from "ol/style/circle";
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  constructor(private httpClient: HttpClient, private mapService: MapService) { }

  searchResults: Array<any>;
  vectorSource: VectorSource
  vectorLayer: VectorLayer
  layerArray: any


  source(feature: Feature) {
    this.vectorSource = new VectorSource({
      features: [feature]
    })
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      displayInLayerSwitcher: false,
      style: this.styleMe(feature)
    })
  }
  async removeLayer() {
    const layersToRemove = [];
    this.mapService._map.getLayers().forEach(function (layer: { type: string; }) {
      if (layer.type === "VECTOR") {
        layersToRemove.push(layer);
      }
    })
    var len = layersToRemove.length;
    for (var i = 0; i < len; i++) {
      this.mapService._map.removeLayer(layersToRemove[i]);
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
    results.map((res: { _source: { st_astext: any; }; }) => {
      const format = new Format()
      const feature = format.readFeature(res._source.st_astext, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
      this.source(feature)
      this.mapService._map.addLayer(this.vectorLayer)
    })
  }
  styleMe(feature: Feature) {
    let style: any
    if (feature.getGeometry().getType() == "Point") {
      style = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: '#FFFF00' }),
          // stroke: new Stroke({
          //   color: [255, 0, 0], width: 2
          // })
        })
      })
    }
    else {
      style = new Style({
        fill: new Stroke({
          color: '#863564'
        }),
        stroke: new Stroke({
          color: '#863564',
          width: 5
        })
      })
    }
    return style
  }
  goToLocation(result: any) {
    const format = new Format()
    const feature = format.readFeature(result._source.st_astext, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    let vectorSource = new VectorSource({
      features: [feature]
    })
    this.mapService._map.getView().fit(vectorSource.getExtent(), { size: this.mapService._map.getSize(), maxZoom: 19 })
  }
}
