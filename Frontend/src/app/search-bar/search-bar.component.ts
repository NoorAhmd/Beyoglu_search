import { MapService } from './../services/map.service'
import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import * as $ from "jquery";
import VectorSource from 'ol/source/Vector';
import View from 'ol/View'
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import Feature from 'ol/Feature';
import Format from 'ol/format/Wkt';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Circle from "ol/style/Circle";
import icon from "ol/style/Icon";
import Image from "ol/style/Image"
import Select from 'ol/interaction/Select'
import { altKeyOnly, click, pointerMove } from 'ol/events/condition';
import { fromLonLat, transformExtent, get } from 'ol/proj'
import { toLonLat } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  constructor(private httpClient: HttpClient, private mapService: MapService) { }
  searchResults: Array<any>
  results: Array<any>
  vectorSource: VectorSource
  vectorLayer: VectorLayer
  vectors: VectorSource
  vectorFeatures: Array<any>
  view: View

  ngOnInit() {
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    //const closer = document.getElementById('popup-closer');
    let selected = null;
    const highlightStyle = new Style({
      image: new icon({
        crossOrigin: 'anonymous',
        // For Internet Explorer 11
        src: 'assets/img/yurt.png',
      })
    })
    var popup = new Overlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    })

    // closer.onclick = function () {
    //   popup.setPosition(undefined);
    //   closer.blur();
    //   return false;
    // };
    const map = this.mapService._map
    this.mapService._map.addOverlay(popup);
    map.on('pointermove', function (evt) {

      if (selected !== null) {
        selected.setStyle(undefined);
        selected = null;
        popup.setPosition(undefined);
      }
      map.forEachFeatureAtPixel(evt.pixel,
        function (feature, layer) {
          if (feature) {
            selected = feature;
            selected.setStyle(highlightStyle);
            const geometry = selected.getGeometry();
            const features = selected.getProperties()
            var coord = geometry.getCoordinates();
            popup.setPosition(coord);
            content.innerHTML = `<p><b>Yurt adı</b>: ${features.dormitory_name}</p><p><b>Adres</b>: ${features.adres}</p><p><b>Tel</b>: ${features.telefon}</p>`
          } else {
            content.innerHTML = '&nbsp;'
          }
        })
      // if (selected) {

      //   const geometry = selected.getGeometry();
      //   const features = selected.getProperties()
      //   var coord = geometry.getCoordinates();
      //   popup.setPosition(coord);
      //   content.innerHTML = `<p>${features.dormitory_name}</p>`
      // } else {
      //   content.innerHTML = '&nbsp;';
      // }

    })
    this.httpClient.get('https://yurtlar.elasmap.com/rest/yurtlar/search?q=' + " ").subscribe((response: any) => {
      this.searchResults = response
      this.extent(response)
      this.drawLocation(this.searchResults)
      const source = this.getVectorSource(response)
      this.getFeatures(source, map)
      //return response
    })
  }
  getFeatures(source: any, map: any) {
    let info = {}
    map.on('moveend', evt => {
      let features = []
      const extent = map.getView().calculateExtent(map.getSize());
      source.forEachFeatureInExtent(extent, function (feature) {
        info["_source"] = feature.getProperties()
        features.push(info);
      })
      this.searchResults = features
    })
  }
  sourceAll(feature: Feature) {
    this.vectorSource = new VectorSource({
      features: [feature]
    })
    this.vectors = this.vectorSource
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
    this.mapService._map.addInteraction(selectPointerMove);
  }
  resetMe() {
    let extent = fromLonLat([28.6314, 41.0128])
    this.view = new View({
      center: extent,
      zoom: 10,
      minZoom: 2,
      maxZoom: 50,
    })
    this.mapService._map.setView(this.view)
  }

  getAll() {
    this.onSearch(" ")
  }
  onSearch(params: any) {
    this.removeLayer()
    this.searchResults = []
    this.resetMe()
    this.httpClient.get('https://yurtlar.elasmap.com/rest/yurtlar/search?q=' + params.target.value).subscribe((response: any) => {
      this.searchResults = response
      this.removeLayer()
      this.resetMe()
      this.extent(response)
      this.drawLocation(this.searchResults)
      const source = this.getVectorSource(response)
      this.getFeatures(source, this.mapService._map)
      //return response
    })
  }
  drawLocation(results: any) {
    results.map((res: any) => {
      const format = new Format()
      const feature = format.readFeature(res._source.geom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
      feature.setProperties(res._source)
      this.sourceAll(feature)
      this.mapService._map.addLayer(this.vectorLayer)
    })
  }

  extent(results: any) {
    const format = new Format()
    if (results.length > 0) {
      const features = results.map(res => {
        const f = format.readFeature(res._source.geom, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        })
        f.setProperties(res._source)
        return f
      })
      let vectorSource = new VectorSource({
        features: features
      })
      this.mapService._map.getView().fit(vectorSource.getExtent(), { padding: [70, 120, 70, 380], constrainResolution: false })
    }
  }
  getVectorSource(results) {
    const format = new Format()
    const features = results.map(res => {
      const f = format.readFeature(res._source.geom, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
      f.setProperties(res._source)
      return f
    })
    let vectorSource = new VectorSource({
      features: features
    })
    return vectorSource
  }
  styleOne(feature: Feature) {
    let style: any
    if (feature.getGeometry().getType() == "Point") {
      style = new Style({
        image: new Circle({
          radius: 5,
          fill: new Fill({ color: '#FF0000' }),
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
        image: new icon({
          crossOrigin: 'anonymous',
          // For Internet Explorer 11
          src: 'assets/img/yurt.png',
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
    const feature = format.readFeature(result._source.geom, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    let vectorSource = new VectorSource({
      features: [feature]
    })
    this.mapService._map.getView().fit(vectorSource.getExtent(), { size: this.mapService._map.getSize(), maxZoom: 19 })
  }
}


