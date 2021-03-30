import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  _selectionState: Number = 0
  _childSelectionState: Number = -1
  // _selectedCountry
  // _selectedState
  // _selectedCity
  // _selectedDistrict
  // _selectedNeighborhood
  // _selectionArray = []
  _hiearchicalLayers: any[] = []
  _hiearchicalData: any[] = []
  constructor(private http: HttpClient) {
  }

  postOWSRequest(typeName, maxFeatures?, cql_filter?) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }
    const body = new HttpParams()
      .set('service', 'WFS')
      .set('request', 'getFeature')
      .set('typeName', typeName)
      .set('cql_filter', cql_filter)
      .set('maxFeatures', maxFeatures)
      .set('outputFormat', 'application/json')

    return this.http.post(environment.GEOSERVER_OWS_URL, body, httpOptions)
  }

  postOWSRequestClickEvent(typeName, event, propertNames?, maxFeatures?, extra_cql_parameter?) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    }
    let cql_filter = 'INTERSECTS(geom, POINT(' + event.coordinate[0] + ' ' + event.coordinate[1] + '))'

    if (extra_cql_parameter !== undefined) {
      cql_filter += ' and ' + extra_cql_parameter
    }
    const body = new HttpParams()
      .set('service', 'WFS')
      .set('version', '1.0.0')
      .set('request', 'getFeature')
      .set('typeName', typeName)
      .set('cql_filter', cql_filter)
      .set('srsName', 'EPSG:3857')
      .set('outputFormat', 'application/json')
    if (maxFeatures !== undefined) {
      body.set('maxFeatures', maxFeatures)
    }
    if (propertNames !== undefined) {
      body.set('propertyName', propertNames)
    }
    return this.http.post(environment.GEOSERVER_OWS_URL, body, httpOptions)
  }

  capitalizeFirstWord(word) {
    if (word.charAt(0) === 'i') {
      return 'İ' + word.slice(1).toLowerCase()
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }
  }
}


