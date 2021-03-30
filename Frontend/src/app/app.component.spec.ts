import { TestBed, waitForAsync } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { BaseMapComponent } from './base-map-fab/base-map/base-map.component'
import { MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule, MatCardModule } from '../../node_modules/@angular/material'
describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, BaseMapComponent
      ], imports: [
        MatIconModule,
      ]
    }).compileComponents()
  }))
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  })
  it('should have div with Map', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const compiled = fixture.debugElement.nativeElement
    const mapDiv = compiled.getElementsByClassName('fullMap')
    expect(mapDiv).toBeTruthy()
  })
  it('should have baseMap Button', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.getElementsByClassName('fabBaseMapButton')).toBeTruthy()
  })
  describe('Zoom', () => {
    it('should have zoom in out button', () => {
      const fixture = TestBed.createComponent(AppComponent)
      const compiled = fixture.debugElement.nativeElement
      expect(compiled.getElementsByClassName('zoomButton').length).toEqual(2)
    })

    it('should have zoom in when function triggered', (done) => {
      const fixture = TestBed.createComponent(AppComponent)
      fixture.detectChanges()
      const app = fixture.debugElement.componentInstance
      const beforeZoom = app.mapService._view.getZoom()
      app.zoomInMap()
      setTimeout(() => {
        expect(app.mapService._view.getZoom()).toBe(beforeZoom + 1)
        done()
      }, 500)
    })

    it('should have zoom out when function triggered', (done) => {
      const fixture = TestBed.createComponent(AppComponent)
      fixture.detectChanges()
      const app = fixture.debugElement.componentInstance
      const beforeZoom = app.mapService._view.getZoom()
      app.zoomOutMap()
      setTimeout(() => {
        expect(app.mapService._view.getZoom()).toBe(beforeZoom - 1)
        done()
      }, 500)
    })
  })

})



