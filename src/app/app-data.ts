import { InMemoryDbService } from 'angular-in-memory-web-api';

import { ProductData } from './characters/product-data';
import { ProductCategoryData } from './product-categories/product-category-data';
import { SupplierData } from './suppliers/supplier-data';
import { Product } from './characters/character';
import { ProductCategory } from './product-categories/product-category';
import { Supplier } from './suppliers/supplier';

export class AppData implements InMemoryDbService {

  createDb(): { products: Product[], productCategories: ProductCategory[], suppliers: Supplier[] } {
    const products = ProductData.products;
    const productCategories = ProductCategoryData.categories;
    const suppliers = SupplierData.suppliers;
    return { products, productCategories, suppliers };
  }
}
