import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiCalendarioComponent } from './mi-calendario-component';

describe('MiCalendarioComponent', () => {
  let component: MiCalendarioComponent;
  let fixture: ComponentFixture<MiCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiCalendarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
