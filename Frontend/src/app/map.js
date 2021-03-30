const { basemaps } = require('./basemaps');
import View from 'ol/view';
import Map from 'ol/map';
import 'ol-ext-datatable/control/LayerSwitcherImage.css'
import 'ol-ext-datatable/layer/GetPreview';
import ol_control_LayerImage from 'ol-ext-datatable/control/LayerSwitcherImage';
import ol_event_condition from 'ol/events/condition';
import ol_interaction_select from 'ol/interaction/select';
import ol_interaction_mouse from 'ol/interaction/mousewheelzoom';
import ol_interaction_dragpan from 'ol/interaction/dragpan';
import ol_interaction_pinchzoom from 'ol/interaction/pinchzoom';
import ol_interaction_clickZoom from 'ol/interaction/doubleclickzoom';
import ol_interaction_dragZoom from 'ol/interaction/dragzoom';
import ol_source_tileWms from "ol/source/tilewms";
import _ol_extent_ from 'ol/extent'
import ol_ImageLayer from 'ol/layer/image'
import ol_ImageWms from 'ol/source/imagewms'

const mapInit = (config) => {


    var interactionSelectPointerMove = new ol_interaction_select({
        condition: ol_event_condition.pointerMove
    });

    window.map = new Map({
        target: 'map',
        controls: [],
        interactions: [
            interactionSelectPointerMove,
            new ol_interaction_mouse(),
            new ol_interaction_dragpan(),
            new ol_interaction_pinchzoom(),
            new ol_interaction_clickZoom(),
            new ol_interaction_dragZoom()
        ],
        layers: basemaps()
    });

    var extent = config.beyogluExtent;
    var center = _ol_extent_.getCenter(extent);
    map.setView(new View({
        extent: extent,
        center: center,
        zoom: config.initialZoom,
        minZoom: config.minZoom,
        maxZoom: config.maxZoom
    }));

    //https://viglino.github.io/ol-ext/examples/control/map.switcher.image.html
    //map.addControl (new ol_control_LayerImage());

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
    map.addLayer(ilceLayer);

    return map;
}

module.exports = {
    mapInit
}