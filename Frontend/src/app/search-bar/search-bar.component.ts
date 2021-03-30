import { DataService } from './../services/data.service'
import { Component, OnInit } from '@angular/core'

import ol_source_vector from 'ol/source/vector';
import ol_layer_vector from 'ol/layer/vector';
import ol_feature from 'ol/feature';
import ol_format from 'ol/format/wkt';
import ol_extent from 'ol/extent';
import ol_style_fill from 'ol/style/fill';
import ol_style_stroke from 'ol/style/stroke';
import ol_style from 'ol/style/style';

import proj from 'ol/proj';
import ol_style_circle from "ol/style/circle";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor(private httpClient: HttpClient, private dataService: DataService) { }
  searchList = []
  searchResults: Array<any>;

  ngOnInit() {
  }

  onSearch(params: any) {
    this.searchResults = []
    console.log(params)
    if (params.data !== null) {
      this.httpClient.get('http://127.0.0.1:3001/search?q=' + params.target.value).subscribe((response: any) => {
        this.searchResults = response
        // console.log(this.searchResults);
        return response
      })
    }
  }
}
