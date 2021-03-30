import { TestBed, inject } from '@angular/core/testing'

import { MapService } from './map.service'

describe('MapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService]
    })
  })

  it('should be created', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy()
  }))

  it('should have _view undefined', inject([MapService], (service: MapService) => {
    expect(service._view).toBeUndefined()
  }))

  it('should have _map undefined', inject([MapService], (service: MapService) => {
    expect(service._map).toBeUndefined()
  }))

  // describe('Map Initialize', () => {
  //   it('should be filled when function triggered', inject([MapService], (service: MapService) => {
  //     // TODO: Work For Way out trial test
  //   }))
  // })
})
