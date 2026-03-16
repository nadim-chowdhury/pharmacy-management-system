import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicineService, MedicineFilter } from '../../../core/services/medicine.service';
import { CartService } from '../../../core/services/cart.service';
import { Medicine } from '../../../core/models';

@Component({
  selector: 'app-medicine-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-catalog.html',
  styleUrls: ['./medicine-catalog.css'],
})
export class MedicineCatalogComponent {
  private medicineService = inject(MedicineService);
  private cartService = inject(CartService);

  // State
  medicines = signal<Medicine[]>([]);
  isLoading = signal(false);
  
  // Filters
  searchTerm = signal('');
  statusFilter = signal('ALL');
  
  currentPage = signal(1);
  pageSize = signal(12);
  totalItems = signal(0);

  constructor() {
    // Re-fetch when filters or page changes
    effect(() => {
      this.loadMedicines();
    }, { allowSignalWrites: true });
  }

  loadMedicines() {
    this.isLoading.set(true);
    const filter: MedicineFilter = {
      search: this.searchTerm(),
      status: this.statusFilter() === 'ALL' ? undefined : this.statusFilter(),
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    this.medicineService.getMedicines(filter).subscribe({
      next: (response) => {
        this.medicines.set(response.data);
        this.totalItems.set(response.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  setStatus(status: string) {
    this.statusFilter.set(status);
    this.currentPage.set(1);
  }

  addToCart(medicine: Medicine) {
    this.cartService.addToCart(medicine);
  }

  isInCart(medicineId: string): boolean {
    return this.cartService.cartItems().some(i => i.medicineId === medicineId);
  }
}
