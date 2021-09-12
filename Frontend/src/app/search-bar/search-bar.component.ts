import { MapService } from './../services/map.service'
import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';

import VectorSource from 'ol/source/vector';
import View from 'ol/View'
import { getCenter } from 'ol/extent'
import VectorLayer from 'ol/layer/vector';
import Feature from 'ol/feature';
import Format from 'ol/format/wkt';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/Style';
import Circle from "ol/style/circle";
import Select from 'ol/interaction/Select'
import { altKeyOnly, click, pointerMove } from 'ol/events/condition';
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

  sourceAll(feature: Feature) {
    this.vectorSource = new VectorSource({
      features: [feature]
    })
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      displayInLayerSwitcher: false,
      style: this.styleAll(feature)
    })
  }
  sourceOne(feature: Feature) {
    this.vectorSource = new VectorSource({
      features: [feature]
    })
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      displayInLayerSwitcher: false,
      style: this.styleOne(feature)
    })
  }
  removeLayer() {
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
  hover(result: { _source: { st_astext: any; }; }) {
    const format = new Format()
    const feature = format.readFeature(result._source.st_astext, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    let start: number
    const selectedStyle = new Style({
      stroke: new Stroke({
        width: 2,
        color: 'blue'
      }),
      fill: new Fill()
    });
    const selectPointerMove = new Select({
      condition: pointerMove,
      style: function (feature: Feature) {
        var elapsed = new Date().getTime() - start;
        var opacity = Math.min(0.3 + elapsed / 10000, 0.8);
        selectedStyle.getFill().setColor('rgba(255,0,0,' + opacity + ')');
        feature.changed();
        return selectedStyle;
      }
    });
    //selectPointerMove.on('select', function () { start = new Date().getTime(); });
    this.mapService._map.addInteraction(selectPointerMove);

    // const format = new Format()
    // const feature = format.readFeature(result._source.st_astext, {
    //   dataProjection: 'EPSG:4326',
    //   featureProjection: 'EPSG:3857'
    // })
    // console.log(feature);
    // this.sourceOne(feature)
    // this.mapService._map.addLayer(this.vectorLayer)
  }
  resetMe() {
    let extent = [3216713.3243182143,
      5015157.184877166,
      3231322.3513492187,
      5021998.298908689]
    let view = new View({
      extent: extent,
      center: getCenter(extent),
      zoom: 14,
      minZoom: 2,
      maxZoom: 20,
    })
    this.mapService._map.setView(view)
  }
  onSearch(params: any) {
    if (params.target.value !== "") {
      this.httpClient.get('http://127.0.0.1:3001/search?q=' + params.target.value).subscribe((response: any) => {
        this.searchResults = response
        this.removeLayer()
        this.resetMe()
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
      this.sourceAll(feature)
      this.mapService._map.addLayer(this.vectorLayer)
    })
  }

  styleOne(feature: Feature) {
    let style: any
    if (feature.getGeometry().getType() == "Point") {
      style = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: '#626567' }),
        })
      })
    }
    else if (feature.getGeometry().getType() == "MultiLineString") {
      style = new Style({
        fill: new Stroke({
          color: '#626567'
        }),
        stroke: new Stroke({
          color: '#626567',
          width: 5
        })
      })
    }
    else {
      style = new Style({
        fill: new Stroke({
          color: 'rgba(28, 142, 37 ,0.5)'
        })
      })
    }
    return style
  }
  styleAll(feature: Feature) {
    let style: any
    if (feature.getGeometry().getType() == "Point") {
      style = new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({ color: '#93FFE8' }),
        })
      })
    }
    else if (feature.getGeometry().getType() == "MultiLineString") {
      style = new Style({
        fill: new Stroke({
          color: '#ADDFFF'
        }),
        stroke: new Stroke({
          color: '#ADDFFF',
          width: 5
        })
      })
    }
    else {
      style = new Style({
        fill: new Stroke({
          color: 'rgba(87, 254, 255,0.5)'
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
