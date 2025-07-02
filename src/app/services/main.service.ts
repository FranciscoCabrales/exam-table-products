import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Product, Category } from '../models/product.model';

const CATEGORIES: Category[] = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Arts' },
  { id: 3, name: 'Books' },
];

const PRODUCTS: Product[] = [
  { id: 101, name: 'Laptop', upc: '012345678905', categoryId: null },
  { id: 102, name: 'Teddy', upc: '012345678915', categoryId: null },
  { id: 103, name: 'Keyboard', upc: '012345678925', categoryId: null },
];

@Injectable({
  providedIn: 'root'
})
export class MainService {
  private productsSubject = new BehaviorSubject<Product[]>(PRODUCTS);
  private categoriesSubject = new BehaviorSubject<Category[]>(CATEGORIES);

  constructor() {}

  // Get current products
  getProducts(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  // Get categories
  getCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  // Get products with category names
  getProductsWithCategories(): Observable<any[]> {
    return combineLatest([
      this.productsSubject,
      this.categoriesSubject
    ]).pipe(
      map(([products, categories]) => 
        products.map(product => ({
          ...product,
          categoryName: product.categoryId 
            ? categories.find(cat => cat.id === product.categoryId)?.name 
            : 'No Category'
        }))
      )
    );
  }

  // Update product's category
  updateProductCategory(productId: number, categoryId: number | null): void {
    const currentProducts = this.productsSubject.value;
    const updatedProducts = currentProducts.map(product =>
      product.id === productId
        ? { ...product, categoryId }
        : product
    );
    this.productsSubject.next(updatedProducts);
  }

  // Get category by ID
  getCategoryById(categoryId: number): string {
    const categories = this.categoriesSubject.value;
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  }
}
