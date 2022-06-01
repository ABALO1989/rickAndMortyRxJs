


import { SupplierData } from './suppliers/supplier-data';
import { Supplier } from './suppliers/supplier';

export class AppData {

  createDb(): { suppliers: Supplier[] } {

  
    const suppliers = SupplierData.suppliers;
    return {  suppliers };
  }
}
