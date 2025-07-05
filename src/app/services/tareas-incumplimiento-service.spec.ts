import { TestBed } from '@angular/core/testing';

import { TareasIncumplimientoService } from './tareas-incumplimiento-service';

describe('TareasIncumplimientoService', () => {
  let service: TareasIncumplimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareasIncumplimientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
