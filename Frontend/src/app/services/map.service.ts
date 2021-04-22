import { Injectable, KeyValueDiffers } from '@angular/core'
import Map from 'ol/MAP'
import View from 'ol/View'
import { HttpClient } from '../../../node_modules/@angular/common/http'
import { DataService } from 'src/app/services/data.service'

import TileLayer from 'ol/layer/tile'
import VectorSource from 'ol/source/vector';
import VectorLayer from 'ol/layer/vector';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/Style';

import TileWms from "ol/source/tilewms";
import Extent from 'ol/extent'

import ImageLayer from 'ol/layer/image'
import ImageWms from 'ol/source/imagewms'

import { getCenter } from 'ol/extent'
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
    let extent = [3216713.3243182143,
      5015157.184877166,
      3231322.3513492187,
      5021998.298908689]
    this._view = new View({
      extent: extent,
      center: getCenter(extent),
      zoom: 14,
      minZoom: 2,
      maxZoom: 20,
    })

    this._map = new Map({
      target: mapElement,
      view: this._view
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
      const ilce = config.baseLayers.ilceLayer;
      var ilceLayer = new ImageLayer({
        title: 'Ilce Katmani',
        visible: true,
        zIndex: 99,
        source: new ImageWms({
          url: ilce.url,
          params: {
            'FORMAT': ilce.format,
            'VERSION': ilce.version,
            LAYERS: ilce.layers
          }
        })
      })
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
      this._map.addLayer(ilceLayer);
      this._map.addLayer(anka);
    } else {
      // TODO: Map Not initialized
    }
  }
}