import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentScreen } from './payment-screen';

describe('PaymentScreen', () => {
  let component: PaymentScreen;
  let fixture: ComponentFixture<PaymentScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentScreen],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentScreen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
