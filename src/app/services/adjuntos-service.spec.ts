import { TestBed } from '@angular/core/testing';

import { AdjuntosService } from './adjuntos-service';

describe('AdjuntosService', () => {
  let service: AdjuntosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdjuntosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
