import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatListModule
} from '@angular/material'
import { SearchBarComponent } from './search-bar/search-bar.component'
import { MapComponent } from './map/map.component'
import { BaseMapFabComponent } from './base-map-fab/base-map-fab.component'
import { ZoomButtonComponent } from './zoom-button/zoom-button.component'


@NgModule({
  declarations: [AppComponent, MapComponent, BaseMapFabComponent, ZoomButtonComponent, SearchBarComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
