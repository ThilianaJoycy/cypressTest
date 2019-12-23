import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'products',
        loadChildren: () => import('./products/products/products.module').then(m => m.ProductsProductsModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('./products/categories/categories.module').then(m => m.ProductsCategoriesModule)
      },
      {
        path: 'providers',
        loadChildren: () => import('./providers/providers/providers.module').then(m => m.ProvidersProvidersModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class GatewayEntityModule {}
