import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineCatalog } from './medicine-catalog';

describe('MedicineCatalog', () => {
  let component: MedicineCatalog;
  let fixture: ComponentFixture<MedicineCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicineCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
