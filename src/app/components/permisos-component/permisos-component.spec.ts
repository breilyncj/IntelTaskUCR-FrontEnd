import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermisosComponent } from './permisos-component';

describe('PermisosComponent', () => {
  let component: PermisosComponent;
  let fixture: ComponentFixture<PermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermisosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
