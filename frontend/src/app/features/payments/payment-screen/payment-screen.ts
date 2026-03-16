import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentMethod, PaymentStatus } from '../../../core/models';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-payment-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-screen.html',
  styleUrls: ['./payment-screen.css'],
})
export class PaymentScreenComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  public router = inject(Router);
  protected readonly PaymentMethod = PaymentMethod;
  protected readonly PaymentStatus = PaymentStatus;

  // Payment State
  paymentMethod = signal<PaymentMethod>(PaymentMethod.CASH);
  amountPaid = signal<number>(0);
  isProcessing = signal(false);
  customerId = signal<string | undefined>(undefined);

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.customerId.set(navigation.extras.state['customerId']);
    }
    
    // Default amount paid to grand total
    this.amountPaid.set(this.cartService.grandTotal());
  }

  // Derived Values
  changeDue = computed(() => {
    const diff = this.amountPaid() - this.cartService.grandTotal();
    return diff > 0 ? diff : 0;
  });

  amountRemaining = computed(() => {
    const diff = this.cartService.grandTotal() - this.amountPaid();
    return diff > 0 ? diff : 0;
  });

  paymentStatus = computed(() => {
    if (this.amountPaid() >= this.cartService.grandTotal()) return PaymentStatus.PAID;
    if (this.amountPaid() > 0) return PaymentStatus.PARTIAL;
    return PaymentStatus.DUE;
  });

  processTransaction() {
    this.isProcessing.set(true);

    const orderData = {
      customerId: this.customerId(),
      items: this.cartService.cartItems().map(item => ({
        medicineId: item.medicineId,
        quantity: item.quantity
      })),
      subtotal: this.cartService.subtotal(),
      discount: this.cartService.totalDiscount(),
      total_amount: this.cartService.grandTotal()
    };

    // Step 1: Create Order -> Step 2: Create Payment
    this.orderService.createOrder(orderData as any).pipe(
      switchMap(order => {
        const paymentData = {
          orderId: order.id,
          paymentMethod: this.paymentMethod(),
          amountPaid: this.amountPaid(),
          amountTotal: order.total_amount,
          changeDue: this.changeDue()
        };
        return this.orderService.processPayment(paymentData);
      })
    ).subscribe({
      next: () => {
        alert('Transaction successful!');
        this.cartService.clearCart();
        this.router.navigate(['/medicines']);
      },
      error: (err) => {
        alert('Transaction failed: ' + (err.error?.message || 'Unknown error'));
        this.isProcessing.set(false);
      }
    });
  }

  setPaymentMethod(method: PaymentMethod) {
    this.paymentMethod.set(method);
  }
}
