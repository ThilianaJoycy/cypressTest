import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { CategoriesComponent } from './categories.component';
import { CategoriesDetailComponent } from './categories-detail.component';
import { CategoriesUpdateComponent } from './categories-update.component';
import { CategoriesDeletePopupComponent, CategoriesDeleteDialogComponent } from './categories-delete-dialog.component';
import { categoriesRoute, categoriesPopupRoute } from './categories.route';

const ENTITY_STATES = [...categoriesRoute, ...categoriesPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategoriesComponent,
    CategoriesDetailComponent,
    CategoriesUpdateComponent,
    CategoriesDeleteDialogComponent,
    CategoriesDeletePopupComponent
  ],
  entryComponents: [CategoriesDeleteDialogComponent]
})
export class ProductsCategoriesModule {}
