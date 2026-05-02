import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ProductService,
  ProductItem
} from '../services/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Product implements OnInit {

  products: ProductItem[] = [];
  filteredProducts: ProductItem[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  isLoading: boolean = false;
  userName: string = '';

  // Pagination to avoid rendering thousands of items at once
  pageSize = 50;
  displayedCount = this.pageSize;
  get displayedProducts(): ProductItem[] {
    return this.filteredProducts.slice(0, this.displayedCount);
  }

  constructor(private router: Router, private productService: ProductService, private cdr: ChangeDetectorRef) {

    const user = localStorage.getItem('user');
    this.userName = user? JSON.parse(user).userName: '';
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {

    this.productService.getCategories().subscribe({

      next: (response: string[]) => {
        console.log('Categories:', response);
        this.categories = response || [];
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Failed to load categories', error);
        this.categories = [];
      }
    });
  }

  loadProducts(): void {

    this.isLoading = true;

    this.productService.getAllProducts().subscribe({

      next: (response: ProductItem[]) => {
        console.log('Products:', response);
        this.products = response || [];
        this.filteredProducts = [...this.products];
        // reset displayed count and update view
        this.displayedCount = this.pageSize;
        this.isLoading = false;
        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Failed to load products', error);
        this.products = [];
        this.filteredProducts = [];
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter(): void {

    if (
      this.selectedCategory === 'All'
    ) {

      this.filteredProducts = [...this.products];

    } else {

      this.filteredProducts =
        this.products.filter(

          (product) =>
            product.category ===
            this.selectedCategory
        );
    }
  }

  onCategoryChange(): void {
    this.applyFilter();
    this.displayedCount = this.pageSize;
    this.cdr.markForCheck();
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/signin']);
  }
}