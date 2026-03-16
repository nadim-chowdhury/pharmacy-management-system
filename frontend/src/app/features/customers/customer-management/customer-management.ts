import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models';

@Component({
  selector: 'app-customer-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-management.html',
  styleUrls: ['./customer-management.css'],
})
export class CustomerManagementComponent {
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  isLoading = signal(false);
  isAdding = signal(false);

  customerForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9+]{10,15}$')]],
    email: ['', [Validators.email]],
    address: [''],
    is_business: [false]
  });

  constructor() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.isLoading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (res) => {
        this.customers.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      this.customerService.createCustomer(this.customerForm.value as any).subscribe({
        next: () => {
          this.loadCustomers();
          this.isAdding.set(false);
          this.customerForm.reset({ is_business: false });
        },
        error: (err) => alert(err.error?.message || 'Error creating customer')
      });
    }
  }
}
