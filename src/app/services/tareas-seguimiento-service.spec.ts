import { TestBed } from '@angular/core/testing';

import { TareasSeguimientoService } from './tareas-seguimiento-service';

describe('TareasSeguimientoService', () => {
  let service: TareasSeguimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareasSeguimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
