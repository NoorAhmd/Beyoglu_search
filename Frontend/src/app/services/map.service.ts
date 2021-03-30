import { Injectable, KeyValueDiffers } from '@angular/core'


import Map from 'ol/MAP'
import View from 'ol/View'

import TileLayer from 'ol/layer/tile'
import LayerVector from 'ol/layer/Vector'
import SourceVector from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import Feature from 'ol/Feature'

import Image from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'
import OLTileImage from 'ol/source/TileImage'

import Overlay from 'ol/Overlay'

import OLStyle from 'ol/style/Style'
import Stroke from 'ol/style/Stroke'
import Fill from 'ol/style/Fill'
import Text from 'ol/style/text'
import Circle from 'ol/style/circle'
import Icon from 'ol/style/icon'

import Geometry from 'ol/geom/Geometry'
import Point from 'ol/geom/point'
import MultiPoint from 'ol/geom/multipoint'
import OLMultiPolygon from 'ol/geom/Multipolygon'
import Extent from 'ol/extent'

import Cluster from 'ol/source/cluster'

import Heatmap from 'ol/layer/Heatmap'

import OSM from 'ol/source/OSM'

import olInteraction from 'ol/interaction'
import InteractionMouseWheelZoom from 'ol/interaction/mousewheelzoom'

import Wkt from 'ol/format/wkt'

import loadingstrategy from 'ol/loadingstrategy'

import { transform } from 'ol/proj'
import LineString from 'ol/geom/linestring'

import Stamen from 'ol/source/stamen'

import { environment } from '../../environments/environment.prod'
import { HttpClient } from '../../../node_modules/@angular/common/http'
import { DataService } from 'src/app/services/data.service'


import { pointerMove } from 'ol/events/condition';
import ol_interaction_select from 'ol/interaction/select';
import ol_interaction_mouse from 'ol/interaction/mousewheelzoom';
import ol_interaction_dragpan from 'ol/interaction/dragpan';
import ol_interaction_pinchzoom from 'ol/interaction/pinchzoom';
import ol_interaction_clickZoom from 'ol/interaction/doubleclickzoom';
import ol_interaction_dragZoom from 'ol/interaction/dragzoom';
import ol_source_tileWms from "ol/source/tilewms";
import _ol_extent_ from 'ol/extent'
import { createEmpty, extend, } from 'ol/extent.js'
import ol_ImageLayer from 'ol/layer/image'
import ol_ImageWms from 'ol/source/imagewms'
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

    this.initalizeSingleClick()
  }

  createHighlightLayer() {
    this._highlightedLayer = new LayerVector({
      source: new SourceVector(),
      style: new OLStyle({
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
      const googleRoad = new TileLayer({
        title: 'Google Yol',
        image: '/assets/img/streets.jpg',
        source: new OLTileImage({ url: 'http://mt1.google.com/vt/lyrs=m@113&hl=tr&&x={x}&y={y}&z={z}' }),
        visible: true
      })
      const googleHybird = new TileLayer({
        title: 'Google Hibrit',
        image: '/assets/img/hybrid.jpg',
        source: new OLTileImage({ url: 'http://mt1.google.com/vt/lyrs=y@113&hl=tr&&x={x}&y={y}&z={z}' }),
        visible: false
      })
      const googleSat = new TileLayer({
        title: 'Google Uydu',
        image: '/assets/img/satellite.jpg',
        source: new OLTileImage({ url: 'http://mt1.google.com/vt/lyrs=s@13&hl=tr&&x={x}&y={y}&z={z}' }),
        visible: false
      })
      const openStreetMap = new TileLayer({
        title: 'OSM',
        image: '/assets/img/osm.jpg',
        source: new OSM(),
        crossOrigin: 'anonymous',
        visible: false
      })
      const openTopographic = new TileLayer({
        title: 'Open Togografik',
        image: '/assets/img/Togographic.jpg',
        source: new OLTileImage({ url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png' }),
        visible: false
      })
      const ilce = config.baseLayers.ilceLayer;
      //diğer ilçeleri maskeleyen katman
      var ilceLayer = new ol_ImageLayer({
        title: 'Ilce Katmani',
        visible: true,
        zIndex: 99,
        source: new ol_ImageWms({
          url: ilce.url,
          params: {
            'FORMAT': ilce.format,
            'VERSION': ilce.version,
            LAYERS: ilce.layers
          }
        })
      })
      const anka = new TileLayer({
        title: 'Harita',
        baseLayer: true,
        visible: true,
        preview: "img/preview.png",
        source: new ol_source_tileWms({
          url: config.baseLayers.ankaMap.url,
          params: {
            'FORMAT': config.baseLayers.ankaMap.format,
            'VERSION': config.baseLayers.ankaMap.version,
            tiled: config.baseLayers.ankaMap.tiled,
            LAYERS: config.baseLayers.ankaMap.layers,

          }
        })
      });
      const baseMap = this._baseMaps
      baseMap.push(googleRoad)
      baseMap.push(googleSat)
      baseMap.push(googleHybird)
      baseMap.push(openStreetMap)
      baseMap.push(openTopographic)


      this._map.addLayer(googleRoad)
      this._map.addLayer(googleHybird)
      this._map.addLayer(googleSat)
      this._map.addLayer(openStreetMap)
      this._map.addLayer(openTopographic)
      this._map.addLayer(ilceLayer);
      this._map.addLayer(anka);
    } else {
      // TODO: Map Not initialized
    }
  }

  private initalizeSingleClick() {
    if (this._map !== undefined) {
      this._map.on('singleclick', (event) => {
        this.hiearchicalClick(event)
      })
    } else {
      // TODO: Map Not initialized
    }
  }

  hiearchicalClick(event) {
    const dataService = this.dataService
    if (dataService._selectionState === 0) {
      event.coordinate = this.convertTo4326(event)
      dataService.postOWSRequestClickEvent('ankamap:border_all', event).subscribe(res => {
        if (res['totalFeatures'] > 0) {
          const features = res['features']

          const selectedFeature = this.findLayer(features, dataService._selectionState)
          dataService._hiearchicalData.push(selectedFeature)
        } else {
          //  TODO: Can be added more control
        }
      })
    } else {
    }
  }

  convertTo4326(event) {
    return transform([event.coordinate[0], event.coordinate[1]], 'EPSG:3857', 'EPSG:4326')
  }


  getParentBoundaryData(event) {
    const requestURL = this._parentBoundryLayer.getSource().getGetFeatureInfoUrl(event.coordinate, 1, this._view.getProjection(), {
      INFO_FORMAT: 'application/json',
    })

    return this.http.get(requestURL)
  }


  createMainBoundryLayer() {
    const layerParam = { 'LAYERS': 'ankamap:border_all', 'cql_filter': 'type=0' }
    const countryLayer = new Image({
      visible: true,
      opacity: 0.8,
      source: new ImageWMS({
        url: environment.GEOSERVER_WMS_LAYER,
        params: layerParam
      })
    })
    this.dataService._hiearchicalLayers.push(countryLayer)
    this._map.addLayer(countryLayer)
  }

  findLayer(features, state) {
    const foundFeature = features.find((feature) => feature.type === state)

    return foundFeature
  }
  mapInit = (config) => {
    var interactionSelectPointerMove = new ol_interaction_select({
      condition: pointerMove
    });

    window.Map = new Map({
      target: 'map',
      controls: [],
      layers: this.createBaseMaps()
    });

    var extent = config.beyogluExtent;
    var center = getCenter([16, 48])
    Map.setView(new View({
      extent: extent,
      center: center,
      zoom: config.initialZoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom
    }));
    var ilce = config.baseLayers.ilceLayer;
    //diğer ilçeleri maskeleyen katman
    var ilceLayer = new ol_ImageLayer({
      title: 'Ilce Katmani',
      visible: true,
      zIndex: 99,
      source: new ol_ImageWms({
        url: ilce.url,
        params: {
          'FORMAT': ilce.format,
          'VERSION': ilce.version,
          LAYERS: ilce.layers
        }
      })
    });
    Map.addLayer(ilceLayer);
    return Map;
  }
}
