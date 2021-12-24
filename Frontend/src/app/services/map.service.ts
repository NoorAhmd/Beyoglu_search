import { Injectable, KeyValueDiffers } from '@angular/core'
import Map from 'ol/MAP'
import Control from 'ol/control/Control';
import View from 'ol/View'
import { HttpClient } from '../../../node_modules/@angular/common/http'
import { DataService } from 'src/app/services/data.service'

import TileLayer from 'ol/layer/Tile'
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { fromLonLat } from 'ol/proj'

import TileWms from "ol/source/Tilewms";

import * as config from '../../../config.json'


@Injectable({
  providedIn: 'root'
})
export class MapService {
  _view: any
  _map: any
  _baseMaps: any[] = []
  _parentBoundryLayer
  _childBoundryLayer
  _highlightedLayer
  constructor(private http: HttpClient, private dataService: DataService) { }

  createMap(mapElement) {
    let extent = fromLonLat([28.6314, 41.0128])

    this._view = new View({
      center: extent,
      zoom: 10,
      minZoom: 2,
      maxZoom: 50,
    })

    this._map = new Map({
      target: mapElement,
      view: this._view,

    })
  }

  createHighlightLayer() {
    this._highlightedLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: '#f11',
          width: 2
        }),
        fill: new Fill({ color: 'rgba(73, 135, 234, 0.1)' })
      }),
      visible: true
    })
    this._map.addLayer(this._highlightedLayer)

  }

  createBaseMaps() {
    if (this._map !== undefined) {
      const anka = new TileLayer({
        baseLayer: true,
        visible: true,
        preview: "img/preview.png",
        source: new TileWms({
          url: config.baseLayers.ankaMap.url,
          params: {
            'FORMAT': config.baseLayers.ankaMap.format,
            'VERSION': config.baseLayers.ankaMap.version,
            tiled: config.baseLayers.ankaMap.tiled,
            LAYERS: config.baseLayers.ankaMap.layers,

          }
        })
      })
      const baseMap = this._baseMaps
      //this._map.addLayer(ilceLayer);
      this._map.addLayer(anka);
    } else {
      // TODO: Map Not initialized
    }
  }
}