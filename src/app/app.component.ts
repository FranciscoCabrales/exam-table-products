import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, startWith } from 'rxjs/operators';
import { MainService } from './services/main.service';
import { Product, Category } from './models/product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Test (Example)';
  
  // Form Controls
  filterControl = new FormControl('');
  assignCategoryForm: FormGroup;
  
  // Observables
  products$!: Observable<any[]>;
  filteredProducts$!: Observable<any[]>;
  categories$!: Observable<Category[]>;
  
  // Component state
  showAssignForm = false;
  selectedProductId: number | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private mainService: MainService,
    private fb: FormBuilder
  ) {
    // Initialize form
    this.assignCategoryForm = this.fb.group({
      productId: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get data streams
    this.products$ = this.mainService.getProductsWithCategories();
    this.categories$ = this.mainService.getCategories();

    // Setup filtered products
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.filterControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([products, filterText]) => {
        if (!filterText) {
          return products;
        }
        return products.filter(product =>
          product.name.toLowerCase().includes(filterText.toLowerCase())
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Show assign category form
  openAssignForm(productId?: number): void {
    this.showAssignForm = true;
    if (productId) {
      this.assignCategoryForm.patchValue({ productId });
    }
  }

  // Close assign category form
  closeAssignForm(): void {
    this.showAssignForm = false;
    this.assignCategoryForm.reset();
  }

  // Submit assign category form
  onAssignCategory(): void {
    if (this.assignCategoryForm.valid) {
      const { productId, categoryId } = this.assignCategoryForm.value;
      
      this.mainService.updateProductCategory(
        parseInt(productId), 
        parseInt(categoryId)
      );
      
      alert('Category assigned successfully!');
      this.closeAssignForm();
    }
  }

  // Unassign category (bonus feature)
  unassignCategory(productId: number): void {
    this.mainService.updateProductCategory(productId, null);
    alert('Category unassigned successfully!');
  }

  // Clear filter
  clearFilter(): void {
    this.filterControl.setValue('');
  }
}
