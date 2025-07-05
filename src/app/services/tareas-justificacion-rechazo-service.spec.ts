import { TestBed } from '@angular/core/testing';

import { TareasJustificacionRechazoService } from './tareas-justificacion-rechazo-service';

describe('TareasJustificacionRechazoService', () => {
  let service: TareasJustificacionRechazoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareasJustificacionRechazoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
