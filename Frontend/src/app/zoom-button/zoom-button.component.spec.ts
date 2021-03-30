import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ZoomButtonComponent } from './zoom-button.component'

describe('ZoomButtonComponent', () => {
  let component: ZoomButtonComponent
  let fixture: ComponentFixture<ZoomButtonComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomButtonComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomButtonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
