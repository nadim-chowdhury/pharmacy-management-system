import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models';

@Component({
  selector: 'app-order-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-cart.html',
  styleUrls: ['./order-cart.css'],
})
export class OrderCartComponent {
  cartService = inject(CartService);
  customerService = inject(CustomerService);
  private router = inject(Router);
  protected readonly Number = Number;

  // Customer State
  customers = signal<Customer[]>([]);
  selectedCustomer = signal<Customer | null>(null);
  customerSearch = signal('');

  searchCustomers() {
    if (this.customerSearch().length > 2) {
      this.customerService.getCustomers(this.customerSearch()).subscribe({
        next: (res) => this.customers.set(res.data),
      });
    } else {
      this.customers.set([]);
    }
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer.set(customer);
    this.customers.set([]);
    this.customerSearch.set(customer.name);
  }

  clearCustomer() {
    this.selectedCustomer.set(null);
    this.customerSearch.set('');
  }

  proceedToPayment() {
    if (this.cartService.cartItems().length > 0) {
      // Store selected customer in cart service or session if needed
      // For now, we'll pass it via the state or a dedicated order service
      this.router.navigate(['/payments'], { 
        state: { customerId: this.selectedCustomer()?.id } 
      });
    }
  }

  updateQuantity(id: string, event: Event) {
    const qty = (event.target as HTMLInputElement).valueAsNumber;
    this.cartService.updateQuantity(id, qty);
  }
}
