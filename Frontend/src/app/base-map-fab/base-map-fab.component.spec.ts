import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { BaseMapFabComponent } from './base-map-fab.component'

describe('BaseMapFabComponent', () => {
  let component: BaseMapFabComponent
  let fixture: ComponentFixture<BaseMapFabComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMapFabComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMapFabComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
