export interface Product {
    id: number;
    name: string;
    upc: string;
    categoryId?: number | null;
  }
  
  export interface Category {
    id: number;
    name: string;
  }