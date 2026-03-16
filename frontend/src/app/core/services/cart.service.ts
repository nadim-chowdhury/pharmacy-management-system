import { Injectable, signal, computed } from '@angular/core';
import { Medicine, OrderItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // State
  cartItems = signal<OrderItem[]>([]);

  // Derived state
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  subtotal = computed(() => 
    this.cartItems().reduce((acc, item) => 
      acc + (Number(item.medicine?.price || 0) * item.quantity), 0
    )
  );

  totalDiscount = computed(() => 
    this.cartItems().reduce((acc, item) => {
      const price = Number(item.medicine?.price || 0);
      const discount = Number(item.medicine?.discount_percentage || 0);
      return acc + (price * item.quantity * (discount / 100));
    }, 0)
  );

  grandTotal = computed(() => this.subtotal() - this.totalDiscount());

  addToCart(medicine: Medicine) {
    const items = this.cartItems();
    const existingIndex = items.findIndex(i => i.medicineId === medicine.id);

    if (existingIndex > -1) {
      const updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + 1
      };
      this.cartItems.set(updatedItems);
    } else {
      this.cartItems.set([...items, { 
        medicineId: medicine.id, 
        quantity: 1, 
        medicine: medicine 
      }]);
    }
  }

  removeFromCart(medicineId: string) {
    this.cartItems.update(items => items.filter(i => i.medicineId !== medicineId));
  }

  updateQuantity(medicineId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(medicineId);
      return;
    }
    
    this.cartItems.update(items => items.map(item => 
      item.medicineId === medicineId ? { ...item, quantity } : item
    ));
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
